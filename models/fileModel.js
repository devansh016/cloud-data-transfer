const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const fileSchema = new Schema({
  fileid: {
    type: String,
    unique: true,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
  },
  filesize: {
    type: String,
  },
  mimetype: {
    type: String,
  },
  location: {
    type: String,
  },
  key: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

fileSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id;
  },
});

fileSchema.methods = {};

module.exports = mongoose.model("File", fileSchema);
