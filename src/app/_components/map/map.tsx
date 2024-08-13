"use client";
import React, { useCallback, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
  type MapMouseEvent,
  Marker,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { api } from "~/trpc/react";
import { type Marker } from "@prisma/client";
import ControlPanel from "./controlPanel";
import { CustomMapControl } from "./mapControl";
import MapHandler from "./map-handler";
import { type LatLng } from "leaflet";

const center = {
  lat: 42.5,
  lng: 12.5,
};

const GoogleMapComponent = () => {
  const [allMarkers] = api.marker.getAllMarkers.useSuspenseQuery();

  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);

  // store clicked location
  const [selectedLocation, setSelectedLocation] = useState({});
  // store show dialog state to add location
  const [showDialog, setShowDialog] = useState(false);
  // store dialog location
  const [dialogLocation, setDialogLocation] = useState<LatLng | null>();

  const handleMapClick = (mapProps: MapMouseEvent) => {
    // checks if location clicked is valid
    if (mapProps?.detail.latLng) {
      const lat = mapProps.detail.latLng.lat;
      const lng = mapProps.detail.latLng.lng;
      setShowDialog(true);
      setDialogLocation({ lat, lng });
      setSelectedLocation({ lat, lng });
    } else {
      // show alert message
      alert("Please select the specific location");
    }
  };

  // add location to show in a list
  const onAddLocation = () => {
    // Create a Google Maps Geocoder instance
    const geocoder = new window.google.maps.Geocoder();

    // Reverse geocode the coordinates to get the place name
    void geocoder.geocode({ location: selectedLocation }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          console.log(results[0]);

          setShowDialog(false);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: "100%", height: "700px" }}
        defaultCenter={center}
        defaultZoom={6}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        mapId={"525423038a968bd5"}
        onClick={(mapProps) => handleMapClick(mapProps)}
      >
        {showDialog && (
          // displays a dialog to add clicked location
          <InfoWindow position={dialogLocation}>ciao</InfoWindow>
        )}
        <Marker position={dialogLocation} zIndex={999999999} />

        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          onPlaceSelect={setSelectedPlace}
        />
        <MapHandler place={selectedPlace} />

        <ControlPanel />

        {allMarkers.map((_marker) => (
          <MarkerWithInfoWindow key={_marker.id} marker={_marker} />
        ))}
      </Map>
    </APIProvider>
  );
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
        <InfoWindow anchor={markerInstance} onClose={handleClose}>
          <div className="text-black">
            <h2 className="pb-2 text-xl font-medium">{marker.title}</h2>

            <p className="font-">{marker.description}</p>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default GoogleMapComponent;
