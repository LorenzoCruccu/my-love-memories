"use client";
import React, { useCallback, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  type MapMouseEvent,
  Pin,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { type MarkerWithVisitStatus, api } from "~/trpc/react";
import MapHandler from "./map-handler";
import { CreateMarkerModal } from "./marker/createMarkerModal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import MarkerDetailsSheet from "./marker/marker-details-sheet";
import ControlPanel from "./controlPanel";
import Title from "../site/title";

const center = {
  lat: 42.5,
  lng: 12.5,
};

const GoogleMapComponent = () => {
  const {data:allMarkers} = api.marker.getAllMarkers.useQuery()
  const { data: session } = useSession();
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newMarkerLocation, setNewMarkerLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [userCanAdd, setUserCanAdd] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for the map

  const handleTrophyClick = () => {
    console.log("trophy icon clicked");
  };

  const handleMarkerCreated = () => {
    setShowDialog(false);
    setNewMarkerLocation(null);
    console.log("Marker has been successfully created!");
  };

  const handleAdd = () => {
    console.log("Add button clicked!");
    setUserCanAdd(!userCanAdd);

    const message = !userCanAdd
      ? "Click anywhere to add a marker"
      : "Drag mode enabled";
    toast.success(message);
    // Add your logic here
  };

  const handleMapClick = async (mapProps: MapMouseEvent) => {
    if (!session?.user.id) {
      toast.error("You must be logged in to put a flag!");
      return;
    }
    if (!userCanAdd) {
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
    if (!window.google?.maps?.places) {
      console.error("Google Places API is not loaded.");
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    void geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
        const formattedAddress = results[0].formatted_address;
        setNewMarkerLocation({
          lat: lat,
          lng: lng,
          address: formattedAddress,
        });
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  };

  const MarkerWithInfoWindow: React.FC<{
    marker: MarkerWithVisitStatus;
  }> = ({ marker }) => {
    const [markerRef, markerInstance] = useAdvancedMarkerRef();
    const [infoWindowShown, setInfoWindowShown] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);

    const handleMarkerClick = useCallback(() => {
      setInfoWindowShown((isShown) => !isShown);
      if (!photos.length && markerInstance?.map) {
        fetchPlaceDetails(marker.lat, marker.lng, markerInstance.map);
      }
    }, [photos, markerInstance?.map]);

    const fetchPlaceDetails = (
      lat: number,
      lng: number,
      map: google.maps.Map | null,
    ) => {
      if (!window.google?.maps.places) {
        console.error("Google Places API is not loaded.");
        return;
      }

      const service = new window.google.maps.places.PlacesService(map!);

      const request = {
        location: { lat, lng },
        radius: 50, // Adjust this radius based on your requirements
        query: marker.title, // Use the title or any query that best represents the place
      };

      service.nearbySearch(request, (results, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          results?.[0]
        ) {
          const placeId = results[0].place_id;
          if (!placeId) return;
          service.getDetails(
            { placeId, fields: ["photos"] },
            (placeDetails, statusDetails) => {
              if (
                statusDetails ===
                  window.google.maps.places.PlacesServiceStatus.OK &&
                placeDetails?.photos
              ) {
                const photoUrls = placeDetails.photos.map((photo) =>
                  photo.getUrl({ maxWidth: 1000, maxHeight: 1000 }),
                );
                setPhotos(photoUrls || []);
              } else {
                console.error("Failed to retrieve place details or photos.");
              }
            },
          );
        }
      });
    };

    return (
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: marker.lat, lng: marker.lng }}
        onClick={handleMarkerClick}
      >
        {marker.visitedByCurrentUser ? (
          <Pin
            background={"#AD49E1"} // lightPurple
            borderColor={"#7A1CAC"} // purple
            glyphColor={"#EBD3F8"} // lavender
          />
        ) : (
          <Pin
            background={"#D3D3D3"} // grey (for unvisited markers)
            borderColor={"#696969"} // dark grey (border for unvisited markers)
            glyphColor={"#696969"} // dim grey (glyph color for unvisited markers)
          />
        )}

        {infoWindowShown && (
          <>
            <div>
              <MarkerDetailsSheet
                trigger={infoWindowShown}
                marker={marker}
                photoUrls={photos}
                confirmText="Delete"
                cancelText="Cancel"
                onCancel={() => setInfoWindowShown(false)}
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
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      {isLoading && (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-b from-[#D3B1C2] to-[#613659] text-white">
          <div className="loader">
            <Image
              className="h-full w-auto object-contain"
              src={"/static/hide-and-hit.png"}
              alt={"logo hide and hit"}
              sizes="auto"
              height={500}
              width={500}
            />
            <span className="mt-4 flex justify-center">
              loading places
              <span className="ml-1">
                <span className="animate-dot-blink-1">.</span>
                <span className="animate-dot-blink-2">.</span>
                <span className="animate-dot-blink-3">.</span>
              </span>
            </span>
          </div>
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

        <MapHandler place={selectedPlace} />
        <Title />
        <ControlPanel onAdd={handleAdd} onTrophyClick={handleTrophyClick} />
        {allMarkers &&
          allMarkers.length > 0 &&
          allMarkers.map((_marker) => (
            <MarkerWithInfoWindow key={_marker.id} marker={_marker} />
          ))}
      </Map>
    </APIProvider>
  );
};

export default GoogleMapComponent;
