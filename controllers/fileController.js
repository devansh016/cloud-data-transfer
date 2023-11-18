const File = require("../models/fileModel");
const FileShare = require("../models/fileShareModel");
const emailHandler = require("../utils/email-handler.js");
require("dotenv").config();

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
  emailHandler.sendFileSharingEmail({
    senderName: req.body.name,
    fileUrl: process.env.BaseUrl + "/download/" + fileshare.shareid,
    emailReceiver: "<" + req.body.email + ">",
  });
  console.log("File Shared", fileshare);
  return {
    status: 200,
    response: {
      message: "File Shared Successfully!",
    },
  };
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

module.exports = {
  saveFile,
  getAllFiles,
  shareFile,
};
