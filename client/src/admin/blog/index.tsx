import React, { useEffect, useState } from "react";
import { Check, Link as LLink, Pencil, Trash2, X } from "lucide-react";
import AdminPanel from "../layout/AdminPanel";
import { deleteBlog, getBlog } from "../query/blog";
import { toast } from "react-toastify";
import { BlogFormData } from "../types/admin";
import Link from "next/link";

const SeoPageList = () => {
  return (
    <>
      <AdminPanel>
        <Content />
      </AdminPanel>
    </>
  );
};
const Content = () => {
  const [blogs, setBlogs] = useState<BlogFormData[]>([]);
  const [pageToDelete, setPageToDelete] = useState<BlogFormData | null>(null);

  useEffect(() => {
    getBlog()
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.error(error);
      });
  }, []);

  const handleDelete = () => {
    deleteBlog(pageToDelete?.slug as string)
      .then((res) => {
        // setPages(res.data.page);
        setBlogs((prev) =>
          prev.filter((page) => page?._id !== pageToDelete?._id)
        );
        setPageToDelete(null);
      })
      .catch((error) => {
        toast.error("Something went wrong!");
        console.error(error);
      });
  };

  return (
    <>
      {pageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to delete this blog:{" "}
              <span className="font-semibold text-black">
                {pageToDelete.title}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPageToDelete(null)}
                className="flex items-center gap-1 px-3 py-1.5 border rounded text-gray-600 hover:text-black hover:border-black"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Check className="w-4 h-4" /> Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4">Blog List</h2>
          </div>
          <div>
            <Link
              href={"/admin/blog/add"}
              className="text-white bg-green-600 rounded px-3 py-2"
            >
              Add Blog
            </Link>
          </div>
        </div>

        <ul className="space-y-4">
          {blogs.map((page, k) => (
            <li
              key={k}
              className="flex justify-between items-center border rounded p-4 hover:bg-gray-50 transition"
            >
              <div>
                <h3 className="font-semibold text-lg">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.slug}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/admin/blog/edit/${page.slug}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setPageToDelete(page)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default SeoPageList;
