const amqp = require("amqplib");
const fileShareModel = require("../models/fileShareModel");
const emailHandler = require("../utils/email-handler.js");
const rabbitmqURL = process.env.AMQP_URL;

async function consumeMessages_compression_result_queue() {
  try {
    // Create a connection to RabbitMQ server
    const queueName = "compression_result_queue";
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();
    channel.prefetch(1);
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Waiting for messages from queue "${queueName}"...`);

    // Consume messages from the queue
    channel.consume(queueName, async (message) => {
      if (message !== null) {
        const jsonMessage = JSON.parse(message.content.toString());
        console.log(`Received message from queue "${queueName}":`, jsonMessage);

        const uploadResult = await fileShareModel.findOneAndUpdate(
          { shareid: jsonMessage.shareid },
          {
            "file.compressed": true,
            "file.location": jsonMessage.CompressedFileUrl,
          },
          { new: true }
        );
        console.log(jsonMessage.shareid);
        emailHandler.sendFileSharingEmail({
          senderName: uploadResult.file.shared_by,
          fileUrl,
          emailReceiver,
        });
        sendToEmailQueue({
          senderName: uploadResult.file.shared_by,
          fileUrl: process.env.BaseUrl + "/download/" + uploadResult.shareid,
          emailReceiver: "<" + uploadResult.email + ">",
          shareid: uploadResult.shareid,
        });
        console.log("Compression Result Processed.");
        channel.ack(message);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = consumeMessages_compression_result_queue;
