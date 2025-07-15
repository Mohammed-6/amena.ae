const path = require("path");
const fs = require("fs-extra");
const sharp = require("sharp");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { execSync } = require("child_process");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const moment = require("moment");
const { PDFDocument } = require("pdf-lib");
const {
  PartnerEarningModel,
  PartnerCommissionModel,
} = require("../models/partnerEarning");

const {
  FileUploadModel,
  CustomerModel,
  makestr,
  makeid,
  AddressModel,
  OrderModel,
  UserJourneyModel,
  SearchAddressModel,
} = require("../models/fileUploadModel");
const { ShopModel } = require("../models/partner");
const { SeoPageModel, BlogModel } = require("../models/admin");

const allowedMimeTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public/uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Configure multer file limits
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Max file size: 15MB
    files: 15, // Max number of files: 15
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed!"
        )
      );
    }
    cb(null, true);
  },
});

// const upload = multer({ storage });

const firstImpression = (req, res) => {
  const clientToken = req.headers["sessionid"];

  // console.log(clientToken);
  if (!clientToken) {
    // No token, generate a new one
    const newToken = jwt.sign({ sessionId: makestr(35) }, "clientInformation", {
      expiresIn: "3d", // Adjust expiration time as needed
    });
    res.json({ token: newToken }); // 1 hour
    return res.status(200).json({ token: newToken });
  }

  try {
    // Verify existing token
    const decoded = jwt.verify(clientToken, "clientInformation");
    return res.status(200).json({ token: clientToken, decoded });
  } catch (err) {
    // Token expired or invalid, generate a new one
    if (err.name === "TokenExpiredError") {
      const newToken = jwt.sign(
        { sessionId: makestr(35) },
        "clientInformation",
        {
          expiresIn: "3d",
        }
      );
      // res.json({ token: newToken, message: "Token new" }); // 1 hour
      return res
        .status(200)
        .json({ token: newToken, message: "Token refreshed" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

const uploadFiles = (req, res) => {
  //   console.log(req);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  upload.array("files")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    let filedata = [];
    for (const file of req.files) {
      let pages = 1;
      let thumbnail = "";
      if (file.mimetype === "application/pdf") {
        thumbnail = `public/resized/${file.filename}-thumbmail.jpg`;
        await generatePdfThumbnail(file.path, thumbnail);
        await countPdfPages(file.path).then((ps) => {
          pages += ps.pages - 1;
        });
      } else {
        await processImageToA4(file.path, `public/uploads/${file.filename}`);
        thumbnail = `public/resized/${file.filename}`;
        await resizeImage(file.path, thumbnail);
      }
      const decoded = jwt.verify(req.headers["sessionid"], "clientInformation");
      const fileUploadData = {
        sessionId: decoded.sessionId,
        originalFilename: file.originalname,
        filename: file.filename,
        fileLocation: file.path,
        fileThumbnail: thumbnail,
        noPages: pages,
      };
      try {
        FileUploadModel.create(fileUploadData);
        filedata.push({
          filename: file.filename,
          pages: pages,
          thumbnail: thumbnail,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed uploading file" });
      }
    }
    res
      .status(200)
      .json({ message: "Files uploaded successfully!", data: filedata });
  });
};

// A4 dimensions in pixels (at 72 DPI)
const A4_WIDTH = 595;
const A4_HEIGHT = 842;

// Convert images to A4 (Maintaining Aspect Ratio & Transparent Background)
const processImageToA4 = async (inputPath, outputPath) => {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    let newWidth, newHeight;

    if (metadata.width > metadata.height) {
      // Landscape: Fit width to A4
      newWidth = A4_WIDTH;
      newHeight = Math.round((metadata.height / metadata.width) * A4_WIDTH);
      console.log("Landscape");
    } else {
      // Portrait: Fit height to A4
      newHeight = A4_HEIGHT;
      newWidth = Math.round((metadata.width / metadata.height) * A4_HEIGHT);
      console.log("Portrait");
    }

    // Resize image while maintaining aspect ratio
    const resizedImage = await image.resize(newWidth, newHeight).toBuffer();

    // Create an A4 canvas with transparent background
    const finalImage = await sharp({
      create: {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        channels: 4, // RGBA (supports transparency)
        background: "#ffffff", // Transparent
      },
    })
      .composite([
        {
          input: resizedImage,
          left: (A4_WIDTH - newWidth) / 2,
          top: (A4_HEIGHT - newHeight) / 2,
        },
      ])
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
};

async function countPdfPages(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return { pages: data.numpages, thumbnail: "" };
  } catch (error) {
    console.error("Error reading PDF:", error);
    return null;
  }
}

// Convert PDF to images and resize them
async function resizeImage(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();

  const height = metadata.height;
  const width = metadata.width;
  if (metadata?.exif) {
    await sharp(inputPath)
      .rotate(270) // Rotate 90 degrees
      .toFile(outputPath);
  } else {
    await sharp(inputPath)
      .resize(213, 300, { fit: "inside", withoutEnlargement: true }) // Resize to 213x300
      .toFile(outputPath)
      .then(() => console.log("Image resized successfully:", outputPath))
      .catch((err) => console.error("Error resizing image:", err));
  }
}

// Version: ImageMagick 7.1.1-45 Q16-HDRI aarch64 22722 https://imagemagick.org
// Copyright: (C) 1999 ImageMagick Studio LLC
// License: https://imagemagick.org/script/license.php
// Features: Cipher DPC HDRI Modules OpenMP
// Delegates (built-in): bzlib fontconfig freetype gslib heic jng jp2 jpeg jxl lcms lqr ltdl lzma openexr png ps raw tiff webp xml zlib zstd
// Compiler: clang (16.0.0)

async function generatePdfThumbnail(pdfPath, outputPath) {
  const command = `magick convert -density 300 "${pdfPath}[0]" -resize 213x300 -colorspace RGB -background white -alpha remove -flatten "${outputPath}"`;

  execSync(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error:", err);
    } else {
      console.log("Thumbnail saved at:", outputPath);
    }
  });
}

async function getFiles(req, res) {
  const decoded = jwt.verify(req.headers["sessionid"], "clientInformation");
  const sessionId = decoded.sessionId;

  const {
    pathname,
    query,
    userAgent,
    // ip
  } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",").shift() ||
    req.socket?.remoteAddress;
  try {
    if (ip !== "::1") {
      await UserJourneyModel.create({
        sessionId,
        pathname,
        query,
        userAgent,
        ip,
      });
    }

    const response = await FileUploadModel.find({
      sessionId: sessionId,
    });
    const minimalData = response.map(
      ({ _id, noPages, originalFilename, fileThumbnail }) => ({
        _id: _id,
        pages: noPages,
        filename: originalFilename,
        thumbnail: fileThumbnail,
      })
    );
    const blog = await BlogModel.find({})
      .populate({ path: "thumbnail", select: ["path"] })
      .select(["title", "slug", "excerpt", "tags", "thumbnail", "createdAt"])
      .sort({ createdAt: -1 })
      .limit(6);
    res
      .status(200)
      .json({ message: "Data retrived", data: minimalData, blog: blog });
  } catch (error) {
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function removeFiles(req, res) {
  const decoded = jwt.verify(req.headers["sessionid"], "clientInformation");
  const sessionId = decoded.sessionId;
  const deletedFile = await FileUploadModel.findOneAndDelete({
    _id: req.body.deleteid,
    sessionId: sessionId,
  });

  if (!deletedFile) {
    return res
      .status(404)
      .json({ message: "Document not found or already deleted" });
  }
  res
    .status(200)
    .json({ message: "Document deleted successfully", deletedFile });
}

async function login(req, res) {
  try {
    const customer = await CustomerModel.updateOne(
      {
        mobileNumber: req.body.mobilenumber,
      },
      { $setOnInsert: { clientId: makestr(35) }, $set: { otp: 1234 } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Data retrived", customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function otpSubmit(req, res) {
  try {
    const customer = await CustomerModel.findOne({
      mobileNumber: req.body.mobilenumber,
      otp: req.body.otp,
    });
    // console.log(customer._id);
    if (customer) {
      // const token = jwt.sign(customer._id, "principalamount");

      res
        .status(200)
        .json({ message: "Data retrived", customer: customer._id });
    } else {
      res.status(400).json({ message: "OTP Incorrect!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function addAddress(req, res) {
  try {
    const data = {
      _id: req.body._id,
      user: req.body.user,
      addressType: req.body.addressType,
      addressLine1: sanitizeInput(req.body.addressLine1),
      addressLine2: sanitizeInput(req.body.addressLine2),
      area: sanitizeInput(req.body.area),
      landmark: sanitizeInput(req.body.landmark),
      location: req.body.location,
      name: sanitizeInput(req.body.name),
      phone: req.body.phone,
    };

    // console.log(data);

    if (!validator.isInt(String(data.phone))) {
      res.status(400).json({ message: "Phone format not correct!" });
    }
    if (data._id === "") {
      delete data._id;
      const address = await AddressModel.insertOne(data, { new: true });
      res.status(200).json({
        message: "Address created",
        code: "created",
        address: [address],
      });
    } else {
      await AddressModel.updateOne({ _id: data._id }, { $set: data });
      res
        .status(200)
        .json({ message: "Address updated", code: "updated", address: [data] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function listAddress(req, res) {
  try {
    if (req.body.user !== "") {
      const address = await AddressModel.find({ user: req.body.user });
      res.status(200).json({ message: "Address list", address });
    } else {
      res.status(400).json({ message: "Invalid user" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

function sanitizeInput(input) {
  return validator.escape(input);
}

async function createOrder(req, res) {
  const decoded = jwt.verify(req.headers["sessionid"], "clientInformation");
  const sessionId = decoded.sessionId;
  try {
    // Get current day and time
    const currentDay = moment().format("dddd"); // e.g., "Monday"
    const currentTime = moment().format("HH:mm"); // e.g., "14:30"

    const nearbyShops = await findNearbyShops(req.body.address, 3);
    // console.log(nearbyShops);
    // Filter shops that are currently open
    const openShops = nearbyShops.filter((shop) => {
      const hours = shop.openingHours?.[currentDay];
      if (!hours) return false; // No opening hours set

      return currentTime >= hours.open && currentTime <= hours.close;
    });
    // console.log(openShops);
    // return;

    if (!openShops.length) {
      res.status(406).json({ message: "No open shops available at this time" });
      return;
    }

    // Select a random shop from open shops
    const randomShop = openShops[Math.floor(Math.random() * openShops.length)];
    const response = await FileUploadModel.find({ sessionId });

    const totalPages = response.reduce(
      (sum, file) => sum + (file.noPages || 0),
      0
    );

    const custom = req.body.customization;
    const bwRate = parseFloat(randomShop.printerDetails.bwRate);
    const colorRate = parseFloat(randomShop.printerDetails.colorRate);
    let deliveryCharges = 0;
    let handlingCharges = 0;

    let totalAmount = 0;
    let price = 0;
    if (custom.printColor === "bw") {
      totalAmount = totalPages * custom.noCopies * bwRate;
      price = bwRate;
    } else if (custom.printColor === "color") {
      totalAmount = totalPages * custom.noCopies * colorRate;
      price = colorRate;
    }

    let grandTotal = totalAmount;
    if (totalAmount < 20) {
      deliveryCharges = 3;
      handlingCharges = 3;
      grandTotal += 3 + 3;
    }
    // console.log(randomShop);
    // return;
    // return randomShop._id; // Return the _id of the selected shop
    const dd = Date.now();
    const mergedPdf = dd + "-merged.pdf";
    const amountBreakdown = {
      pricePerPage: price,
      totalPages: totalPages,
      itemsTotal: parseFloat(totalAmount.toFixed(2)),
      deliveryCharges,
      handlingCharges,
      grandTotal: grandTotal,
    };

    const data = {
      orderId: makestr(5),
      user: sanitizeInput(req.body.user),
      sessionId: sessionId,
      address: sanitizeInput(req.body.address),
      customization: req.body.customization,
      grandAmount: grandTotal,
      amountBreakdown: amountBreakdown,
      shopId: randomShop._id,
      orderStatus: "waiting",
      mergedPdf: `public/merged/${mergedPdf}`,
    };
    // console.log(data);
    // return;

    const order = await OrderModel.create(data);
    const orderDetails = await OrderModel.findOne({ _id: order._id }).populate({
      path: "address",
      select: ["name", "phone", "area"],
    });
    // console.log(orderDetails);
    await storePartnerEarning(orderDetails);

    const files = await FileUploadModel.find({
      sessionId: sessionId,
    }).select(["filename"]);
    // console.log(files);
    const filePaths = files.map((file) => `${file.filename}`);
    // return;
    const link = await mergeSelectedFiles(filePaths, mergedPdf).catch(
      console.error
    );
    // console.log(link);
    res.status(200).json({ message: "Order successfull", order: orderDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function storePartnerEarning(order) {
  try {
    const shopId = order.shopId;
    const orderId = order._id;
    const totalAmount = order.amountBreakdown?.itemsTotal || 0;

    // Fetch partner commission
    const commission = await PartnerCommissionModel.findOne({ shopId });
    const commissionRate = commission?.commissionRate || 20; // Default 20% if not set
    const commissionAmount = (totalAmount * commissionRate) / 100;
    const payableAmount = totalAmount - commissionAmount;

    const earning = new PartnerEarningModel({
      // partnerId,
      shopId,
      orderId,
      totalAmount,
      commissionRate,
      commissionAmount,
      payableAmount,
      status: "pending",
      paymentDate: null,
    });

    await earning.save();
    console.log("Partner earning stored:", earning._id);
  } catch (error) {
    console.error("Failed to store partner earning:", error);
  }
}

async function convertImageToPdf(imagePath) {
  const imageBuffer = await fs.readFile(imagePath);
  const pdfDoc = await PDFDocument.create();
  const imageType = path.extname(imagePath).toLowerCase();

  let image;
  if (imageType === ".jpg" || imageType === ".jpeg") {
    image = await pdfDoc.embedJpg(imageBuffer);
  } else if (imageType === ".png") {
    image = await pdfDoc.embedPng(imageBuffer);
  } else {
    throw new Error(`Unsupported image format: ${imageType}`);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  return await pdfDoc.save();
}

async function mergeSelectedFiles(filesToMerge, filename) {
  const pdfDoc = await PDFDocument.create();

  const publicDir = path.join(__dirname, "../public/uploads");
  const outputPdfPath = path.join(__dirname, `../public/merged/${filename}`);

  for (const file of filesToMerge) {
    const filePath = path.join(publicDir, file);
    const fileExt = path.extname(file).toLowerCase();

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    if (fileExt === ".pdf") {
      // Merge existing PDFs
      const existingPdfBytes = await fs.readFile(filePath);
      const existingPdfDoc = await PDFDocument.load(existingPdfBytes);
      const copiedPages = await pdfDoc.copyPages(
        existingPdfDoc,
        existingPdfDoc.getPageIndices()
      );

      copiedPages.forEach((page) => pdfDoc.addPage(page));
    } else if ([".jpg", ".jpeg", ".png"].includes(fileExt)) {
      // Convert image to PDF and merge
      const imagePdfBytes = await convertImageToPdf(filePath);
      const imagePdfDoc = await PDFDocument.load(imagePdfBytes);
      const copiedPages = await pdfDoc.copyPages(
        imagePdfDoc,
        imagePdfDoc.getPageIndices()
      );

      copiedPages.forEach((page) => pdfDoc.addPage(page));
    } else {
      console.warn(`Unsupported file format: ${filePath}`);
    }
  }

  // Save the final merged PDF
  const finalPdfBytes = await pdfDoc.save();
  await fs.writeFile(outputPdfPath, finalPdfBytes);
  console.log(`Merged PDF saved at: ${outputPdfPath}`);
  return outputPdfPath;
}

const findNearbyShops = async (address, maxDistanceKm) => {
  try {
    // Fetch user address
    const userAddress = await AddressModel.findOne({ _id: address });

    if (!userAddress) {
      throw new Error("User address not found.");
    }
    // ShopModel.syncIndexes();
    await ShopModel.collection.createIndex({ location: "2dsphere" });
    const indexes = await ShopModel.collection.indexes();
    // console.log(indexes);

    const userCoordinates = userAddress.location.coordinates; // [longitude, latitude]
    // console.log(userCoordinates);
    // Find nearby shops using $geoNear
    const nearbyShops = await ShopModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: userCoordinates },
          distanceField: "distance",
          maxDistance: maxDistanceKm * 1000, // Convert km to meters
          spherical: true,
        },
      },
    ]);

    return nearbyShops;
  } catch (error) {
    console.error("Error finding nearby shops:", error);
    return [];
  }
};

async function viewOrder(req, res) {
  // console.log(req);
  try {
    const order = await OrderModel.findOne({
      orderId: req.params.orderid,
    }).select(["customization", "amountBreakdown"]);
    res.status(200).json({ message: "Order successfull", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

const verifyUserToken = async (req, res, next) => {
  const token = req.header("sessionid"); // Extract token
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify JWT token
    // const decoded = jwt.verify(token, "clientInformation");

    jwt.verify(token, "clientInformation", (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Forbidden: Invalid or expired token" });
      }

      req.user = decoded; // Attach decoded user data to request
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error });
  }
};

const getPage = async (req, res) => {
  try {
    const page = await SeoPageModel.findOne({
      category: req.params.category,
      slug: req.params.pageid,
    })
      .populate({ path: "thumbnail", select: ["path"] })
      .select([
        "title",
        "slug",
        "description",
        "keywords",
        "heading",
        "content",
        "category",
        "thumbnail",
      ]);
    const data = page;
    page.thumbnail = page.thumbnail.path;
    res.status(200).json({ message: "Page", page: data });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const getBlogs = async (req, res) => {
  try {
    const blog = await BlogModel.find({})
      .populate({ path: "thumbnail", select: ["path"] })
      .select([
        "title",
        "slug",
        "excerpt",
        "content",
        "tags",
        "thumbnail",
        "createdAt",
      ])
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Blog List", blog });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
    console.log(error);
  }
};

const getBlogDetails = async (req, res) => {
  try {
    const blog = await BlogModel.findOne({ slug: req.params.slug })
      .populate({ path: "thumbnail", select: ["path"] })
      .select([
        "title",
        "slug",
        "excerpt",
        "content",
        "tags",
        "thumbnail",
        "createdAt",
      ]);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSeoSitemap = async (req, res) => {
  try {
    const page = await SeoPageModel.find().select(["slug", "category"]);
    const blog = await BlogModel.find().select(["slug"]);
    const data = page.concat(blog);
    res.json({ blog, page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const confirmAddress = async (req, res) => {
  try {
    await SearchAddressModel.create({
      location: { type: "Point", coordinates: req.body.coordinates },
    });
    // Get current day and time
    const currentDay = moment().format("dddd"); // e.g., "Monday"
    const currentTime = moment().format("HH:mm"); // e.g., "14:30"

    await ShopModel.collection.createIndex({ location: "2dsphere" });
    const indexes = await ShopModel.collection.indexes();
    // console.log(indexes);

    const userCoordinates = req.body.coordinates; // [longitude, latitude]
    // console.log(userCoordinates);
    // Find nearby shops using $geoNear
    const nearbyShops = await ShopModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: userCoordinates },
          distanceField: "distance",
          maxDistance: 3 * 1000, // Convert km to meters
          spherical: true,
        },
      },
    ]);
    if (nearbyShops.length === 0) {
      res.status(406).json({ message: "No open shops available at this time" });
      return;
    }
    // console.log(nearbyShops);
    // Filter shops that are currently open
    const openShops = nearbyShops.filter((shop) => {
      const hours = shop.openingHours?.[currentDay];
      if (!hours) return false; // No opening hours set

      return currentTime >= hours.open && currentTime <= hours.close;
    });
    // console.log(openShops);
    // return;

    if (!openShops.length) {
      res.status(406).json({ message: "No open shops available at this time" });
      return;
    }
    res.status(200).json({
      message: "Shops available",
      rate: {
        bwRate: openShops[0].printerDetails.bwRate,
        colorRate: openShops[0].printerDetails.colorRate,
        deliveryCharges: 0,
        handlingCharges: 0,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
};

async function deleteAddress(req, res) {
  const user = req.header("user"); // Extract token
  try {
    if (user === "" && req.params.address) {
      res.status(406).json({
        message: "Address not found",
        code: "not delete",
      });
    } else {
      await AddressModel.findOneAndDelete({ _id: req.params.address, user });
      res.status(200).json({ message: "Address deleted", code: "deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function customerOrder(req, res) {
  try {
    const customerId = req.headers["user"];

    const orders = await OrderModel.find({ user: customerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
}

module.exports = {
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
};
