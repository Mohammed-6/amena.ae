const express = require("express");
const {
  getOrders,
  getShop,
  updateShop,
  sendToDelivery,
  getPartnerCommissions,
} = require("../controller/partner");
const partnerRouter = express.Router();

partnerRouter.get("/get-order/:id", getOrders);
partnerRouter.get("/get-shop/:id", getShop);
partnerRouter.post("/update-shop/:id", updateShop);
partnerRouter.post("/send-to-delivery", sendToDelivery);
partnerRouter.get("/commisions", getPartnerCommissions);

module.exports = partnerRouter;
