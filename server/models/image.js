const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ImageModel = mongoose.model("image", imageSchema);

module.exports = ImageModel;
