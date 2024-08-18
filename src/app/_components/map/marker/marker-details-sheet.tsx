import React from "react";
import { type Marker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { HiTrash, HiLocationMarker } from "react-icons/hi";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { api } from "~/trpc/react";
import MarkerComments from "./marker-comments";
import { FaDirections, FaCheck } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";

type MarkerDetailsSheetProps = {
  trigger: boolean;
  marker: Marker;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

const MarkerDetailsSheet: React.FC<MarkerDetailsSheetProps> = ({
  trigger,
  marker,
  onCancel,
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { showAlertDialog } = useAlertDialog();

  const { data: isVisited } = api.markerVisit.isVisited.useQuery({
    markerId: marker.id,
  });

  // Mutation to toggle visit status
  const toggleVisit = api.markerVisit.toggleVisit.useMutation({
    onSuccess: async () => {
			const message = isVisited ? "Back in time!" : "Good job!"
      toast.success(message);
      await utils.markerVisit.invalidate();
    },
  });

  const deleteMarker = api.marker.delete.useMutation({
    onSuccess: async () => {
      await utils.marker.invalidate();
      toast.success("You deleted this spot!");
    },
  });

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    marker: Marker,
  ) => {
    e.preventDefault();

    showAlertDialog({
      title: "Confirm Deletion",
      description:
        "Are you sure you want to delete this marker? All related info will disappear. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onCancel: () => console.log("Deletion cancelled"),
      onConfirm: () => {
        if (marker.createdById === session?.user.id) {
          deleteMarker.mutate({
            id: marker.id,
          });
        }
      },
    });
  };

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${marker.lat},${marker.lng}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleToggleVisit = () => {
    toggleVisit.mutate({ markerId: marker.id });
  };

  return (
    <Sheet open={trigger} onOpenChange={onCancel}>
      <SheetContent side={"bottom"} className="pb-4 sm:p-6">
        <SheetHeader>
          <div className="mt-2 flex items-center text-sm text-gray-700">
            <HiLocationMarker className="mr-2 h-5 w-5 text-red-500" />
            <span className="pr-2 font-medium">{marker?.address}</span>
          </div>
          <SheetTitle className="mt-4 text-lg font-bold sm:text-xl">
            {marker.title}
          </SheetTitle>

          <SheetDescription className="mt-2 text-sm text-gray-500">
            {marker.description}
          </SheetDescription>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant={"outline"} onClick={handleGetDirections}>
              <FaDirections />
              <span className="pl-1">Directions</span>
            </Button>

            {session && (
              <Button
                variant={isVisited ? "outline" : "default"}
                onClick={handleToggleVisit}
              >
                {isVisited ? (
                  <>
                    <FaCheck className="mr-1" /> Visited
                  </>
                ) : (
                  <>
                    <TbTargetArrow className="mr-1" /> HIT this marker!
                  </>
                )}
              </Button>
            )}

            {marker.createdById === session?.user.id && (
              <Button
                variant={"destructive"}
                onClick={(e) => handleDelete(e, marker)}
              >
                <HiTrash />
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="mt-6">
					
          <MarkerComments markerId={marker.id} />
					
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MarkerDetailsSheet;
