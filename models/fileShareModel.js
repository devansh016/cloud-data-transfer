const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("dotenv").config();

const fileShareSchema = new Schema({
  shareid: {
    type: String,
  },
  file: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    compressed: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    key: {
      type: String,
    },
    shared_by: {
      type: String,
    },
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  shared: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

fileShareSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id;
  },
});

fileShareSchema.methods = {};

module.exports = mongoose.model("File Share", fileShareSchema);
