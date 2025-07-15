const express = require("express");
const {
  login,
  verifyOTP,
  updateOnboarding,
  getOnboarding,
  getAdminOnboarding,
  getPartnerApproved,
  getPartnerReject,
  listOnboarding,
} = require("../controller/onBoardingController");
const { verifyAdmin } = require("../controller/adminController");
const onBoardingRouter = express.Router();

onBoardingRouter.post("/login", login);
onBoardingRouter.post("/verify-otp", verifyOTP);
onBoardingRouter.post("/update-onboarding", updateOnboarding);
onBoardingRouter.get("/get-onboarding/:partnerid", getOnboarding);
onBoardingRouter.get(
  "/get-partner-details/:partnerid",
  verifyAdmin,
  getAdminOnboarding
);
onBoardingRouter.post(
  "/get-partner-approve/:partnerid",
  verifyAdmin,
  getPartnerApproved
);
onBoardingRouter.post(
  "/get-partner-reject/:partnerid",
  verifyAdmin,
  getPartnerReject
);
onBoardingRouter.get("/list", verifyAdmin, listOnboarding);

module.exports = onBoardingRouter;
