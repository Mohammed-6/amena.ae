import React, { useState, useRef, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { LocationMarkerIcon } from "@heroicons/react/outline";
import { useFileContext } from "@/context/FileUploadContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 25.2048,
  lng: 55.2708,
};

interface Props {
  updateLocation: (lat: number, lng: number, address: string) => void;
  location?: any;
  updateinitial?: any;
}

const GOOGLE_MAP_LIBRARIES: "places"[] = ["places"];

const DraggableMapComponent: React.FC<Props> = ({
  updateLocation,
  location,
  updateinitial,
}) => {
  const [center, setCenter] = useState(defaultCenter);
  const mapRef = useRef<google.maps.Map | null>(null);
  const lastLatLngRef = useRef<{ lat: number; lng: number }>(defaultCenter);

  useEffect(() => {
    const initialLatLng =
      location?.coordinates?.length === 2
        ? {
            lat: location.coordinates[0],
            lng: location.coordinates[1],
          }
        : defaultCenter;
    // console.log(initialLatLng);
    setCenter(initialLatLng);
    if (location?.coordinates?.length === 0) {
      updateinitial(defaultCenter);
    }
    // console.log(location);
  }, [mapRef]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const getAddress = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const fullAddress = results[0].formatted_address;
        // updateLocation(lat, lng, fullAddress); // ✅ send to parent
        updateLocation(lat, lng, fullAddress);
      } else {
        // console.log(lat, lng, null);
        updateLocation(lat, lng, "");
      }
    });
  };

  const onIdle = useCallback(() => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        const lat = newCenter.lat();
        const lng = newCenter.lng();

        const prevLat = lastLatLngRef.current.lat;
        const prevLng = lastLatLngRef.current.lng;

        // ✅ Only update if moved significantly (0.0001 degrees = ~11 meters)
        if (
          Math.abs(lat - prevLat) > 0.0001 ||
          Math.abs(lng - prevLng) > 0.0001
        ) {
          lastLatLngRef.current = { lat, lng };
          setCenter({ lat, lng });
          getAddress(lat, lng);
        }
      }
    }
  }, []);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="relative h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={16}
        onLoad={onLoad}
        onIdle={onIdle}
        options={{ streetViewControl: false, mapTypeControl: false }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full z-10 pointer-events-none">
        <LocationMarkerIcon className="w-10 h-10 text-red-500" />
      </div>
    </div>
  );
};

export default DraggableMapComponent;
