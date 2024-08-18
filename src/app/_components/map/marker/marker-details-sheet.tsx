import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { type MarkerWithVisitStatus, api } from "~/trpc/react";
import MarkerComments from "./marker-comments";
import { FaDirections, FaCheck } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";

type MarkerDetailsSheetProps = {
  trigger: boolean;
  marker: MarkerWithVisitStatus;
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
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const toggleVisit = api.markerVisit.toggleVisit.useMutation({
    onSuccess: async () => {
      const message = marker.visitedByCurrentUser ? "Back in time!" : "Good job!";
      toast.success(message);
			await utils.marker.invalidate()
      await utils.markerVisit.invalidate();
      await utils.markerComment.invalidate(); // Invalidate comments to update the list with the new comment
    },
  });

  const addComment = api.markerComment.create.useMutation({
    onSuccess: async () => {
      toggleVisit.mutate({ markerId: marker.id }); // Toggle the visit status after the comment is added
      setIsCommentModalOpen(false); // Close the modal after success
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
    marker: Marker
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
    if (marker.visitedByCurrentUser) {
      // Toggle visit directly if already visited
      toggleVisit.mutate({ markerId: marker.id });
    } else {
      // Open the comment modal if not visited
      setIsCommentModalOpen(true);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty!");
      return;
    }
    // Add comment and toggle visit
    addComment.mutate({ markerId: marker.id, text: comment });
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
                variant={marker.visitedByCurrentUser ? "outline" : "default"}
                onClick={handleToggleVisit}
              >
                {marker.visitedByCurrentUser ? (
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

      {/* Comment Modal */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Comment</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full rounded-md border border-gray-300 p-2"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience about this marker..."
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={handleCommentSubmit}>Submit</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};

export default MarkerDetailsSheet;
