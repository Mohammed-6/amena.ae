import axios from "axios";
import { UserType } from "../types/admin";
import { APP_SERVER_URL } from "@/src/utils/common";
import axiosInstance from "./axiosInstance";

export const createUser = async (data: UserType) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/create-user",
    data,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const listUser = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/admin/list-user", {
    headers: { token: localStorage.getItem("atoken") },
  });
  return res;
};

export const getUser = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/get-user/" + id,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const updateUser = async (id: string, data: UserType) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/update-user/" + id,
    data,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/delete-user/" + id,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const login = async (formData: any) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/login",
    formData
  );
  return res;
};

export const getOnboardingPartner = async (partnerId: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/partner/get-partner-details/" + partnerId,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const getPartnerApproved = async (partnerId: string, desc: string) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/partner/get-partner-approve/" + partnerId,
    { description: desc },
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const getPartnerReject = async (partnerId: string, desc: string) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/partner/get-partner-reject/" + partnerId,
    { description: desc },
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const listOnboarding = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/partner/list", {
    headers: { token: localStorage.getItem("atoken") },
  });
  return res;
};

export const getOrders = async () => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/get-orders",
    {},
    {
      headers: { token: localStorage.getItem("atoken") },
    }
  );
  return res;
};
