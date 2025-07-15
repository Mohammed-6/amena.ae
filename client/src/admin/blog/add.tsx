import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AdminPanel from "../layout/AdminPanel";
import { BlogFormData } from "../types/admin";
import { toast } from "react-toastify";
import { createBlog, editBlog, updateBlog, uploadSingle } from "../query/blog";
import { Preloader } from "@/src/utils/common";
import { useRouter } from "next/router";

const BlogPostForm = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};
const Content = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    thumbnail: null,
  });
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    if (router.query.id !== undefined && router.query.id !== "") {
      setloading(true);
      editBlog(router.query.id as string)
        .then((res) => {
          setFormData(res.data);
          setloading(false);
        })
        .catch((error) => {
          toast.error("Something went wrong!");
          console.error(error);
          setloading(false);
        });
    }
  }, [router.isReady]);

  // Utility to generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let updatedSlug = formData.slug;

    if (name === "title") {
      updatedSlug = generateSlug(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      slug: name === "title" ? updatedSlug : prev.slug,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // console.log("Blog Form Submitted", formData);

    try {
      setloading(true);
      if (router.query.id !== undefined && router.query.id !== "") {
        await updateBlog(formData, router.query.id as string)
          .then((res) => {
            console.log(res.data);
            toast.success("Blog updated successfully");
            setloading(false);
            setFormData({
              _id: "",
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              tags: "",
              thumbnail: null,
            });
            router.push("/admin/blog");
          })
          .catch((error) => {
            console.error(error);
            toast.error("Something went wrong");
            setloading(false);
          });
      } else {
        await createBlog(formData)
          .then((res) => {
            console.log(res.data);
            toast.success("Blog addedd successfully");
            setloading(false);
            setFormData({
              _id: "",
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              tags: "",
              thumbnail: null,
            });
            router.push("/admin/blog");
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
    <>
      {loading && <Preloader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto space-y-4 p-6 bg-white rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-2">Create Blog Post</h2>

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            value={formData.title}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            readOnly
            className="w-full border p-2 rounded bg-gray-100 text-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Excerpt (a quick idea of what the post is about)
          </label>
          <textarea
            name="excerpt"
            onChange={handleChange}
            value={formData.excerpt}
            className="w-full border p-2 rounded"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea
            name="content"
            onChange={handleChange}
            value={formData.content}
            className="w-full border p-2 rounded"
            rows={6}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            onChange={handleChange}
            value={formData.tags}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-1 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        >
          Submit Post
        </button>
      </form>
    </>
  );
};

export default BlogPostForm;
