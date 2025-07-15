// components/SeoPageForm.tsx
"use client";

import { Preloader, generateSlug } from "@/src/utils/common";
import { useEffect, useState } from "react";
import AdminPanel from "../layout/AdminPanel";
import { SeoPageFormData } from "../types/admin";
import {
  createPage,
  editPage,
  updatePage,
  uploadSingle,
} from "../query/seo-page";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function SeoPageForm() {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
}
function Content() {
  const router = useRouter();
  const [formData, setFormData] = useState<SeoPageFormData>({
    title: "",
    slug: "",
    description: "",
    keywords: "",
    heading: "",
    category: "",
    content: "",
    thumbnail: "",
  });
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (router.query.id !== undefined && router.query.id !== "") {
      setloading(true);
      editPage(router.query.id as string)
        .then((res) => {
          setFormData(res.data.page);
          setloading(false);
        })
        .catch((error) => {
          toast.error("Something went wrong!");
          console.error(error);
          setloading(false);
        });
    }
  }, [router.isReady]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      const slug = generateSlug(value);
      setFormData((prev) => ({ ...prev, title: value, slug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("attachment", file); // Ensure this matches backend key

    try {
      setloading(true);
      const response = await uploadSingle(formData);

      toast.success("File uploaded successfully!");
      console.log("Uploaded File:", response.data);
      setFormData((prev) => ({ ...prev, thumbnail: response.data.image }));
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      console.error("Upload Error:", error);
    } finally {
      setloading(false);
    }
    // setFormData({ ...formData, thumbnail: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // return;
    try {
      setloading(true);
      if (router.query.id !== undefined && router.query.id !== "") {
        await updatePage(formData, router.query.id as string)
          .then((res) => {
            console.log(res.data);
            toast.success("Page updated successfully");
            setloading(false);
            setFormData({
              _id: "",
              title: "",
              slug: "",
              description: "",
              keywords: "",
              heading: "",
              content: "",
              thumbnail: "",
              category: "",
            });
            router.push("/admin/seo-page");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
            setloading(false);
          });
      } else {
        await createPage(formData)
          .then((res) => {
            console.log(res.data);
            toast.success("Page addedd successfully");
            setloading(false);
            setFormData({
              title: "",
              slug: "",
              description: "",
              keywords: "",
              heading: "",
              content: "",
              thumbnail: "",
              category: "",
            });
            router.push("/admin/seo-page");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
            setloading(false);
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
      setloading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <h2 className="pt-3 text-xl font-semibold">
        {router.query.id !== undefined && router.query.id !== ""
          ? "Edit"
          : "Add"}{" "}
        SEO Page
      </h2>

      {loading && <Preloader />}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          id="title"
          type="text"
          name="title"
          onChange={handleChange}
          value={formData.title}
          placeholder="Page title"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Slug
        </label>
        <input
          id="slug"
          type="text"
          name="slug"
          onChange={handleChange}
          value={formData.slug}
          placeholder="slug-url"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          onChange={handleChange}
          value={formData.category}
          className="w-full p-2 border rounded"
          required
        >
          <option value="printouts" selected>
            Printouts
          </option>
          <option value="documents">Documents</option>
          <option value="services">Services</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Meta Description
        </label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          value={formData.description}
          placeholder="Meta description for SEO"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="keywords"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Keywords
        </label>
        <input
          id="keywords"
          type="text"
          name="keywords"
          onChange={handleChange}
          value={formData.keywords}
          placeholder="e.g. print, A4, document"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="heading"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Page Heading
        </label>
        <input
          id="heading"
          type="text"
          name="heading"
          onChange={handleChange}
          value={formData.heading}
          placeholder="Main heading on the page"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Page Content
        </label>
        <textarea
          id="content"
          name="content"
          onChange={handleChange}
          value={formData.content}
          placeholder="Main content of the page"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          htmlFor="thumbnail"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Thumbnail Image
        </label>
        <input
          id="thumbnail"
          type="file"
          name="thumbnail"
          accept="image/*"
          required={!formData.thumbnail}
          onChange={handleFileChange}
          className="w-full p-1 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
