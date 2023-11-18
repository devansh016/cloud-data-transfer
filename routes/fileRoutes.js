const express = require("express");
const router = express.Router();
const { upload } = require("../utils/s3Uploader");
const uploadController = require("../controllers/fileController");
const authenticateUser = require("../utils/authenticate");

router.get("/", authenticateUser, getAllFiles);
router.post("/share", authenticateUser, shareFile);

router.post(
  "/upload",
  authenticateUser,
  upload.array("inputFile", 3),
  authenticateUser,
  uploadFile
);

// Upload a file
function getAllFiles(req, res, next) {
  uploadController.getAllFiles(req, res, next).then((data) => {
    res.status(data.status).send(data.response);
  });
}

// Get all file upload by the user
function uploadFile(req, res, next) {
  uploadController.saveFile(req).then((data) => {
    res.status(data.status).send(data.response);
  });
}

function shareFile(req, res, next) {
  uploadController.shareFile(req).then((data) => {
    res.status(data.status).send(data.response);
  });
}

module.exports = router;
