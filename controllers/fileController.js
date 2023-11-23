const File = require("../models/fileModel");
const FileShare = require("../models/fileShareModel");
const emailHandler = require("../utils/email-handler.js");
const amqp = require("amqplib");
require("dotenv").config();
const rabbitmqURL = process.env.AMQP_URL;

const { v4: uuidv4 } = require("uuid");

async function getAllFiles(req) {
  const files = await File.find({ userid: req.body.userid });
  return {
    status: 200,
    response: {
      files,
    },
  };
}

async function shareFile(req) {
  const files = await File.findOne({ fileid: req.body.fileid });
  const fileshare = new FileShare({
    shareid: uuidv4(),
    file: {
      id: req.body.fileid,
      name: files.filename,
      location: files.location,
      key: files.key,
      shared_by: req.body.name,
    },
    email: req.body.email,
    password: req.body.password,
  });
  await fileshare.save();

  if (files.mimetype == "video/mp4") {
    sendToCompressionQueue({
      senderName: req.body.name,
      fileUrl: process.env.BaseUrl + "/download/" + fileshare.shareid,
      emailReceiver: "<" + req.body.email + ">",
      shareid: fileshare.shareid,
      s3Key: files.key,
    });
    return {
      status: 200,
      response: {
        message: "File Send for compression and will be shared on soon!",
      },
    };
  } else {
    sendToEmailQueue({
      senderName: req.body.name,
      fileUrl: process.env.BaseUrl + "/download/" + fileshare.shareid,
      emailReceiver: "<" + req.body.email + ">",
      shareid: files.shareid,
    });
    // emailHandler.sendFileSharingEmail({
    // });
    console.log("File Shared", fileshare);
    return {
      status: 200,
      response: {
        message: "File Shared Successfully!",
      },
    };
  }
}

async function saveFile(req, res, next) {
  if (!req.files) {
    return {
      status: 400,
      response: { error: "No files were uploaded." },
    };
  } else {
    const newfile = new File({
      fileid: uuidv4(),
      key: req.files[0].key,
      userid: req.body.userid,
      filename: req.files[0].originalname,
      filesize: req.files[0].size,
      mimetype: req.files[0].mimetype,
      location: req.files[0].location,
    });
    await newfile.save();
    console.log("File Saved", newfile);
    return {
      status: 200,
      response: {
        message: "Successfully uploaded " + req.files.length + " files!",
        files: req.files,
      },
    };
  }
}

async function sendToCompressionQueue(jsonMessage) {
  try {
    const queueName = "compression_request_queue";
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(jsonMessage)));
    console.log(
      `Compression request sent to queue "${queueName}":`,
      jsonMessage
    );

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

async function sendToEmailQueue(jsonMessage) {
  try {
    const queueName = "email_queue";
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(jsonMessage)));
    console.log(`Email request sent to queue "${queueName}":`, jsonMessage);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = {
  saveFile,
  getAllFiles,
  shareFile,
};
