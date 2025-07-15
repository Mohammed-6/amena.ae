const express = require("express");
const {
  uploadFiles,
  getFiles,
  removeFiles,
  login,
  otpSubmit,
  addAddress,
  listAddress,
  createOrder,
  viewOrder,
  firstImpression,
  verifyUserToken,
  getPage,
  getBlogs,
  getBlogDetails,
  getSeoSitemap,
  confirmAddress,
  deleteAddress,
  customerOrder,
} = require("../controller/fileUploadController");

const uploadRouter = express.Router();

uploadRouter.get("/impression", firstImpression);
uploadRouter.post("/file-upload", verifyUserToken, uploadFiles);
uploadRouter.post("/get-files", verifyUserToken, getFiles);
uploadRouter.post("/delete-file", verifyUserToken, removeFiles);
uploadRouter.post("/login", verifyUserToken, login);
uploadRouter.post("/otp-submit", verifyUserToken, otpSubmit);
uploadRouter.post("/add-address", verifyUserToken, addAddress);
uploadRouter.post("/list-address", verifyUserToken, listAddress);
uploadRouter.post("/create-order", verifyUserToken, createOrder);
uploadRouter.get("/view-order/:orderid", viewOrder);
uploadRouter.get("/get-page/:category/:pageid", verifyUserToken, getPage);
uploadRouter.get("/get-blogs", verifyUserToken, getBlogs);
uploadRouter.get("/get-blogDetails/:slug", verifyUserToken, getBlogDetails);
uploadRouter.get("/get-seoSitemap", getSeoSitemap);
uploadRouter.post("/confirm-address", verifyUserToken, confirmAddress);
uploadRouter.get("/delete-address/:address", verifyUserToken, deleteAddress);
uploadRouter.get("/customer-order", verifyUserToken, customerOrder);

module.exports = uploadRouter;
