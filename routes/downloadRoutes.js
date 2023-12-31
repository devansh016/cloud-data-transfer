const express = require("express");
const aws = require("aws-sdk");
const router = express.Router();
const FileShare = require("../models/fileShareModel");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_DEFAULT_REGION,
});

router.get("/download-file", downloadfile);
router.get("/download/:shareid", displayDonwload);

async function displayDonwload(req, res, next) {
  const file_share = await FileShare.findOne({ shareid: req.params.shareid });
  console.log(file_share);
  console.log("File Download Page Viewed", file_share);
  res.render("download.ejs", {
    data: file_share,
  });
}

async function downloadfile(req, res, next) {
  const file_share = await FileShare.findOne({ shareid: req.query.shareid });
  if (file_share.password != req.query.password) {
    res.status(400).json({ message: "Wrong Password" });
  } else {
    res.attachment(file_share.file.name);
    var file = s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: file_share.file.key,
      })
      .createReadStream()
      .on("error", (error) => {});
    res.attachment;
    file.pipe(res);
    console.log("File Downloaded", file_share);
  }
}

module.exports = router;
