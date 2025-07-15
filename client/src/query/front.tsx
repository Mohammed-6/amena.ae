import axiosInstance from "../utils/axiosInstance";
import { APP_SERVER_URL } from "../utils/common";

export const getSeoPage = async (category: string, slug: string) => {
  if (category === undefined && slug === undefined) {
    return;
  }
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/get-page/" + category + "/" + slug,
    {
      headers: {
        "Content-Type": "application/json",
        sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const getAllBlog = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/get-blogs", {
    headers: {
      "Content-Type": "application/json",
      sessionId: localStorage.getItem("sessionId"),
    },
  });
  return res;
};

export const getBlogDetails = async (slug: string) => {
  if (slug === undefined) {
    return;
  }
  const res = await axiosInstance.get(
    APP_SERVER_URL + "/api/get-blogDetails/" + slug,
    {
      headers: {
        "Content-Type": "application/json",
        sessionId: localStorage.getItem("sessionId"),
      },
    }
  );
  return res;
};

export const getCustomerOrder = async () => {
  const res = await axiosInstance.get(APP_SERVER_URL + "/api/customer-order", {
    headers: {
      "Content-Type": "application/json",
      user: localStorage.getItem("user"),
      sessionId: localStorage.getItem("sessionId"),
    },
  });
  return res;
};
