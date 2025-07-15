import DragDropFile from "@/components/DragDropFile";
import { Layout as UserLayout } from "../layout/index";
import {
  APP_CURRENCY,
  APP_NAME,
  APP_SERVER_URL,
  FileLoading,
  imageplaceholder,
  truncateFilename,
} from "../utils/common";
import { useFileContext } from "@/context/FileUploadContext";
import {
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  FilePlus,
  MapPin,
  Palette,
  Printer,
  ShieldCheck,
  Truck,
  Upload,
  Layout,
  FileText,
  Briefcase,
  GraduationCap,
  Landmark,
  FileSpreadsheet,
  Receipt,
  Newspaper,
  Clipboard,
  Settings,
  UploadCloud,
  Monitor,
  Smartphone,
} from "lucide-react";
import Head from "next/head";
import { BlogFormData } from "../admin/types/admin";
import Link from "next/link";
import DraggableMapComponent from "../google/address-locator";

const HomepageView = () => {
  return (
    <>
      <UserLayout>
        <Head>
          <title>
            Online Printout Services in UAE | Fast, Easy & Affordable – Amena.ae
          </title>
          <meta
            property="desription"
            content="Order online printouts anywhere in the UAE with Amena.ae. Upload documents and get fast, secure, and affordable delivery to your doorstep. Try now!"
          />
          <meta
            name="keywords"
            content="online printout UAE, print documents online, print service UAE, UAE printing, print delivery UAE, amenaprint, online printer UAE"
          />
          <meta
            property="og:title"
            content="Amena.ae | Online Printout Services Across UAE"
          />
          <meta
            property="og:description"
            content="Easily upload and order document printouts online. We deliver fast and affordable print services across all UAE cities."
          />
          <meta property="og:url" content="https://amena.ae" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://amena.ae/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Amena.ae | Online Printout Services Across UAE"
          />
          <meta
            name="twitter:description"
            content="Order printouts online and get fast delivery anywhere in the UAE. Affordable, reliable, and convenient printing services."
          />
          <meta name="twitter:image" content="https://amena.ae/og-image.jpg" />
        </Head>
        <div className="pb-18 pt-10">
          {/* <DraggableMapComponent /> */}
          <PrintStore />
          <WhyPrint />
          <Testimonials />
          <HowItWorks />
          <Blog />
          <SolutionConvineient />
          <FAQ />
          <About />
          {/* <Description /> */}
          {/* <MoreNeeds /> */}
        </div>
      </UserLayout>
    </>
  );
};

export const PrintStore = () => {
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
            <UploadImage />
          </div>
        </div>
      </div>
    </>
  );
};

export const UploadFiles = () => {
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

const UploadImage = () => {
  return (
    <>
      <div className="flex justify-center m-3">
        <img
          src={"https://i.imgur.com/e82CH1E.jpeg"}
          className="h-[300px] w-auto"
        />
      </div>
    </>
  );
};

export const WhyPrint = () => {
  const benefits = [
    {
      icon: <Clock className="w-10 h-10 text-emerald-500" />,
      title: "Delivery in minutes",
      description: "Instant deliveries under 30 minutes",
    },
    {
      icon: <Truck className="w-10 h-10 text-sky-500" />,
      title: "Free Shipping",
      description: `Get free shipping on all orders above ${APP_CURRENCY}100`,
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-indigo-500" />,
      title: "Secure Payments",
      description: "Your payments are protected with top security",
    },
    {
      icon: <DollarSign className="w-10 h-10 text-amber-500" />,
      title: "Best Prices",
      description: "Affordable printing services at the best rates",
    },
  ];

  return (
    <>
      <div className="bg-background p-6 mt-10 pt-20 pb-12">
        <h2 className="font-bold text-slate-800 text-3xl sm:text-4xl py-5 text-center sm:text-left">
          Why try print store?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-start"
            >
              <div className="mb-4 text-green-700">{benefit.icon}</div>
              <div className="font-bold text-slate-800 text-lg mb-1">
                {benefit.title}
              </div>
              <div className="font-medium text-sm text-slate-600">
                {benefit.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const Testimonials = () => {
  return <></>;
};

export const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-12 h-12 text-teal-500" />,
      title: "Upload Your Files",
      description:
        "Select and upload your documents in PDF, JPG, or PNG format.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-rose-500" />,
      title: "Select Address",
      description: "Enter the delivery address for your prints.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-amber-500" />,
      title: "Make Payment",
      description: "Secure online payment options for your convenience.",
    },
    {
      icon: <Printer className="w-12 h-12 text-slate-500" />,
      title: "Get Print Delivered",
      description: "Your high-quality prints delivered within minutes.",
    },
  ];
  const customizationOptions = [
    {
      icon: <Palette className="w-12 h-12 text-emerald-500" />,
      title: "Color or B&W",
      description: "Choose between color or black & white prints.",
    },
    {
      icon: <Copy className="w-12 h-12 text-sky-500" />,
      title: "Number of Copies",
      description: "Select the quantity of prints you need.",
    },
    {
      icon: <Layout className="w-12 h-12 text-indigo-500" />,
      title: "Page Orientation",
      description: "Print in Portrait or Landscape mode.",
    },
    {
      icon: <FileText className="w-12 h-12 text-cyan-500" />,
      title: "Paper Size",
      description: "Only A4 paper size is supported.",
    },
  ];

  return (
    <>
      <div className="bg-background p-6 mt-0">
        {/* Section Heading */}
        <h2 className="font-bold text-slate-800 text-3xl sm:text-4xl py-5 text-center sm:text-left">
          How Print Store works
          <div className="text-base sm:text-lg font-semibold pt-3 text-gray-700">
            Let {APP_NAME} take care of your everyday printing needs
          </div>
        </h2>

        {/* Steps Section */}
        <div className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-center my-4">{step.icon}</div>
                <div className="font-bold text-slate-800 text-lg">
                  {step.title}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        <h2 className="font-bold text-slate-800 text-2xl pt-10 text-center sm:text-left">
          Customization options
        </h2>

        <div className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {customizationOptions.map((option, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex justify-center my-4">{option.icon}</div>
                <div className="font-bold text-slate-800 text-lg">
                  {option.title}
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const HowItWorksTemplate = () => {
  return (
    <>
      <div className="text-center">
        <div className="flex justify-center my-5">
          <img
            src={imageplaceholder}
            className="w-32 bg-white p-5 rounded-lg"
          />
        </div>
        <div className="font-bold text-slate-800 text-lg">Visit store</div>
        <div className="mt-1 mb-12 font-semibold text-sm text-gray-500">
          Instant deliveries under 30 minutes
        </div>
      </div>
    </>
  );
};

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  date: string;
}

const Blog = () => {
  const { bloglist } = useFileContext();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Blogs: Instant printout
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {bloglist.map((post: BlogFormData, k) => (
          <div
            key={k}
            className="bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <img
              src={APP_SERVER_URL + "/" + post.thumbnail.path}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <p className="text-sm text-gray-500">
                {new Date(post?.createdAt!)?.toDateString()}
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mt-2">
                {post.title}
              </h3>
              <p className="text-gray-600 mt-2">
                {truncateFilename(post.excerpt, 100)}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-4 text-blue-600 font-medium hover:underline"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <Link
          href="/blog"
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Show All Blogs
        </Link>
      </div>
    </div>
  );
};

const SolutionConvineient = () => {
  const documentTypes = [
    {
      icon: <FileText className="w-12 h-12 text-sky-500" />,
      title: "Passport, Visa & Travel Documents",
    },
    {
      icon: <Briefcase className="w-12 h-12 text-emerald-500" />,
      title: "Business Contracts & Agreements",
    },
    {
      icon: <GraduationCap className="w-12 h-12 text-violet-500" />,
      title: "Educational Certificates & Transcripts",
    },
    {
      icon: <Landmark className="w-12 h-12 text-rose-500" />,
      title: "Government & Legal Documents",
    },
    {
      icon: <FileSpreadsheet className="w-12 h-12 text-amber-500" />,
      title: "Invoices & Financial Statements",
    },
    {
      icon: <Receipt className="w-12 h-12 text-cyan-500" />,
      title: "Receipts & Bills",
    },
    {
      icon: <Newspaper className="w-12 h-12 text-indigo-500" />,
      title: "Flyers, Brochures & Marketing Materials",
    },
    {
      icon: <Clipboard className="w-12 h-12 text-slate-500" />,
      title: "Medical Reports & Prescriptions",
    },
  ];

  return (
    <>
      <div className="bg-background p-6 mt-0">
        <h2 className="font-bold text-slate-800 text-3xl sm:text-4xl py-5 text-center sm:text-left">
          Solution for convenient printing needs!
          <div className="text-base sm:text-lg font-semibold pt-3 text-gray-700">
            Flexible Printing applications for multiple needs
          </div>
        </h2>

        <div className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentTypes.map((doc, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition duration-200"
              >
                <div className="flex justify-center my-4">{doc.icon}</div>
                <div className="font-bold text-slate-800 text-lg">
                  {doc.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const FAQ = () => {
  return (
    <>
      <div className="px-6 py-4">
        <h2 className="font-bold text-slate-800 text-4xl py-5 border-b border-gray-300">
          FAQs
        </h2>
        <FAQTemplate />
      </div>
    </>
  );
};

const FAQTemplate = () => {
  const faqs = [
    {
      question: "How does the Print Store work?",
      answer:
        "Our online print store allows you to upload documents, select print preferences, provide a delivery address, make payment, and get your prints delivered within minutes.",
      icon: "Printer",
    },
    {
      question: "Where can I print documents?",
      answer:
        "You can order prints from anywhere in the UAE, and we will deliver them to your doorstep.",
      icon: "MapPin",
    },
    {
      question: "What customization options are available?",
      answer:
        "You can choose between color or black & white, single-sided or double-sided, A4 format, portrait or landscape, and adjust the number of copies.",
      icon: "Settings",
    },
    {
      question: "What file formats are accepted?",
      answer: "We accept PDF, PNG, JPG, JPEG, DOCX, and TIFF files.",
      icon: "FileText",
    },
    {
      question: "What type of page formats are available?",
      answer:
        "Currently, we support A4-sized prints to ensure a standard document printing experience.",
      icon: "Layout",
    },
    {
      question: "How do I upload my documents?",
      answer:
        "Click on the upload button, choose your files from your device, and submit them for printing.",
      icon: "UploadCloud",
    },
    {
      question: "Can I print from my computer?",
      answer:
        "Yes, you can upload your documents directly from your PC or laptop and place an order.",
      icon: "Monitor",
    },
    {
      question: "Can I print from my mobile?",
      answer:
        "Yes, our website supports mobile uploads, allowing you to print from your smartphone.",
      icon: "Smartphone",
    },
    {
      question: "Are my documents handled securely?",
      answer:
        "Absolutely! Your files are encrypted, and we ensure complete confidentiality in handling your documents.",
      icon: "ShieldCheck",
    },
  ];
  const icons: any = {
    Printer,
    MapPin,
    Settings,
    FileText,
    Layout,
    UploadCloud,
    Monitor,
    Smartphone,
    ShieldCheck,
  };

  return (
    <>
      <div className="pb-10">
        <h2 className="font-bold text-xl sm:text-2xl text-slate-800 py-4 text-center sm:text-left">
          How does {APP_NAME} work?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => {
            const LucideIcon = icons[faq.icon];
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-gray-100 rounded-xl shadow-sm hover:shadow-md transition duration-200"
              >
                <LucideIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-slate-800 mb-1">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const About = () => {
  return (
    <>
      <div className="bg-background px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          <div className="md:col-span-3">
            <h2 className="font-bold text-slate-800 text-3xl md:text-4xl py-5">
              About {APP_NAME}: Printing, Reimagined 🚀🖨️
            </h2>
            <div className="text-lg md:text-xl tracking-wide space-y-4 pr-2">
              <p>
                In a world where everything is instant—messages, meals,
                rides—why should printing be any different?
              </p>
              <p>
                At Amena, we believe printing should be as effortless as sending
                a text. No more walking miles, waiting in long queues, or
                overpaying for last-minute prints. Whether it’s an urgent
                document, a university project, or travel papers, we bring the
                print shop to your doorstep.
              </p>
            </div>

            <h2 className="font-bold text-slate-800 text-3xl md:text-4xl py-5">
              Our Story 📖
            </h2>
            <div className="text-lg md:text-xl tracking-wide space-y-4 pr-2">
              <p>
                It all started with a simple question:
                <br />
                <i>"Why do people still struggle to get a printout?"</i>
              </p>
              <p>
                We’ve all been there—rushing to a meeting, realizing we forgot
                an important document, or searching for a print shop in an
                unfamiliar area. The struggle was real.
                <br />
                <b>
                  So, we built a solution: an online print store that delivers
                  to you, fast.
                </b>
              </p>
            </div>

            <h2 className="font-bold text-slate-800 text-3xl md:text-4xl py-5">
              Our Mission 🎯
            </h2>
            <div className="text-lg md:text-xl tracking-wide space-y-4 pr-2">
              <p>
                We’re on a mission to eliminate the hassle of printing. With
                Amena, printing is no longer a task—it’s a seamless experience.
              </p>
              <p>
                So next time you need a printout, don’t step out.
                <br />
                <b>Just upload, order, and relax—we'll fly it to you. ✈️🖨️</b>
                <br />
                <br />
                Let Amena take your prints where they need to be—without the
                hassle.
              </p>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center items-start">
            {/* <img
        src="/about-print-store.svg"
        alt="Illustration of online print delivery"
        className="rounded-2xl shadow-xl w-full object-contain"
      /> */}
          </div>
        </div>
      </div>
    </>
  );
};
const Description = () => {
  return (
    <>
      <div className="py-16 px-6">
        <div className="text-xs text-gray-600 leading-5">
          <div className="py-2">
            When it comes to printing services, there are two primary options to
            consider: Online printing services, Traditional brick-and-mortar
            printing shops, Online printing services like Blinkit are becoming
            increasingly popular due to print convenience and competitive
            pricing. However, traditional printing shops have been around for
            years and continue to offer a range of printing options.
          </div>
          <div className="py-2">
            When it comes to online printing services, there are several factors
            to consider. First of all, it's important to choose a service that
            offers a range of printing options, including document printing,
            certificate printing, and bulk printing. Additionally, one has to
            ensure that the service provides high-quality printing and a range
            of paper options. Blinkit offers all these things at one place.
          </div>
          <div className="py-2">
            One benefit of trying online printing service is the convenience
            factor. With Blinkit's printing service, one can upload documents
            from the comfort of their home and have them delivered right to
            their doorstep. This can save time and energy, especially for
            businesses and organizations that require frequent printing
            services.
          </div>
          <div className="py-2">
            Another benefit of using an online printing service is the ability
            to track printing orders. Many online printing services offer
            user-friendly websites that allow users to track the status of
            printing orders and receive notifications when the orders are
            shipped. This ensure that your printing needs are met in a timely
            manner.
          </div>
          <div className="py-2">
            Blinkit launched online printing services recently. We differentiate
            ourselves from other online printing service providers through our
            delivery time. We provide high quality printing and a range of
            printing customisation options to choose from. We also offer
            competitive pricing and instant turn around times (delivery in
            minutes), making us a great option for individuals, businesses and
            organizations in need of printing services.
          </div>
          <div className="py-2">
            Blinkit is a reputable company that offers high quality printing
            services via its online printing offering. We provide high quality
            printing and a range of printing customisation options to choose
            from. We also offer competitive pricing and instant turn around
            times (delivery in minutes), making us a great option for
            individuals, businesses and organizations in need of printing
            services.
          </div>
          <div className="py-2">
            Another important factor which one should consider when choosing an
            online printing service is the pricing. One should look for a
            service that offers competitive pricing and a range of pricing
            options. Additionally, one should ensure that the service provides
            transparent pricing, so users can easily understand the cost also.
          </div>
          <div className="py-2">
            Blinkit offers competitive pricing for all type of printing
            services. We provide transparent pricing on our website, so one can
            easily understand the cost of their printing order.
          </div>
          <div className="py-2">
            When it comes to color printing, there are a few factors to
            consider. Color printing is more expensive than black and white
            printing, so it's important to choose a service that offers
            competitive pricing for color prints. Additionally, ensure that the
            service provides high-quality color printing.
          </div>
          <div className="py-2">
            Blinkit offers high-quality color printing services at competitive
            prices. We use state-of-the-art printing technology to ensure that
            one's color printing needs are met with precision and accuracy.
          </div>
          <div className="py-2">
            Overall, online printing services like Blinkit offer a convenient
            and cost-effective option for individuals, businesses and
            organisations in need of printing services. By considering factors
            like quality of service, convenience, and pricing, one can find the
            best printing option
          </div>
        </div>
      </div>
    </>
  );
};

const MoreNeeds = () => {
  const SEOTags = [
    "PDF Print",
    "Annual Report Printing",
    "Fitness Plan Printing",
    "Legal Document Print",
    "Homework Worksheet Printing",
    "Survey & Questionnaire Printing",
    "Script Printing",
    "College Work",
    "School Work",
    "College Work",
    "Assignments",
    "Activity Sheets",
    "Colouring Books",
    "eBooks",
    "Articles and PDFs",
    "Memes",
    "Photographs",
    "ID Proofs",
    "Aadhar Card",
    "Tax fillings",
    "Lease agreement",
    "Tax fillings",
    "Tax proofs",
    "Event Programmes",
    "Newsletter Printing",
    "A4 Printing",
    "Books",
    "Study Material / Guide Printing",
    "School Book Printing",
    "Magazine",
    "School Book Printing",
    "Comic Book Printing",
    "Family History Book Printing",
    "Bulk Book Printing",
    "Gaming Rulebook",
    "Children Book",
    "Portfolios",
    "Year Book",
    "Instructions Print",
    "Instructions Print",
    "Thesis Print",
    "Flyers, Pamphlet or Leaflet - Black and White Printing",
    "Dissertation Print",
    "Final Major Project",
    "Thesis Dissertation Print",
    "Notecards",
    "Certificate Print",
    "Flyers, Pamphlet or Leaflet - Black and White Printing",
    "Letterhead Printing",
    "Bill Books",
    "Notebook",
    "Photo Calendar",
    "Passport forms",
    "Visa forms",
    "Travel tickets",
    "Bank applications",
    "Religious Printing & Publishing",
    "Training / Instruction Manual Printing",
    "Presentation",
    "Proposal Print",
    "Table and Tentcards",
    "Official documents",
    "Government documents",
    "Bills",
    "Rental agreement",
    "Invoices",
  ];
  return (
    <>
      <div className="px-6 py-22">
        <div className="">
          <h4 className="font-bold text-sm">
            Many more needs {APP_NAME} could fullfill
          </h4>
          <div
            className="flex gap-x-2.5 gap-y-3 wrap py-3"
            style={{ flexFlow: "wrap" }}
          >
            {SEOTags.map((tag: string, i: number) => (
              <div className="text-xs" key={i}>
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageView;
