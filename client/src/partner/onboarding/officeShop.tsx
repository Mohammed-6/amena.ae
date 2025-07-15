import {
  shopDetailsType,
  useOnboardingContext,
} from "@/context/OnboardingContext";
import DraggableMapComponent from "@/src/google/address-locator";
import { useEffect, useState } from "react";

type OpeningHours = {
  [key: string]: { open: string; close: string };
};

const ShopRegistrationForm = () => {
  const {
    onboarding,
    submitShopDetails,
    updateShopDetails,
    handleMultipleUpload,
  } = useOnboardingContext();
  const [formData, setFormData] = useState<shopDetailsType>({
    shopName: "",
    shopPhotos: [],
    address: "",
    location: { type: "Point", coordinates: [25.1808005, 55.2603772] },
    phone: null,
    openingDate: "",
    website: "",
    businessLocation: "",
    serviceArea: "",
    openingHours: {},
  });
  const [openingHours, setOpeningHours] = useState<OpeningHours>({
    Monday: { open: "06:00", close: "18:00" },
    Tuesday: { open: "06:00", close: "18:00" },
    Wednesday: { open: "06:00", close: "18:00" },
    Thursday: { open: "06:00", close: "18:00" },
    Friday: { open: "06:00", close: "18:00" },
    Saturday: { open: "06:00", close: "18:00" },
    Sunday: { open: "06:00", close: "18:00" },
  });

  useEffect(() => {
    const isNotEmpty = (obj: Record<string, any>) =>
      Object.keys(obj).length > 0;
    if (isNotEmpty(onboarding.shopDetails.openingHours)) {
      setOpeningHours(onboarding.shopDetails.openingHours);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateShopDetails(name, value);
  };

  const handleChangeLocation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const temp = [...onboarding.shopDetails.location.coordinates];
    temp[index] = Number(value);
    // updateShopDetails("location", { type: "Point", coordinates: temp });
  };

  const updateLatLng = (lat: number, lng: number, address: string | null) => {
    // console.log(lat, lng, address);
    const temp = [...onboarding.shopDetails.location.coordinates];
    temp[0] = lat;
    temp[1] = lng;
    if (address !== null && address !== "") {
      updateShopDetails("businessLocation", address);
    }
    updateShopDetails("location", { type: "Point", coordinates: temp });
  };

  const handleTimeChange = (
    day: string,
    field: "open" | "close",
    value: string
  ) => {
    setOpeningHours((prev) => {
      const updatedHours = {
        ...prev,
        [day]: { ...prev[day], [field]: value },
      };

      updateShopDetails("openingHours", updatedHours); // Pass the updated state
      return updatedHours; // Update the state
    });
  };

  useEffect(() => {
    updateShopDetails("openingHours", openingHours);
  }, [openingHours]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const image = await handleMultipleUpload(Array.from(e.target.files));
      if (image) {
        updateShopDetails("shopPhotos", image);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Submitted Data:", formData);
    const temp = { ...formData };
    temp.openingHours = openingHours;
    submitShopDetails(temp);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 gradient-bg">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-center">
          Offline Shop Registration
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">Shop Name</label>
          <input
            type="text"
            name="shopName"
            value={onboarding.shopDetails.shopName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <label className="block mb-2">Shop Photos</label>
          <input
            type="file"
            name="shopPhotos"
            onChange={handleFileChange}
            multiple
            className="w-full p-1 border rounded-md mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-600"
            required={onboarding.shopDetails.shopPhotos.length === 0}
          />

          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={onboarding.shopDetails.address}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <label className="block mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={onboarding.shopDetails.phone!}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <label className="block mb-2">Opening Date</label>
          <input
            type="date"
            name="openingDate"
            value={onboarding.shopDetails.openingDate}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <label className="block mb-2">Website</label>
          <input
            type="url"
            name="website"
            value={onboarding.shopDetails.website}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />

          <label className="block mb-2">Business Location</label>
          <input
            type="text"
            name="businessLocation"
            value={onboarding.shopDetails.businessLocation}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <div>
            <div className="w-full h-64">
              <DraggableMapComponent
                updateLocation={updateLatLng}
                location={onboarding.shopDetails.location}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3">
            <div>
              <label className="block mb-2">Business Location Lat</label>
              <input
                type="number"
                name=""
                value={onboarding.shopDetails.location?.coordinates?.[0] || ""}
                onChange={(e) => handleChangeLocation(e, 0)}
                className="w-full p-2 border rounded-md mb-4"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Business Location Lng</label>
              <input
                type="number"
                name=""
                value={onboarding.shopDetails.location?.coordinates?.[1] || ""}
                onChange={(e) => handleChangeLocation(e, 1)}
                className="w-full p-2 border rounded-md mb-4"
                required
              />
            </div>
          </div>

          <label className="block mb-2">Service Area</label>
          <input
            type="text"
            name="serviceArea"
            value={onboarding.shopDetails.serviceArea}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
            required
          />

          <h3 className="text-lg font-semibold mb-2">Opening Hours</h3>
          {Object.keys(openingHours).map((day) => (
            <div key={day} className="mb-2">
              <label className="block font-semibold">{day}</label>
              <div className="flex gap-4">
                <input
                  type="time"
                  value={openingHours[day].open}
                  onChange={(e) =>
                    handleTimeChange(day, "open", e.target.value)
                  }
                  className="p-2 border rounded-md"
                  required
                />
                <input
                  type="time"
                  value={openingHours[day].close}
                  onChange={(e) =>
                    handleTimeChange(day, "close", e.target.value)
                  }
                  className="p-2 border rounded-md"
                  required
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mt-4"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;
