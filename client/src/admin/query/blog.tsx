import { BlogFormData } from "../types/admin";
import { APP_SERVER_URL } from "@/src/utils/common";
import axiosInstance from "./axiosInstance";

export const createBlog = async (data: BlogFormData) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/create-blog",
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

export const editBlog = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/edit-blog/" + id,
    { headers: { token: localStorage.getItem("atoken") } }
  );
  return res;
};

export const getBlog = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/admin/get-blog", {
    headers: { token: localStorage.getItem("atoken") },
  });
  return res;
};

export const updateBlog = async (data: BlogFormData, id: string) => {
  const res = await axiosInstance.post(
    APP_SERVER_URL + "/api/admin/update-blog/" + id,
    data,
    {
      headers: { token: localStorage.getItem("atoken") },
    }
  );
  return res;
};

export const deleteBlog = async (id: string) => {
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/admin/delete-blog/" + id,
    {
      headers: { token: localStorage.getItem("atoken") },
    }
  );
  return res;
};
