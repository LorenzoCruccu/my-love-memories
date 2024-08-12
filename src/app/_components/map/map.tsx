"use client";
import React, { useCallback, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  InfoWindow,
  Map,
  MapControl,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { api } from "~/trpc/react";
import { type Marker } from "@prisma/client";
import ControlPanel from "./controlPanel";

const center = {
  lat: 42.5,
  lng: 12.5,
};

const GoogleMapComponent = () => {
  const [allMarkers] = api.marker.getAllMarkers.useSuspenseQuery();

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: "100%", height: "700px" }}
        defaultCenter={center}
        defaultZoom={6}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        mapId={"525423038a968bd5"}
      >
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
