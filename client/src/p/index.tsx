import Head from "next/head";
import { Layout as UserLayout } from "../layout/index";
import { APP_NAME, APP_SERVER_URL, NotFound } from "../utils/common";
import DragDropFile from "@/components/DragDropFile";
import { FilePlus, Upload } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSeoPage } from "../query/front";
import { SeoPageFormData } from "../admin/types/admin";
import { HowItWorks, WhyPrint } from "../homepage";

const PagesSEO = () => {
  const router = useRouter();
  const [page, setPage] = useState<SeoPageFormData>({
    title: "",
    slug: "",
    description: "",
    keywords: "",
    heading: "",
    content: "",
    category: "",
    thumbnail: "",
  });
  const [fournfour, setfournfour] = useState<boolean>(false);

  useEffect(() => {
    // console.log(router);
    try {
      if (router.query.category !== undefined) {
        getSeoPage(router.query.category as string, router.query.slug as string)
          .then((res) => {
            //   console.log(res);
            if (res) {
              setPage(res?.data.page);
              setfournfour(false);
            } else {
              setfournfour(true);
            }
          })
          .catch((error) => {
            console.log(error);
            setfournfour(true);
          });
      }
    } catch (error) {
      setfournfour(true);
    }
  }, [router.isReady]);
  return <>{!fournfour ? <Content page={page} /> : <NotFound />}</>;
};
const Content = ({ page }: { page: SeoPageFormData }) => {
  const router = useRouter();
  return (
    <>
      <UserLayout>
        <Head>
          <title>{page.title} – Amena.ae</title>
          <meta property="desription" content={page.description} />
          <meta name="keywords" content={page.keywords} />
          <meta property="og:title" content={`Amena.ae | ${page.title}`} />
          <meta property="og:description" content={page.description} />
          <meta
            property="og:url"
            content={`https://amena.ae${router.pathname}`}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://amena.ae/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`Amena.ae | ${page.title}`} />
          <meta name="twitter:description" content={page.description} />
          <meta name="twitter:image" content="https://amena.ae/og-image.jpg" />
        </Head>
        <div className="py-18">
          <PrintStore page={page} />
          <HowItWorks />
          {/* <WhyPrint /> */}
        </div>
      </UserLayout>
    </>
  );
};

export const PrintStore = ({ page }: { page: SeoPageFormData }) => {
  return (
    <>
      <div className="px-4 sm:px-6">
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-center sm:text-left">
          Online Printout Store
        </h2>
        <h4 className="py-3 font-normal text-lg sm:text-xl text-center sm:text-left">
          {APP_NAME} brings printing to your doorstep
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <DragDropFile>
              <UploadFiles />
            </DragDropFile>
          </div>
          <div>
            <UploadImage page={page} />
          </div>
        </div>
      </div>
    </>
  );
};

const UploadFiles = () => {
  return (
    <>
      <div className="flex justify-center items-center px-0 sm:px-0 py-2">
        <div className="bg-background rounded-2xl p-6 sm:p-8 shadow-xl w-full max-w-md sm:max-w-lg">
          {/* Header Section */}
          <div className="flex items-center gap-x-4">
            <FilePlus className="h-10 w-10 text-green-700" />
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                Upload your files
              </h3>
              <p className="text-sm text-gray-500">
                We support PDF, JPG, PNG, JPEG and more.
              </p>
            </div>
          </div>

          {/* Upload Icon */}
          <div className="flex justify-center py-6">
            <Upload className="h-12 w-12 text-gray-400" />
          </div>

          {/* Upload Button */}
          <button className="bg-green-700 hover:bg-green-600 transition duration-200 text-white text-base sm:text-lg rounded-lg w-full font-semibold py-2.5">
            Upload files
          </button>

          {/* Upload Info */}
          <div className="text-center text-xs text-gray-600 mt-4">
            <div className="flex items-center justify-center gap-x-2">
              <span>Max file size: 50MB</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Max files: 15</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const UploadImage = ({ page }: { page: SeoPageFormData }) => {
  return (
    <>
      <div className="flex justify-center m-3">
        <img
          src={APP_SERVER_URL + "/" + page.thumbnail.path}
          className="h-[300px] w-auto"
        />
      </div>
    </>
  );
};

export default PagesSEO;
