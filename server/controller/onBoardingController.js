const validator = require("validator");
const {
  PartnerModel,
  OnboardingModel,
  ShopModel,
  BankModel,
} = require("../models/partner");
const jwt = require("jsonwebtoken");
var AWS = require("aws-sdk");
const SES_CONFIG = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "ap-south-1",
};

const AWS_SES = new AWS.SES(SES_CONFIG);
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let partner = await PartnerModel.findOne({ email });

    if (!partner) {
      // Partner doesn't exist, create new one
      const hashedPassword = await bcrypt.hash(password, 10);
      partner = new PartnerModel({
        email,
        password,
        onboardingStatus: false,
      });
      await partner.save();
    } else {
      // Partner exists, validate password
      const isMatch = await bcrypt.compare(password, partner.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
    }

    // Generate token
    const token = jwt.sign({ id: partner._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    if (partner.onboardingStatus === true) {
      // Find associated shop
      const shop = await ShopModel.findOne({ partnerId: partner._id });

      return res.status(200).json({
        message: "Login successful",
        token,
        partner: {
          id: partner._id,
          shopid: shop?._id,
          onboardingStatus: true,
        },
      });
    } else {
      return res.status(200).json({
        message: "Login successful",
        token,
        partner: {
          id: partner._id,
          onboardingStatus: false,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Some error occurred!" });
  }
}

async function verifyOTP(req, res) {
  try {
    const partner = await PartnerModel.findOne({
      phone: req.body.phone,
      otp: req.body.otp,
    });
    if (partner) {
      const token = jwt.sign({ id: partner._id }, "partnerinformation", {
        expiresIn: "1d",
      });
      if (partner.onboardingStatus === true) {
        // const token = jwt.sign(customer._id, "principalamount");
        const shop = await ShopModel.findOne({ partnerId: partner._id });
        console.log(shop);
        res.status(200).json({
          message: "Data retrived",
          token,
          partner: {
            id: partner._id,
            shopid: shop._id,
            onboardingStatus: partner.onboardingStatus,
          },
        });
      } else {
        res.status(200).json({
          message: "Data retrived",
          token,
          partner: {
            id: partner._id,
            onboardingStatus: false,
          },
        });
      }
    } else {
      res.status(400).json({ message: "OTP Incorrect!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured!" });
  }
}

async function updateOnboarding(req, res) {
  try {
    const ic = req.body;

    const onboarding = await OnboardingModel.updateOne(
      { partnerId: ic.partnerId },
      { $set: ic },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Data Updated", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

async function getOnboarding(req, res) {
  try {
    const onboarding = await OnboardingModel.findOne({
      partnerId: req.params.partnerid,
    });
    // console.log(onboarding);

    res.status(200).json({ message: "Data Retrived", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

async function getAdminOnboarding(req, res) {
  try {
    const onboarding = await OnboardingModel.findOne({
      _id: req.params.partnerid,
    })
      .populate({ path: "shopDetails.shopPhotos", select: ["path"] })
      .populate({ path: "companyDetails.tradeLicense", select: ["path"] })
      .populate({ path: "companyDetails.vatCertificate", select: ["path"] });
    // console.log(onboarding);

    res.status(200).json({ message: "Data Retrived", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

async function getPartnerApproved(req, res) {
  const token = req.header("token"); // Extract token
  const decoded = jwt.verify(token, "information");

  try {
    const onboarding = await OnboardingModel.findOneAndUpdate(
      {
        _id: req.params.partnerid,
      },
      {
        $set: {
          adminApproved: true,
          agentId: decoded.id,
          adminApprovedDescription: req.body.description,
          applicationStatus: "completed",
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
    console.log(onboarding.partnerId);
    await PartnerModel.findByIdAndUpdate(onboarding.partnerId, {
      $set: { onboardingStatus: true },
    });

    await ShopModel.findOneAndUpdate(
      { partnerId: onboarding.partnerId },
      {
        $set: {
          partnerId: onboarding.partnerId,
          shopName: onboarding.shopDetails.shopName,
          shopPhotos: onboarding.shopDetails.shopPhotos,
          address: onboarding.shopDetails.address,
          location: onboarding.shopDetails.location,
          phone: onboarding.shopDetails.phone,
          openingDate: onboarding.shopDetails.openingDate,
          website: onboarding.shopDetails.website,
          businessLocation: onboarding.shopDetails.businessLocation,
          serviceArea: onboarding.shopDetails.serviceArea,
          openingHours: onboarding.shopDetails.openingHours,
          printerDetails: {
            printerName: onboarding.printerDetails.printerName,
            brand: onboarding.printerDetails.brand,
            model: onboarding.printerDetails.model,
            colorSpeed: onboarding.printerDetails.colorSpeed,
            bwSpeed: onboarding.printerDetails.bwSpeed,
            paperSize: onboarding.printerDetails.paperSize,
            connectivity: onboarding.printerDetails.connectivity,
          },
        },
      },
      { upsert: true, new: true }
    );
    await BankModel.findOneAndUpdate(
      { partnerId: onboarding.partnerId },
      {
        $set: {
          partnerId: onboarding.partnerId,
          bankName: onboarding.bankDetails.bankName,
          accountHolder: onboarding.bankDetails.accountHolder,
          accountNumber: onboarding.bankDetails.accountNumber,
          iban: onboarding.bankDetails.iban,
          branch: onboarding.bankDetails.branch,
          swiftCode: onboarding.bankDetails.swiftCode,
        },
      },
      { upsert: true, new: true }
    );

    // sendEmail(
    //   onboarding.companyDetails.ownerEmail,
    //   "🎉 Congratulations! Your Onboarding is Approved",
    //   approvalEmail(
    //     onboarding.companyDetails.ownerName,
    //     onboarding.companyDetails.companyName,
    //     onboarding.shopDetails.shopName,
    //     onboarding.shopDetails.serviceArea,
    //     onboarding.shopDetails.businessLocation,
    //     "https://dashboard.example.com"
    //   )
    // );

    res.status(200).json({ message: "Partner Approve", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

async function getPartnerReject(req, res) {
  const token = req.header("token"); // Extract token
  const decoded = jwt.verify(token, "information");

  try {
    const onboarding = await OnboardingModel.findOneAndUpdate(
      {
        _id: req.params.partnerid,
      },
      {
        $set: {
          adminApproved: false,
          agentId: decoded.id,
          adminApprovedDescription: req.body.description,
          applicationStatus: "rejected",
        },
      }
    );
    // console.log(onboarding);
    // sendEmail(
    //   onboarding.companyDetails.ownerEmail,
    //   "⚠️ Onboarding Update – Additional Information Required",
    //   rejectionEmail(
    //     onboarding.companyDetails.ownerName,
    //     req.body.description,
    //     "https://dashboard.example.com/resubmit"
    //   )
    // );
    res.status(200).json({ message: "Partner Approved", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

const sendEmail = async (to, subject, body) => {
  const params = {
    Source: "sales@biyaan.in", // Must be a verified email in AWS SES
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
  };

  try {
    const result = await AWS_SES.sendEmail(params).promise();
    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

const approvalEmail = (
  partnerName,
  companyName,
  shopName,
  serviceArea,
  businessLocation,
  loginLink
) => `
  <h2>🎉 Congratulations, ${partnerName},</h2>
  <p>We are pleased to inform you that your onboarding process as an Online Printout Partner has been successfully approved. 🎉  </p>
  <p>Your account is now active, and you can start offering your printing services on our platform. Here are your approved details: </p>
  <p><strong>Company Name:</strong> ${companyName}</p>
  <p><strong>Shop Name:</strong> ${shopName}</p>
  <p><strong>Business Location:</strong> ${businessLocation}</p>
  <p><strong>Service Area:</strong> ${serviceArea}</p>
  <p>You can now log in and manage your shop through our partner dashboard: <a href="${loginLink}">${loginLink}</a></p>
  <p>If you have any questions, feel free to contact our support team.</p>
  <p>Welcome to our network, and we look forward to your success!</p>
  <p>Best regards,<br><strong>Paper Plane</strong></p>
  <strong>paperplane.ae</strong></p>
  <strong>support@paperplane.ae</strong></p>
`;

const rejectionEmail = (partnerName, reason, resubmissionLink) => `
  <h2>⚠️ Onboarding Update – Additional Information Required</h2>
  <p>Dear ${partnerName},</p>
  <p>Thank you for applying to become an Online Printout Partner. After reviewing your submission, we regret to inform you that your onboarding process could not be completed due to the following reason(s):</p>
  <blockquote><strong>❌ Reason:</strong> ${reason}</blockquote>
  <p>To proceed with your application, kindly update the required details and resubmit your onboarding request: <a href="${resubmissionLink}">${resubmissionLink}</a></p>
  <p>If you need any assistance, please contact our support team at support@paperplane.ae</p>
  <p>We appreciate your interest and look forward to working with you.</p>
  <p>Best regards,<br><strong>Paper Plane</strong></p>
  <p><strong>paperplane.ae</strong></p>
  <p><strong>support@paperplane.ae</strong></p>
`;

async function listOnboarding(req, res) {
  try {
    const onboarding = await OnboardingModel.find({});

    res.status(200).json({ message: "Data Retrived", onboarding });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
}

module.exports = {
  login,
  verifyOTP,
  updateOnboarding,
  getOnboarding,
  getAdminOnboarding,
  getPartnerApproved,
  getPartnerReject,
  listOnboarding,
};
