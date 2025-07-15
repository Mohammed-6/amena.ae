import { SeoPageFormData } from "../types/admin";
import { APP_SERVER_URL } from "@/src/utils/common";
import axiosInstance from "./axiosInstance";

export const createPage = async (data: SeoPageFormData) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/create-page",
    data,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const uploadSingle = async (file: FormData) => {
  const response = axiosInstance.post(
    APP_SERVER_URL + "/api/upload-single",
    file,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response;
};

export const editPage = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/edit-page/" + id,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const getPage = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/admin/get-page", {
    headers: { token: localStorage.getItem("atoken") },
  });
  return res;
};

export const updatePage = async (data: SeoPageFormData, id: string) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/update-page/" + id,
    data,
    {
      headers: { token: localStorage.getItem("atoken") },
    }
  );
  return res;
};

export const deletePage = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/delete-page/" + id,
    {
      headers: { token: localStorage.getItem("atoken") },
    }
  );
  return res;
};
