const express = require("express");
const {
  createUser,
  listUser,
  getUser,
  updateUser,
  deleteUser,
  login,
  verifyAdmin,
  getOrders,
  firstImpression,
  createSeoPage,
  getSeoPage,
  editSeoPage,
  updateSeoPage,
  deleteSeoPage,
  createBlog,
  getAllBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  listShop,
  fileUploads,
  deleteUploads,
  userJourney,
  getShops,
  changeShopStatus,
  updateShop,
  commissions,
  CUcommissions,
  partnerEarning,
  earningPayout,
} = require("../controller/adminController");
const adminRouter = express.Router();

adminRouter.get("/impression/:id", firstImpression);
adminRouter.post("/create-user", verifyAdmin, createUser);
adminRouter.get("/list-user", verifyAdmin, listUser);
adminRouter.get("/get-user/:editid", verifyAdmin, getUser);
adminRouter.post("/update-user/:editid", verifyAdmin, updateUser);
adminRouter.get("/delete-user/:deleteid", verifyAdmin, deleteUser);
adminRouter.post("/login", login);
adminRouter.post("/get-orders", verifyAdmin, getOrders);
adminRouter.post("/create-page", verifyAdmin, createSeoPage);
adminRouter.get("/get-page", verifyAdmin, getSeoPage);
adminRouter.get("/edit-page/:editid", verifyAdmin, editSeoPage);
adminRouter.post("/update-page/:editid", verifyAdmin, updateSeoPage);
adminRouter.get("/delete-page/:deleteid", verifyAdmin, deleteSeoPage);
adminRouter.post("/create-blog", verifyAdmin, createBlog);
adminRouter.get("/get-blog", verifyAdmin, getAllBlog);
adminRouter.get("/edit-blog/:slug", verifyAdmin, getBlog);
adminRouter.post("/update-blog/:slug", verifyAdmin, updateBlog);
adminRouter.get("/delete-blog/:slug", verifyAdmin, deleteBlog);
adminRouter.get("/shops", verifyAdmin, listShop);
adminRouter.delete("/file-uploads", verifyAdmin, deleteUploads);
adminRouter.get("/file-uploads", verifyAdmin, fileUploads);
adminRouter.get("/user-journey", verifyAdmin, userJourney);
adminRouter.get("/all-shops", verifyAdmin, getShops);
adminRouter.patch("/shop-status/:id", verifyAdmin, changeShopStatus);
adminRouter.put("/shops/:id", verifyAdmin, updateShop);
adminRouter.get("/commissions", verifyAdmin, commissions);
adminRouter.post("/commissions", verifyAdmin, CUcommissions);
adminRouter.get("/partner-earnings", verifyAdmin, partnerEarning);
adminRouter.patch("/partner-earnings/:id/pay", verifyAdmin, earningPayout);

module.exports = adminRouter;
