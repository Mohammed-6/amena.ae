const { OrderModel } = require("../models/fileUploadModel");
const { ShopModel } = require("../models/partner");
const {
  PartnerEarningModel,
  PartnerCommissionModel,
} = require("../models/partnerEarning");

const getOrders = async (req, res) => {
  try {
    const orderDetails = await OrderModel.find({
      shopId: req.params.id,
      orderStatus: "waiting",
    })
      .populate({
        path: "address",
        select: ["name", "phone", "area"],
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Order list", order: orderDetails });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const getShop = async (req, res) => {
  try {
    const shopDetails = await ShopModel.findOne({
      _id: req.params.id,
    });
    res.status(200).json({ message: "Shop details", shop: shopDetails });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const updateShop = async (req, res) => {
  try {
    const shopDetails = await ShopModel.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: {
          address: req.body.address,
          phone: req.body.phone,
          location: req.body.location,
          openingHours: req.body.openingHours,
        },
      }
    );
    res.status(200).json({ message: "Shop details", shop: shopDetails });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const sendToDelivery = async (req, res) => {
  const { orderId } = req.body;
  try {
    await OrderModel.findOneAndUpdate(
      { orderId },
      { orderStatus: "out for delivery" }
    );
    res.status(200).json({ message: "Order marked for delivery" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
};

// GET /api/admin/commissions
async function getPartnerCommissions(req, res) {
  try {
    const { fromDate, toDate, status, page = 1, limit = 10 } = req.query;
    const query = {};

    // Date filtering
    if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    }

    // Status filtering
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await PartnerEarningModel.countDocuments(query);

    const commissions = await PartnerEarningModel.find(query)
      // .populate("partner", "name email")
      .populate("shopId", "shopName")
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      commissions,
    });
  } catch (err) {
    console.error("Error fetching commissions:", err);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  getOrders,
  getShop,
  updateShop,
  sendToDelivery,
  getPartnerCommissions,
};
