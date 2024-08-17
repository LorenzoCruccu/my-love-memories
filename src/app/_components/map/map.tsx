"use client";
import React, { useCallback, useState, useEffect } from "react";
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
  type MapMouseEvent,
  Pin,
  useAdvancedMarkerRef,
  Marker as MarkerGoogleMaps,
} from "@vis.gl/react-google-maps";
import { api } from "~/trpc/react";
import MapHandler from "./map-handler";
import { CreateMarkerModal } from "./marker/createMarkerModal";
import { type Marker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { HiTrash } from "react-icons/hi";
import { toast } from "sonner";
import MarkerDetailsSheet from "./marker/marker-details-sheet";

const center = {
  lat: 42.5,
  lng: 12.5,
};

const GoogleMapComponent = () => {
  const [allMarkers] = api.marker.getAllMarkers.useSuspenseQuery();
  const { data: session } = useSession();

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [newMarkerLocation, setNewMarkerLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true); // Loading state for the map

  const handleMarkerCreated = () => {
    setShowDialog(false);
    setNewMarkerLocation(null);
    console.log("Marker has been successfully created!");
  };

  const handleMapClick = async (mapProps: MapMouseEvent) => {
    if (!session?.user.id) {
      toast.error("You must be logged in to put a flag!");
			return;
    }
    // checks if location clicked is valid
    if (mapProps?.detail.latLng) {
      const lat = mapProps.detail.latLng.lat;
      const lng = mapProps.detail.latLng.lng;
      setShowDialog(true);
      setNewMarkerLocation({ lat, lng });

      searchAddress(lat, lng);
    } else {
      // show alert message
      setShowDialog(false);
      setNewMarkerLocation(null);
      alert("Please select the specific location");
    }
  };

  const searchAddress = (lat: number, lng: number) => {
    // Create a Google Maps Geocoder instance
    const geocoder = new window.google.maps.Geocoder();

    // Reverse geocode the coordinates to get the place name
    void geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results?.[0]) {
          // Filter out plus_code type from address_components
          const filteredAddressComponents =
            results[0].address_components.filter(
              (component) => !component.types.includes("plus_code"),
            );

          // Rebuild the formatted address without the plus_code component
          const formattedAddress = filteredAddressComponents
            .map((component) => component.long_name)
            .join(", ");

          console.log(formattedAddress);

          // Set the new marker location with the filtered address
          setNewMarkerLocation({
            lat: lat,
            lng: lng,
            address: formattedAddress,
          });
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const MarkerWithInfoWindow: React.FC<{ marker: Marker }> = ({ marker }) => {
    const [markerRef, markerInstance] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);

    const handleMarkerClick = useCallback(() => {
      setInfoWindowShown((isShown) => !isShown);
    }, []);

    const handleClose = useCallback(() => {
      setInfoWindowShown(false);
    }, []);

    return (
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={handleMarkerClick}
      >
        <Pin
          background={"#0f9d58"}
          borderColor={"#006425"}
          glyphColor={"#60d98f"}
        />
        {infoWindowShown && (
          <>
            <div>
              <MarkerDetailsSheet
                trigger={infoWindowShown}
                marker={marker}
                confirmText="Delete"
                cancelText="Cancel"
								onCancel={()=>{setInfoWindowShown(false)}}
              />
            </div>
          </>
        )}
      </AdvancedMarker>
    );
  };

  // Handle map loading
  const handleMapIdle = useCallback(() => {
    setIsLoading(false); // Hide loader once the map has finished loading
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center from-[#2e026d] to-[#15162c] text-white">
          <div className="loader">loading...</div>
        </div>
      )}
      <Map
        style={{ width: "100%", height: "100vh" }}
        defaultCenter={center}
        defaultZoom={6}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"525423038a968bd5"}
        onIdle={handleMapIdle} // Trigger when the map finishes loading
        onClick={(mapProps) => handleMapClick(mapProps)}
      >
        {showDialog && (
          // displays a dialog to add clicked location
          <>
            <InfoWindow
              headerContent={<span className="font-bold">New marker </span>}
              position={newMarkerLocation}
              onClose={() => {
                setShowDialog(false);
                setNewMarkerLocation(null);
              }}
            >
              <p className="pb-2">{newMarkerLocation?.address}</p>
              <CreateMarkerModal
                newMarkerLocation={newMarkerLocation}
                onMarkerCreated={handleMarkerCreated}
              />
            </InfoWindow>
          </>
        )}
        {/*
       <CustomMapControl
          controlPosition={ControlPosition.TOP}
          onPlaceSelect={setSelectedPlace}
        />
	*/}

        <MapHandler place={selectedPlace} />

        {/** <ControlPanel session={session} />*/}

        {allMarkers.map((_marker) => (
          <MarkerWithInfoWindow key={_marker.id} marker={_marker} />
        ))}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapComponent;
