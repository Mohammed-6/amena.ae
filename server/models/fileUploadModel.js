const mongoose = require("mongoose");
const { ShopModel } = require("./partner");

const FileUploadSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: false },
    sessionId: { type: String, required: true },
    originalFilename: { type: String, required: true },
    filename: { type: String, required: true },
    fileLocation: { type: String, required: true },
    fileThumbnail: { type: String, required: true },
    noPages: { type: Number, required: true },
  },
  { timestamps: true }
);

const CustomerSchema = new mongoose.Schema(
  {
    clientId: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    otp: { type: Number, required: false },
    optVerfied: { type: Boolean },
  },
  { timestamps: true }
);

const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    addressType: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    area: { type: String, required: true },
    landmark: { type: String, required: false },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    name: { type: String, required: true },
    phone: { type: String, required: false },
  },
  { timestamps: true }
);

const AddressModel = mongoose.model("address", AddressSchema);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    sessionId: { type: String, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: AddressModel,
    },
    customization: { type: Object, required: true },
    grandAmount: { type: Number, required: true },
    amountBreakdown: { type: Object, required: false },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ShopModel,
      required: false,
    },
    orderStatus: String,
    mergedPdf: String,
  },
  { timestamps: true }
);

const userJourneySchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  pathname: {
    type: String,
    required: true,
  },
  query: {
    type: Object,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
  },
  ip: {
    type: String,
  },
});

const SearchAddressSchema = new mongoose.Schema(
  {
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

function makestr(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function makeid(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const FileUploadModel = mongoose.model("fileUpload", FileUploadSchema);
const CustomerModel = mongoose.model("customer", CustomerSchema);
const OrderModel = mongoose.model("order", OrderSchema);
const UserJourneyModel = mongoose.model("UserJourney", userJourneySchema);
const SearchAddressModel = mongoose.model("searchAddress", SearchAddressSchema);

module.exports.FileUploadModel = FileUploadModel;
module.exports.CustomerModel = CustomerModel;
module.exports.AddressModel = AddressModel;
module.exports.OrderModel = OrderModel;
module.exports.UserJourneyModel = UserJourneyModel;
module.exports.SearchAddressModel = SearchAddressModel;
module.exports.makeid = makeid;
module.exports.makestr = makestr;
