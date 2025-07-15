const mongoose = require("mongoose");
const ImageModel = require("./image");
const bcrypt = require("bcrypt");

const PartnerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    onboardingStatus: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const companyDetailsSchema = new mongoose.Schema({
  companyName: String,
  tradeLicense: { type: mongoose.Schema.Types.ObjectId, ref: ImageModel },
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  vatCertificate: { type: mongoose.Schema.Types.ObjectId, ref: ImageModel },
  agreementAccepted: Boolean,
});

const shopDetailsSchema = new mongoose.Schema({
  shopName: String,
  shopPhotos: [{ type: mongoose.Schema.Types.ObjectId, ref: ImageModel }],
  address: String,
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true },
  },
  phone: Number,
  openingDate: String,
  website: String,
  businessLocation: String,
  serviceArea: { type: String },
  openingHours: { type: Object, required: true },
});

const printerDetailsSchema = new mongoose.Schema({
  printerName: String,
  brand: String,
  model: String,
  colorRate: String,
  bwRate: String,
  paperSize: String,
  connectivity: [String],
});

const bankDetailsSchema = new mongoose.Schema({
  bankName: String,
  accountHolder: String,
  accountNumber: String,
  iban: String,
  branch: String,
  swiftCode: String,
});

const OnboardingSchema = new mongoose.Schema(
  {
    companyDetails: companyDetailsSchema,
    shopDetails: shopDetailsSchema,
    printerDetails: printerDetailsSchema,
    bankDetails: bankDetailsSchema,
    companyDetailsSubmit: { type: Boolean, required: true, default: false },
    shopDetailsSubmit: { type: Boolean, required: true, default: false },
    printerDetailsSubmit: { type: Boolean, required: true, default: false },
    bankDetailsSubmit: { type: Boolean, required: true, default: false },
    paymentSubmit: { type: Boolean, default: false },
    formSubmit: { type: Boolean, default: false },
    adminApproved: Boolean,
    adminApprovedDescription: String,
    agentId: { type: mongoose.Schema.Types.ObjectId },
    applicationStatus: { type: String },
    partnerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    resubmit: Boolean,
  },
  {
    timestamps: true,
  }
);

const ShopSchema = new mongoose.Schema(
  {
    partnerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ...shopDetailsSchema.obj,
    printerDetails: { ...printerDetailsSchema.obj },
    staus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const BankSchema = new mongoose.Schema(
  {
    partnerId: { type: mongoose.Schema.Types.ObjectId, reuquired: true },
    ...bankDetailsSchema.obj,
    staus: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
// ✅ Ensure index is created
ShopSchema.index({ location: "2dsphere" });

const PartnerModel = mongoose.model("partner", PartnerSchema);
const OnboardingModel = mongoose.model("onboarding", OnboardingSchema);
const ShopModel = mongoose.model("shop", ShopSchema);
const BankModel = mongoose.model("bank", BankSchema);

module.exports.PartnerModel = PartnerModel;
module.exports.OnboardingModel = OnboardingModel;
module.exports.ShopModel = ShopModel;
module.exports.BankModel = BankModel;
