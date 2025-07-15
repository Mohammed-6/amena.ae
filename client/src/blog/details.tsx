import React, { useEffect, useState } from "react";
import { CalendarDays, User, ChevronRight } from "lucide-react";
import { Layout as UserLayout } from "../layout/index";
import { useRouter } from "next/router";
import { BlogFormData } from "../admin/types/admin";
import { getBlogDetails } from "../query/front";
import { APP_SERVER_URL, NotFound, Preloader } from "../utils/common";
import Head from "next/head";
import { useFileContext } from "@/context/FileUploadContext";
import Link from "next/link";

const BlogView = () => {
  const router = useRouter();
  const [blog, setBlog] = useState<BlogFormData>({
    _id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    thumbnail: "",
    createdAt: new Date(),
  });
  const [fournfour, setfournfour] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(false);

  const { slug } = router.query;
  useEffect(() => {
    // console.log(router);
    try {
      setloading(true);
      if (router.query.slug !== undefined) {
        getBlogDetails(router.query.slug as string)
          .then((res) => {
            //   console.log(res);
            if (res) {
              setBlog(res?.data);
              setfournfour(false);
              setloading(false);
            } else {
              setfournfour(true);
            }
          })
          .catch((error) => {
            console.log(error);
            setfournfour(true);
            setloading(false);
          });
      }
    } catch (error) {
      setfournfour(true);
      setloading(false);
    }
  }, [slug]);
  return (
    <>
      {loading && <Preloader />}
      {!fournfour ? !loading && <Content blog={blog} /> : <NotFound />}
    </>
  );
};
const Content = ({ blog }: { blog: BlogFormData }) => {
  const router = useRouter();
  return (
    <>
      <UserLayout>
        <Head>
          <title>{blog.title} – Amena.ae</title>
          <meta property="desription" content={blog.excerpt} />
          <meta name="keywords" content={blog.tags} />
          <meta property="og:title" content={`Amena.ae | ${blog.title}`} />
          <meta property="og:description" content={blog.excerpt} />
          <meta
            property="og:url"
            content={`https://amena.ae${router.pathname}`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://amena.ae/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Amena.ae | ${blog.title}`} />
          <meta name="twitter:description" content={blog.excerpt} />
          <meta name="twitter:image" content="https://amena.ae/og-image.jpg" />
        </Head>
        <div className="py-18">
          <BlogDetails blog={blog} />
        </div>
      </UserLayout>
    </>
  );
};

const BlogDetails = ({ blog }: { blog: BlogFormData }) => {
  const router = useRouter();
  const { bloglist } = useFileContext();

  const currentBlogId = router.query.slug; // You get this from the URL or router
  const currentIndex = bloglist.findIndex(
    (blog) => blog.slug === currentBlogId
  );

  const previousPost = currentIndex > 0 ? bloglist[currentIndex - 1] : null;
  const nextPost =
    currentIndex < bloglist.length - 1 ? bloglist[currentIndex + 1] : null;

  const suggestedBlogs = bloglist
    .filter((_, index) => index !== currentIndex)
    .slice(0, 3); // limit to 3 suggestions

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-4 gap-8">
      {/* Main Content */}
      <div className="md:col-span-3">
        <img
          src={APP_SERVER_URL + "/" + blog.thumbnail.path}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h1>
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{"Mohammed"}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            <span>{new Date(blog?.createdAt!).toDateString()}</span>
          </div>
        </div>
        <div
          className="prose max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Navigation with Thumbnails */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {/* Previous Blog */}
          {previousPost && (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="flex items-center space-x-4 bg-gray-50 p-4 rounded hover:bg-gray-100 transition"
            >
              <img
                src={APP_SERVER_URL + "/" + previousPost.thumbnail.path}
                alt={previousPost.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="text-sm text-gray-500">Previous Blog</p>
                <h4 className="text-md font-medium text-gray-800">
                  {previousPost.title}
                </h4>
              </div>
            </Link>
          )}

          {/* Next Blog */}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex items-center space-x-4 bg-gray-50 p-4 rounded hover:bg-gray-100 transition"
            >
              <img
                src={APP_SERVER_URL + "/" + nextPost.thumbnail.path}
                alt={nextPost.title}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="text-sm text-gray-500">Next Blog</p>
                <h4 className="text-md font-medium text-gray-800">
                  {nextPost.title}
                </h4>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Suggested Blogs
        </h3>
        {suggestedBlogs.map((post, k) => (
          <Link
            href={`/blog/${post?.slug}`}
            className="flex items-start gap-3 hover:bg-gray-100 p-2 rounded transition"
          >
            <img
              src={APP_SERVER_URL + "/" + post?.thumbnail.path}
              alt={post?.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                {post?.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                {new Date(post?.createdAt!).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      </aside>
    </div>
  );
};

export default BlogView;
