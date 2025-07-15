const express = require("express");
const imageRouter = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const ImageModel = require("../models/image");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var storage = multer.diskStorage({
  destination: "public/partner/documents/",
  filename: function (req, file, cb) {
    //req.body is empty...
    //How could I get the new_file_name property sent from client here?
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

imageRouter.post("/upload", upload.array("attachment"), uploadFiles);
async function uploadFiles(req, res) {
  //   console.log(req.body);
  const savedFiles = await ImageModel.insertMany(
    req.files.map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
    }))
  );

  // Return inserted document IDs
  res.json({
    message: "Files uploaded successfully!",
    image: savedFiles.map((file) => file._id),
  });
}

imageRouter.post("/upload-single", upload.single("attachment"), uploadFile);
async function uploadFile(req, res) {
  const image = await ImageModel.create({
    filename: req.file.filename,
    path: req.file.path,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });

  //   console.log(image.id);

  res
    .status(201)
    .json({ message: "Image uploaded successfully", image: image._id });
}

module.exports = imageRouter;
