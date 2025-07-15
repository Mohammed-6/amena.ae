// models/PartnerEarning.js
const mongoose = require("mongoose");
const { ShopModel } = require("./partner");
const { OrderModel } = require("./fileUploadModel");

const PartnerEarningSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ShopModel,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: OrderModel,
      required: true,
    },
    totalAmount: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    payableAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports.PartnerEarningModel = mongoose.model(
  "PartnerEarning",
  PartnerEarningSchema
);

// models/PartnerCommission.js
const PartnerCommissionSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ShopModel,
      required: true,
      unique: true,
    },
    commissionRate: { type: Number, required: true }, // e.g. 20 for 20%
  },
  { timestamps: true }
);

module.exports.PartnerCommissionModel = mongoose.model(
  "PartnerCommission",
  PartnerCommissionSchema
);
