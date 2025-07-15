import React, { useEffect, useState } from "react";
import { BlogFormData } from "../admin/types/admin";
import { Layout } from "../layout";
import { useFileContext } from "@/context/FileUploadContext";
import { APP_SERVER_URL, Preloader } from "../utils/common";
import { toast } from "react-toastify";
import { getAllBlog } from "../query/front";
import Link from "next/link";

const BlogList = () => {
  return (
    <>
      <Layout>
        <Content />
      </Layout>
    </>
  );
};
const Content = () => {
  const { bloglist } = useFileContext();
  const [allblog, setallblog] = useState<BlogFormData[]>([]);
  const [showallbtn, setshowallbtn] = useState<boolean>(true);
  const [loading, setloading] = useState<boolean>(false);

  useEffect(() => {
    setallblog(bloglist);
  }, [bloglist]);

  const loadAllBlogs = () => {
    try {
      setloading(true);
      getAllBlog()
        .then((res) => {
          setallblog(res.data.blog);
          setshowallbtn(false);
          setloading(false);
        })
        .catch((error) => {
          toast.error("Something went wrong");
          console.log(error);
          setloading(false);
        });
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
      setloading(false);
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {loading && <Preloader />}
      <h1 className="text-3xl font-bold mb-8 text-center">Our Latest Blogs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allblog.map((blog: BlogFormData) => (
          <Link
            key={blog._id}
            href={`/blog/${blog.slug}`}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300 bg-white"
          >
            <img
              src={APP_SERVER_URL + "/" + blog.thumbnail.path}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{blog.title}</h2>
              <p className="text-sm text-gray-600">{blog.excerpt}</p>
              <p className="mt-4 text-xs text-gray-400">
                {new Date(blog?.createdAt!).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {showallbtn && (
        <div className="text-center mt-10">
          <button
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
            onClick={loadAllBlogs}
          >
            Show All Blogs
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
