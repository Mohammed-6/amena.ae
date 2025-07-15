import {
  APP_SERVER_URL,
  // APP_SOCKET_URL,
} from "@/src/utils/common";
import axios from "axios";
import {
  useState,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import axiosInstance from "@/src/utils/axiosInstance";
import { BlogFormData } from "@/src/admin/types/admin";
const APP_SOCKET_URL = process.env.NEXT_PUBLIC_APP_SOCKET_URL;

const socket = io(APP_SOCKET_URL);

interface FileData {
  file: File;
  preview: string;
  uploaded?: boolean;
}

interface savefileType {
  _id?: string;
  pages: number;
  filename: string;
  thumbnail: string;
}

interface customizationType {
  noCopies: number;
  printColor: string;
  printOrientation: string;
  deliveryAddress: string;
}

interface addressType {
  _id?: string;
  user: string;
  addressType: string;
  addressLine1: string;
  addressLine2: string;
  area: string;
  landmark: string;
  location: any;
  name: string;
  phone: number | null;
}

export interface orderType {
  user: string;
  sessionId: string;
  address: string;
  customization: customizationType;
  grandAmount: number;
  amountBreakdown: {
    pricePerPage: number;
    totalPages: number;
    itemsTotal: number;
    deliveryCharges: number;
    handlingCharges: number;
    grandTotal: number;
  };
}

interface rateType {
  colorRate: number;
  bwRate: number;
  deliveryCharges: number;
  handlingCharges: number;
}

interface fileUploadType {
  files: FileData[];
  addFiles: (newFiles: File[]) => void;
  // uploadFiles: () => Promise<void>;
  removeFile: (index: number, id: string | undefined) => void;
  savefiles: savefileType[];
  isFileLoading: boolean;
  customization: customizationType;
  updateCopiesUp: (copies: number) => void;
  updateCopiesDown: (copies: number) => void;
  updatePrintColor: (color: string) => void;
  updatePrintOrientation: (orient: string) => void;
  viewcart: boolean;
  toogleCart: () => void;
  toogleLogin: () => void;
  viewlogin: boolean;
  loginMobileInput: (number: number) => void;
  mobilenumber: number | "";
  loginSubmit: () => void;
  viewotp: boolean;
  toogleOTP: () => void;
  viewloginmobile: boolean;
  toogleLoginMobile: () => void;
  otpvalue: number | "";
  submitOTP: (number: number) => void;
  updateOTP: (number: number) => void;
  otperror: boolean;
  user: string;
  showcartmodal: boolean;
  toogleCartModal: () => void;
  viewaddress: boolean;
  toogleAddress: () => void;
  viewaeaddress: boolean;
  toogleAEAddress: () => void;
  AddEditAddress: () => void;
  updateAEAddress: (name: string, value: any) => void;
  aeaddress: addressType;
  listaddress: addressType[];
  editAddress: (data: addressType) => void;
  selectAddress: (data: string, fulladdress: any) => void;
  createOrder: () => void;
  loading: boolean;
  handleCancel: () => void;
  bloglist: BlogFormData[];
  isFileUploadFailed: boolean;
  toogleisFileUploadFailed: () => void;
  headerlocation: boolean;
  toogleHeaderlocation: () => void;
  confirmAddress: (lat: number, lng: number, address?: string) => void;
  editProfileAddress: (data: addressType) => void;
  isProfileAddressEdit: boolean;
  DeleteAddress: (id: string) => void;
  loadAddresslist: () => void;
  logoutconfirm: boolean;
  toogleLogoutconfirm: () => void;
  rate: rateType;
}

export const FileUploadContext = createContext<fileUploadType | undefined>(
  undefined
);

export const FileUploadContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [files, setfiles] = useState<FileData[]>([]);
  const [savefiles, setsavefiles] = useState<savefileType[]>([]);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [customization, setcustomization] = useState<customizationType>({
    noCopies: 1,
    printColor: "bw",
    printOrientation: "portrait",
    deliveryAddress: "",
  });
  const [viewcart, setviewcart] = useState<boolean>(true);
  const [viewlogin, setviewlogin] = useState<boolean>(false);
  const [mobilenumber, setmobilenumber] = useState<number | "">("");
  const [viewotp, setviewotp] = useState<boolean>(false);
  const [viewloginmobile, setviewloginmobile] = useState(true);
  const [otpvalue, setotpvalue] = useState<number | "">("");
  const [otperror, setotperror] = useState<boolean>(false);
  const [user, setuser] = useState<string>("");
  const [showcartmodal, setshowcartmodal] = useState<boolean>(false);
  const [viewaddress, setviewaddress] = useState<boolean>(false);
  const [viewaeaddress, setviewaeaddress] = useState<boolean>(false);
  const [aeaddress, setaeaddress] = useState<addressType>({
    _id: "",
    user: "",
    addressType: "home",
    addressLine1: "",
    addressLine2: "",
    area: "",
    landmark: "",
    location: { type: "Point", coordinates: [25.2048, 55.2708] },
    name: "",
    phone: null,
  }); // ae = a-add, e-edit
  const [listaddress, setlistaddress] = useState<addressType[]>([]);
  const [orderdetails, setorderdetails] = useState<orderType | undefined>();
  const [loading, setloading] = useState<boolean>(false);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [cancelToken, setCancelToken] = useState<AbortController | null>(null);
  const [bloglist, setbloglist] = useState<BlogFormData[]>([]);
  const [isFileUploadFailed, setisFileUploadFailed] = useState<boolean>(false);
  const [headerlocation, setheaderlocation] = useState<boolean>(false);
  const [isProfileAddressEdit, setIsProfileAddressEdit] =
    useState<boolean>(false);
  const [logoutconfirm, setlogoutcomfirm] = useState<boolean>(false);
  const [rate, setRate] = useState<rateType>({
    colorRate: 0.75,
    bwRate: 0.25,
    deliveryCharges: 0,
    handlingCharges: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const usr = localStorage.getItem("user");
      if (usr) {
        setuser(usr);
      }
    }
  }, []);

  useEffect(() => {
    const getFiles = async (url: string) => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const queryObject: { [key: string]: string } = {};
        queryParams.forEach((value, key) => {
          queryObject[key] = value;
        });
        const res = await axiosInstance.post(
          `${APP_SERVER_URL}/api/get-files`,
          {
            pathname: url,
            query: queryObject,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ip: "",
          },
          {
            headers: {
              "Content-Type": "application/json", // `multipart/form-data` isn't needed for GET requests
              clientId: localStorage.getItem("clientId"),
              sessionId: localStorage.getItem("sessionId"),
            },
          }
        );
        if (router.pathname === "/preview" && res.data.data.length === 0) {
          router.push("/");
        }

        setsavefiles(res.data.data); // Avoid duplicate appends
        setbloglist(res.data.blog);
      } catch (error: any) {
        toast.error("Something went wrong!");
        console.error(
          "Error fetching files",
          error?.response?.data?.error || error
        );
      }
    };

    router.events.on("routeChangeComplete", getFiles);

    if (typeof window !== "undefined") {
      if (savefiles.length === 0) {
        getFiles(router.asPath);
      }
    }
    return () => {
      router.events.off("routeChangeComplete", getFiles);
    };
  }, [router]);

  const addFiles = async (newFiles: File[]) => {
    const fileData = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
    }));
    setfiles((prevFiles) => [...prevFiles, ...fileData]);
    uploadFiles([...files, ...fileData]);
    setIsFileLoading(true);
    setfiles([]);
  };

  const uploadFiles = async (ufiles: FileData[]) => {
    const formData = new FormData();
    ufiles.forEach((fileData) => {
      formData.append("files", fileData.file);
    });
    const controller = new AbortController();
    setCancelToken(controller);

    try {
      await axiosInstance
        .post(APP_SERVER_URL + `/api/file-upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            clientId: localStorage.getItem("clientId"),
            sessionId: localStorage.getItem("sessionId"),
          },
          signal: controller.signal, // Pass the AbortController signal
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setProgress(percent);
          },
        })
        .then((res) => {
          console.log(res.data);
          toast.success("File uploaded successfully");
          setsavefiles((prevState) => [...prevState, ...res.data.data]);
          setIsFileLoading(false);
          if (router.pathname !== "/preview") {
            router.push("/preview");
          }
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            toast.error("File upload canceled!");
          } else {
            toast.error(error?.response?.data?.error);
            setIsFileLoading(false);
            setisFileUploadFailed(true);
            // console.log(error.response.data.error);
          }
        });
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error("Upload error", error);
      setIsFileLoading(false);
      setisFileUploadFailed(true);
    }
  };

  const handleCancel = () => {
    if (cancelToken) {
      cancelToken.abort(); // Cancel the request
      setUploading(false);
      setIsFileLoading(false);
    }
  };

  // Remove file from state
  const removeFile = async (index: number, id: string | undefined) => {
    // console.log(index, id);
    if (!id) return;
    setIsFileLoading(true);
    try {
      await axiosInstance
        .post(
          APP_SERVER_URL + `/api/delete-file`,
          { deleteid: id },
          {
            headers: {
              "Content-Type": "application/json",
              clientId: localStorage.getItem("clientId"),
              sessionId: localStorage.getItem("sessionId"),
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          setIsFileLoading(false);
          toast.success("Document deleted successfully");
          setsavefiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        })
        .catch((error) => {
          setIsFileLoading(false);
          // toast.error(error.response.data.error);
        });
    } catch (error: any) {
      setIsFileLoading(false);
      toast.error("Something went wrong!");
      console.error("Upload error", error);
    }
  };

  const updateCopiesUp = (copies: number) => {
    setcustomization({
      ...customization,
      noCopies: customization.noCopies + 1,
    });
  };

  const updateCopiesDown = (copies: number) => {
    if (copies > 1) {
      setcustomization({
        ...customization,
        noCopies: customization.noCopies - 1,
      });
    }
  };

  const updatePrintColor = (color: string) => {
    setcustomization({ ...customization, printColor: color });
  };

  const updatePrintOrientation = (orient: string) => {
    setcustomization({ ...customization, printOrientation: orient });
  };

  const toogleCart = () => {
    setviewcart(!viewcart);
  };

  const toogleCartModal = () => {
    setshowcartmodal(!showcartmodal);
  };

  const toogleLogin = () => {
    if (user !== "") {
      setviewaddress(true);
      setviewcart(false);
      return;
    }
    setviewlogin(!viewlogin);
  };

  const loginMobileInput = (number: number) => {
    setmobilenumber(number);
  };

  const loginSubmit = async () => {
    if (String(mobilenumber).length < 8) return;
    try {
      await axiosInstance
        .post(
          APP_SERVER_URL + `/api/login`,
          { mobilenumber: mobilenumber },
          {
            headers: {
              "Content-Type": "application/json",
              clientId: localStorage.getItem("clientId"),
              sessionId: localStorage.getItem("sessionId"),
            },
          }
        )
        .then((res) => {
          // console.log(res.data);
          toast.success("Otp sent!");
          setviewloginmobile(false);
          setviewotp(true);
        })
        .catch((error) => {
          // console.log(error);
          toast.error(error.response.data.message);
        });
    } catch (error: any) {
      setIsFileLoading(false);
      toast.error("Something went wrong!");
      console.error("Upload error", error);
    }
  };

  const toogleLoginMobile = () => {
    setviewloginmobile(!viewloginmobile);
  };

  const toogleOTP = () => {
    setviewotp(!viewotp);
  };
  const submitOTP = async (otp: number) => {
    setotperror(false);
    try {
      await axiosInstance
        .post(
          APP_SERVER_URL + `/api/otp-submit`,
          { otp, mobilenumber },
          {
            headers: {
              "Content-Type": "application/json",
              clientId: localStorage.getItem("clientId"),
              sessionId: localStorage.getItem("sessionId"),
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          toast.success("Login successfully");
          setuser(res.data.customer);
          localStorage.setItem("user", res.data.customer);
          setviewlogin(false);
          setotperror(false);
        })
        .catch((error) => {
          setotperror(true);
          // console.log(error);
          toast.error(error.response.data.message);
        });
    } catch (error: any) {
      setIsFileLoading(false);
      toast.error("Something went wrong!");
      console.error("Upload error", error);
    }
  };
  const updateOTP = (number: number) => {
    setotpvalue(number);
  };

  const toogleAddress = async () => {
    setviewaddress(!viewaddress);
    loadAddresslist();
  };

  const loadAddresslist = async () => {
    if (listaddress.length === 0) {
      try {
        await axiosInstance
          .post(
            APP_SERVER_URL + `/api/list-address`,
            { user: user },
            {
              headers: {
                "Content-Type": "application/json",
                clientId: localStorage.getItem("clientId"),
                sessionId: localStorage.getItem("sessionId"),
              },
            }
          )
          .then((res) => {
            console.log(res.data.address);
            setlistaddress((prevState) => [...prevState, ...res.data.address]);
          })
          .catch((error) => {
            // console.log(error);
            toast.error(error.response.data.message);
          });
      } catch (error: any) {
        setIsFileLoading(false);
        toast.error("Something went wrong!");
        console.error("Upload error", error);
      }
    }
  };

  const toogleAEAddress = () => {
    setviewaeaddress(!viewaeaddress);
    setIsProfileAddressEdit(!isProfileAddressEdit);
  };

  const updateAEAddress = (name: string, value: any) => {
    setaeaddress((prevState) => {
      return {
        ...prevState,
        [name]: value,
        user: prevState.user || user, // Keep existing user or set it
      };
    });

    // console.log(aeaddress);
  };

  const AddEditAddress = async () => {
    // console.log(aeaddress);
    try {
      await axiosInstance
        .post(APP_SERVER_URL + `/api/add-address`, aeaddress, {
          headers: {
            "Content-Type": "application/json",
            clientId: localStorage.getItem("clientId"),
            sessionId: localStorage.getItem("sessionId"),
          },
        })
        .then((res) => {
          console.log(res.data);
          toast.success(res.data.message);
          setviewaeaddress(false);
          if (res.data.code === "created") {
            setlistaddress((prevState) => [...prevState, ...res.data.address]);
          }
          if (res.data.code === "updated") {
            setlistaddress((prevAddresses) =>
              prevAddresses.map((addr) =>
                addr._id === res.data.address[0]._id
                  ? res.data.address[0]
                  : addr
              )
            );
          }
          setaeaddress({
            _id: "",
            user: "",
            addressType: "home",
            addressLine1: "",
            addressLine2: "",
            area: "",
            landmark: "",
            location: { type: "Point", coordinates: [25.2048, 55.2708] },
            name: "",
            phone: null,
          });
          setIsProfileAddressEdit(false);
        })
        .catch((error) => {
          // console.log(error);
          toast.error(error.response.data.message);
        });
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error("Upload error", error);
    }
  };

  const editAddress = (data: addressType) => {
    setaeaddress(data);
    setviewaeaddress(true);
  };

  const selectAddress = async (address: string, fulladdress: any) => {
    confirmAddress(
      Number(fulladdress.location.coordinates[0]),
      Number(fulladdress.location.coordinates[1])
    )
      .then((res) => {
        setcustomization({ ...customization, deliveryAddress: address });
        setviewaddress(false);
        setviewcart(true);
      })
      .catch((error) => {});
    // console.log(confirm);
  };

  const createOrder = async () => {
    try {
      setloading(true);
      let totalAmount = 0;
      let price = 0;
      const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);
      if (customization.printColor === "bw") {
        totalAmount = totalPages * customization.noCopies * rate.bwRate;
        price = rate.bwRate;
      } else if (customization.printColor === "color") {
        totalAmount = totalPages * customization.noCopies * rate.colorRate;
        price = rate.colorRate;
      }
      const data = {
        user: user,
        sessionId: localStorage.getItem("sessionId"),
        address: customization.deliveryAddress,
        customization: customization,
        grandAmount: totalAmount,
        amountBreakdown: {
          pricePerPage: price,
          totalPages: totalPages,
          itemsTotal: totalAmount,
          deliveryCharges: 0,
          handlingCharges: 0,
          grandTotal: totalAmount,
        },
      };
      if (customization.deliveryAddress === "") {
        toast.error("Delivery address required");
        setloading(false);
        return;
      }
      if (user === "") {
        toast.error("Please login! try again later.");
        setloading(false);
        return;
      }
      await axiosInstance
        .post(APP_SERVER_URL + `/api/create-order`, data, {
          headers: {
            "Content-Type": "application/json",
            clientId: localStorage.getItem("clientId"),
            sessionId: localStorage.getItem("sessionId"),
          },
        })
        .then((res) => {
          console.log(res.data);
          toast.success(res.data.message);
          if (res.data.order !== null) {
            socket.emit("newOrder", res.data.order);
            setviewcart(false);
            setshowcartmodal(false);
            localStorage.removeItem("sessionId");
            window.location.href = "/thankyou/" + res.data.order.orderId;
          }
          setloading(false);
        })
        .catch((error) => {
          // console.log(error);
          toast.error(error.response.data.message);
          setloading(false);
        });
    } catch (error: any) {
      setIsFileLoading(false);
      toast.error("Something went wrong!");
      console.error("Upload error", error);
      setloading(false);
    }
  };

  const toogleisFileUploadFailed = () => {
    setisFileUploadFailed(!isFileUploadFailed);
  };

  const toogleHeaderlocation = () => {
    setheaderlocation(!headerlocation);
  };

  const confirmAddress = async (lat: number, lng: number, address?: string) => {
    if (!lat || !lng) {
      toast.error("Coordinates missing");
      return Promise.reject("Invalid coordinates");
    }

    setloading(true);
    try {
      const res = await axios.post(
        APP_SERVER_URL + "/api/confirm-address",
        { coordinates: [lat, lng], address },
        {
          headers: {
            "Content-Type": "application/json",
            sessionId: localStorage.getItem("sessionId") || "",
          },
        }
      );
      let totalAmount = 0;
      let price = 0;
      const totalPages = savefiles.reduce((sum, item) => sum + item.pages, 0);
      if (customization.printColor === "bw") {
        totalAmount = totalPages * customization.noCopies * rate.bwRate;
        price = rate.bwRate;
      } else if (customization.printColor === "color") {
        totalAmount = totalPages * customization.noCopies * rate.colorRate;
        price = rate.colorRate;
      }
      const dd: rateType = res.data.rate;
      if (totalAmount < 20) {
        dd.bwRate = Number(dd.bwRate);
        dd.colorRate = Number(dd.colorRate);
        dd.deliveryCharges = 3;
        dd.handlingCharges = 3;
      }
      setRate(dd);
      setloading(false);
      // if (res?.data?.success) {
      return res.data;
      // } else {
      //   throw new Error(res?.data?.message || "Unknown server error");
      // }
    } catch (error: any) {
      console.error("Client error confirming address:", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong confirming the address"
      );
      setloading(false);
      throw error;
    }
  };

  const editProfileAddress = (data: addressType) => {
    setIsProfileAddressEdit(true);
    setaeaddress(data);
  };

  const DeleteAddress = async (id: string) => {
    // console.log(aeaddress);
    try {
      await axiosInstance
        .get(APP_SERVER_URL + `/api/delete-address/${id}`, {
          headers: {
            "Content-Type": "application/json",
            clientId: localStorage.getItem("clientId"),
            sessionId: localStorage.getItem("sessionId"),
            user: user,
          },
        })
        .then((res) => {
          console.log(res.data);
          toast.success(res.data.message);
          setlistaddress((prev) => prev.filter((page) => page?._id !== id));
        })
        .catch((error) => {
          // console.log(error);
          toast.error(error.response.data.message);
        });
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.error("error", error);
    }
  };

  const toogleLogoutconfirm = () => {
    setlogoutcomfirm(!logoutconfirm);
  };

  return (
    <FileUploadContext.Provider
      value={{
        files,
        addFiles,
        removeFile,
        savefiles,
        isFileLoading,
        customization,
        updateCopiesUp,
        updateCopiesDown,
        updatePrintOrientation,
        updatePrintColor,
        viewcart,
        toogleCart,
        viewlogin,
        toogleLogin,
        loginMobileInput,
        mobilenumber,
        loginSubmit,
        toogleOTP,
        viewotp,
        viewloginmobile,
        toogleLoginMobile,
        otpvalue,
        submitOTP,
        updateOTP,
        otperror,
        user,
        toogleCartModal,
        showcartmodal,
        viewaddress,
        toogleAddress,
        viewaeaddress,
        toogleAEAddress,
        AddEditAddress,
        updateAEAddress,
        aeaddress,
        listaddress,
        editAddress,
        selectAddress,
        createOrder,
        loading,
        handleCancel,
        bloglist,
        isFileUploadFailed,
        toogleisFileUploadFailed,
        headerlocation,
        toogleHeaderlocation,
        confirmAddress,
        editProfileAddress,
        isProfileAddressEdit,
        DeleteAddress,
        loadAddresslist,
        toogleLogoutconfirm,
        logoutconfirm,
        rate,
      }}
    >
      {children}
    </FileUploadContext.Provider>
  );
};

// Custom hook for accessing the context
export const useFileContext = (): fileUploadType => {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};
