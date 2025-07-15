import { onboardingTypes } from "@/context/OnboardingContext";
import { APP_SERVER_URL } from "@/src/utils/common";
import axios from "axios";

export const getOrders = async (shopid: string) => {
  const response = axios.get(
    APP_SERVER_URL + "/api/v1/partner/get-order/" + shopid,
    {
      headers: { token: localStorage.getItem("ptoken") },
    }
  );
  return response;
};

export const getOnboarding = async (partnerid: string) => {
  const response = await axios.get(
    APP_SERVER_URL + "/api/partner/get-onboarding/" + partnerid
  );
  return response;
};

export const uploadSingle = async (file: FormData) => {
  const response = axios.post(APP_SERVER_URL + "/api/upload-single", file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response;
};

export const uploadMultiple = async (file: FormData) => {
  const response = await axios.post(
    APP_SERVER_URL + "/api/upload", // Change to your API endpoint
    file,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response;
};

export const submitOnboard = async (tempData: onboardingTypes) => {
  const response = await axios.post(
    APP_SERVER_URL + "/api/partner/update-onboarding",
    tempData
  );
  return response;
};

export const sendToDelivery = async (orderId: string) => {
  const response = await axios.post(
    APP_SERVER_URL + "/api/v1/partner/send-to-delivery",
    { orderId }
  );
  return response;
};
