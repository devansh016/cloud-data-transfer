const amqp = require("amqplib");
const fileShareModel = require("../models/fileShareModel");
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
        sendToEmailQueue({
          senderName: uploadResult.file.shared_by,
          fileUrl: process.env.BaseUrl + "/download/" + fileshare.shareid,
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

module.exports = consumeMessages_compression_result_queue;
