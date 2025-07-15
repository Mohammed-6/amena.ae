const { UserModel, SeoPageModel, BlogModel } = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const {
  OrderModel,
  makestr,
  FileUploadModel,
  UserJourneyModel,
} = require("../models/fileUploadModel");
const { ShopModel } = require("../models/partner");
const moment = require("moment");
const {
  PartnerEarningModel,
  PartnerCommissionModel,
} = require("../models/partnerEarning");
const firstImpression = (req, res) => {
  const clientToken = req.headers["sessionid"];

  // console.log(clientToken);
  if (!clientToken) {
    // No token, generate a new one
    const newToken = jwt.sign(
      { sessionId: makestr(35), id: req.params.id },
      "information",
      {
        expiresIn: "3d", // Adjust expiration time as needed
      }
    );
    res.json({ token: newToken }); // 1 hour
    return res.status(200).json({ token: newToken });
  }

  try {
    // Verify existing token
    const decoded = jwt.verify(clientToken, "information");
    return res.status(200).json({ token: clientToken, decoded });
  } catch (err) {
    // Token expired or invalid, generate a new one
    if (err.name === "TokenExpiredError") {
      const newToken = jwt.sign({ sessionId: makestr(35) }, "information", {
        expiresIn: "3d",
      });
      // res.json({ token: newToken, message: "Token new" }); // 1 hour
      return res
        .status(200)
        .json({ token: newToken, message: "Token refreshed" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await UserModel.create(req.body);
    res.status(200).json({ message: "User added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const listUser = async (req, res) => {
  try {
    const user = await UserModel.find({});
    res.status(200).json({ message: "User list", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById({ _id: req.params.editid }).select([
      "name",
      "email",
      "phone",
      "role",
    ]);
    res.status(200).json({ message: "User list", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body; // Get fields from request body

  const updateData = { name, email, phone, role }; // Add other fields

  // Only add password if it's not empty
  if (password) {
    // Only hash if password is provided
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    req.params.editid, // Find user by ID
    { $set: updateData } // Update only non-empty fields
  );

  res.json(updatedUser); // Send updated user data
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete({
      _id: req.params.deleteid,
    });
    res.status(200).json({ message: "User deleted", user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await UserModel.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: admin._id }, "information", {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const verifyAdmin = async (req, res, next) => {
  const token = req.header("token"); // Extract token
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, "information");

    const admin = await UserModel.findById(decoded.id);
    // console.log(decoded.id, admin);
    if (!admin) {
      return res
        .status(403)
        .json({ message: "Unauthorized. Admin access only." });
    }

    req.admin = decoded; // Attach admin details to request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

const getOrders = async (req, res) => {
  try {
    const {
      shopId,
      fromDate,
      toDate,
      customerName,
      page = 1,
      limit = 10,
    } = req.query;
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);

    const pipeline = [];

    if (shopId) {
      pipeline.push({
        $match: { shopId: new mongoose.Types.ObjectId(shopId) },
      });
    }

    if (fromDate && toDate) {
      pipeline.push({
        $match: {
          createdAt: {
            $gte: new Date(fromDate),
            $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
          },
        },
      });
    }

    pipeline.push({
      $lookup: {
        from: "addresses",
        localField: "address",
        foreignField: "_id",
        as: "address",
      },
    });

    pipeline.push({ $unwind: "$address" });

    if (customerName?.trim()) {
      const regex = new RegExp(customerName.trim(), "i");
      pipeline.push({
        $match: {
          $or: [
            { "address.name": regex },
            { "address.phone": regex },
            { "address.area": regex },
            { "address.addressLine1": regex },
          ],
        },
      });
    }

    const totalResults = await OrderModel.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);
    const total = totalResults[0]?.total || 0;

    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (pageNum - 1) * pageLimit });
    pipeline.push({ $limit: pageLimit });

    // Also look up shop info
    pipeline.push({
      $lookup: {
        from: "shops",
        localField: "shopId",
        foreignField: "_id",
        as: "shop",
      },
    });
    pipeline.push({ $unwind: "$shop" });

    const orders = await OrderModel.aggregate(pipeline);

    res.json({
      orders,
      totalPages: Math.ceil(total / pageLimit),
    });
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

const createSeoPage = async (req, res) => {
  try {
    const seopage = await SeoPageModel.create(req.body);
    res.status(200).json({ message: "SEO Page added successfully", seopage });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const getSeoPage = async (req, res) => {
  try {
    const page = await SeoPageModel.find();
    res.status(200).json({ message: "Page list", page });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const editSeoPage = async (req, res) => {
  try {
    const page = await SeoPageModel.findById({ _id: req.params.editid });
    res.status(200).json({ message: "Page list", page });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const updateSeoPage = async (req, res) => {
  try {
    const data = req.body;
    const page = await SeoPageModel.findByIdAndUpdate(
      { _id: req.params.editid },
      { $set: data }
    );
    res.status(200).json({ message: "Page updated", page });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const deleteSeoPage = async (req, res) => {
  try {
    const data = req.body;
    const page = await SeoPageModel.findByIdAndDelete({
      _id: req.params.deleteid,
    });
    res.status(200).json({ message: "Page deleted", page });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

// CREATE blog
const createBlog = async (req, res) => {
  try {
    const blog = new BlogModel(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET all blogs
const getAllBlog = async (_req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single blog by slug
const getBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE blog
const updateBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      {
        new: true,
      }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    return res.json(blog);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// DELETE blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogModel.findOneAndDelete({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listShop = async (req, res) => {
  try {
    const shop = await ShopModel.find({}).select("_id shopName");
    res.status(200).json({ message: "Shop list", shop });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const fileUploads = async (req, res) => {
  const { fromDate, toDate, page = 1, limit = 3 } = req.query;
  const query = {};

  if (fromDate && toDate) {
    query.createdAt = {
      $gte: new Date(fromDate),
      $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
    };
  }

  const total = await FileUploadModel.countDocuments(query);
  const uploads = await FileUploadModel.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    uploads,
    totalPages: Math.ceil(total / limit),
  });
};

const deleteUploads = async (req, res) => {
  const { fromDate, toDate } = req.body;

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: "fromDate and toDate required" });
  }

  const query = {
    createdAt: {
      $gte: new Date(fromDate),
      $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
    },
  };

  const files = await FileUploadModel.find(query);

  for (const file of files) {
    const filePaths = [
      path.resolve(file.fileLocation), // full path on disk
      path.resolve(file.fileThumbnail), // relative to project
    ];

    filePaths.forEach((filepath) => {
      try {
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath);
          console.log("Deleted:", filepath);
        }
      } catch (err) {
        console.warn("Failed to delete:", filepath, err.message);
      }
    });
  }

  await FileUploadModel.deleteMany(query);
  res.json({ message: "Files deleted" });
};

async function userJourney(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const now = moment();
  const startOfToday = now.clone().startOf("day");
  const startOfWeek = now.clone().startOf("week");
  const startOfMonth = now.clone().startOf("month");
  const startOfYear = now.clone().startOf("year");

  const [today, week, month, year] = await Promise.all([
    UserJourneyModel.countDocuments({
      timestamp: { $gte: startOfToday.toDate() },
    }),
    UserJourneyModel.countDocuments({
      timestamp: { $gte: startOfWeek.toDate() },
    }),
    UserJourneyModel.countDocuments({
      timestamp: { $gte: startOfMonth.toDate() },
    }),
    UserJourneyModel.countDocuments({
      timestamp: { $gte: startOfYear.toDate() },
    }),
  ]);

  const total = await UserJourneyModel.countDocuments();
  const journeys = await UserJourneyModel.find()
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    stats: { today, week, month, year },
    journeys,
    totalPages: Math.ceil(total / limit),
  });
}

async function getShops(req, res) {
  const shops = await ShopModel.find().sort({ createdAt: -1 });
  res.json(shops);
}

async function changeShopStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await ShopModel.findByIdAndUpdate(
    id,
    { staus: status },
    { new: true }
  );
  res.json(updated);
}

async function updateShop(req, res) {
  const { id } = req.params;
  const updatedShop = await ShopModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.json(updatedShop);
}

// Get all partner commissions
async function commissions(req, res) {
  const data = await PartnerCommissionModel.find().populate(
    "shopId",
    "shopName"
  );
  res.json(data);
}

// Create or update commission
async function CUcommissions(req, res) {
  const { shopId, commissionRate } = req.body;
  const existing = await PartnerCommissionModel.findOne({ shopId });
  if (existing) {
    existing.commissionRate = commissionRate;
    await existing.save();
    return res.json({ message: "Commission updated", data: existing });
  }
  const created = await PartnerCommissionModel.create({
    shopId,
    commissionRate,
  });
  res.json({ message: "Commission added", data: created });
}

// Get all partner earnings (latest first)
async function partnerEarning(req, res) {
  try {
    const {
      fromDate,
      toDate,
      shopId,
      status,
      page = 1,
      limit = 10,
    } = req.query;
    const query = {};

    if (fromDate && toDate) {
      query.createdAt = {
        $gte: new Date(fromDate),
        $lte: new Date(new Date(toDate).setHours(23, 59, 59, 999)),
      };
    }

    if (shopId) {
      query.shopId = shopId;
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await PartnerEarningModel.countDocuments(query);
    const earnings = await PartnerEarningModel.find(query)
      .populate("shopId", "shopName")
      .populate("orderId", "orderId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalItems: total,
      earnings,
    });
  } catch (error) {
    console.error("Error fetching partner earnings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Mark payout as paid
async function earningPayout(req, res) {
  const { id } = req.params;
  const updated = await PartnerEarningModel.findByIdAndUpdate(
    id,
    { status: "paid", paymentDate: new Date() },
    { new: true }
  );
  res.json({ message: "Marked as paid", updated });
}

module.exports = {
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
};
