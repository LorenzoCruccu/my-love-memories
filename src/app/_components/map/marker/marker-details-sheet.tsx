import React, { useState } from "react";
import { type Marker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { HiTrash, HiLocationMarker } from "react-icons/hi";
import {
  FaSun,
  FaMoon,
  FaStar,
  FaMountain,
  FaCity,
  FaUmbrellaBeach,
  FaLandmark,
  FaUserFriends,
  FaUser,
  FaHeart,
  FaDirections,
  FaCheck,
  FaThumbsUp,
  FaThumbsDown,
  FaComments,  // Comment icon
  FaGlassCheers,
  FaTree,
  FaBed,
  FaSmile,
  FaMusic,
} from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAlertDialog } from "~/providers/alert-dialog-provider";
import { type MarkerWithVisitStatus, api } from "~/trpc/react";
import MarkerComments from "./marker-comments";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TbTargetArrow } from "react-icons/tb";
import { Spotify } from "react-spotify-embed";

type MarkerDetailsSheetProps = {
  trigger: boolean;
  marker: MarkerWithVisitStatus;
  photoUrls: string[];
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

const MarkerDetailsSheet: React.FC<MarkerDetailsSheetProps> = ({
  trigger,
  marker,
  onCancel,
  photoUrls,
}) => {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { showAlertDialog } = useAlertDialog();
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false); // State to handle comments dialog

  const toggleVisit = api.markerVisit.toggleVisit.useMutation({
    onSuccess: async () => {
      await utils.markerComment.invalidate();
      const message = marker.visitedByCurrentUser
        ? "Back in time!"
        : "Good job!";
      toast.success(message);
      marker.visitedByCurrentUser = !marker.visitedByCurrentUser;
    },
  });

  const addComment = api.markerComment.create.useMutation({
    onSuccess: async () => {
      toggleVisit.mutate({ markerId: marker.id });
      setIsCommentModalOpen(false);
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
    if (marker.visitedByCurrentUser) {
      toggleVisit.mutate({ markerId: marker.id });
    } else {
      setIsCommentModalOpen(true);
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim() === "") {
      toast.error("Comment cannot be empty!");
      return;
    }
    addComment.mutate({ markerId: marker.id, text: comment });
  };

  // Handle voting logic
  const voteMarker = api.markerVote.voteMarker.useMutation({
    onSuccess: async () => {
      await utils.marker.invalidate();
      toast.success("Vote recorded!");
    },
  });

  const handleVote = (voteType: "UP" | "DOWN") => {
    voteMarker.mutate({ markerId: marker.id, vote: voteType });
  };

  // Helper function to determine the icon based on the pill type
  const getPillIcon = (pillType: string) => {
    switch (pillType) {
      case "sunset":
        return <FaSun />;
      case "sunrise":
        return <FaMoon />;
      case "stars":
        return <FaStar />;
      case "landscape":
        return <FaMountain />;
      case "beach":
        return <FaUmbrellaBeach />;
      case "city":
        return <FaCity />;
      case "monuments":
        return <FaLandmark />;
      case "friends":
        return <FaUserFriends />;
      case "alone":
        return <FaUser />;
      case "girlfriend":
        return <FaHeart />;
      case "party":
        return <FaGlassCheers />;
      case "romantic":
        return <FaHeart />;
      case "peaceful":
        return <FaTree />;
      case "relaxing":
        return <FaBed />;
      case "exciting":
        return <FaSmile />;
      case "music":
        return <FaMusic />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={trigger} onOpenChange={onCancel}>
      <SheetContent side={"bottom"} className="pb-6 sm:p-8">
        <SheetHeader>
          <div className="mt-2 flex items-center text-sm text-gray-700">
            <HiLocationMarker className="mr-2 h-5 w-5 text-red-500" />
            <span className="font-semibold">{marker?.address}</span>
          </div>
          <SheetTitle className="mt-2 text-center text-2xl font-bold">
            {marker.title}
          </SheetTitle>
        </SheetHeader>
        <SheetDescription></SheetDescription>
        <div className="mt-4">
          <Card className="shadow-lg">
            <CardHeader>
              <p className="text-center text-sm text-gray-500">
                {marker.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {marker.suggestedSpotifySongUrl && (
                  <div className="w-full max-w-md">
                    <Spotify wide link={marker.suggestedSpotifySongUrl} />
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-2">
                  {marker.mood && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      {getPillIcon(marker.mood)} {marker.mood}
                    </Badge>
                  )}
                  {marker.mustSee && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      {getPillIcon(marker.mustSee)} {marker.mustSee}
                    </Badge>
                  )}
                  {marker.suggestedWith && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      {getPillIcon(marker.suggestedWith)} {marker.suggestedWith}
                    </Badge>
                  )}
                  {(marker.suggestedAgeFrom ?? marker.suggestedAgeTo) && (
                    <Badge variant="outline" className="text-xs">
                      {marker.suggestedAgeFrom}-{marker.suggestedAgeTo} years
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {photoUrls.length > 0 && (
            <div className="mt-6">
              <Carousel
                className="w-full max-w-2xl"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent className="-ml-1 flex">
                  {photoUrls.map((photoUrl: string, index: number) => (
                    <CarouselItem
                      key={index}
                      className="flex w-full justify-center"
                    >
                      <div className="p-1">
                        <Image
                          src={photoUrl}
                          alt="Location"
                          className="mx-auto h-80 w-full max-w-md rounded-lg object-cover"
                          width={800}
                          height={600}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          <div className="mt-6 flex flex-col justify-end gap-4 sm:flex-row">
					<Button
            variant="outline"
            className="flex items-center"
            onClick={() => setIsCommentsDialogOpen(true)}
          >
            <FaComments className="text-blue-500" />
            <span className="ml-1 text-sm">{marker.commentsCount}</span>
          </Button>
            <Button
              variant={"outline"}
              className="w-full sm:w-auto"
              onClick={handleGetDirections}
            >
              <FaDirections className="mr-2" />
              Directions
            </Button>

            {session && (
              <Button
                variant={marker.visitedByCurrentUser ? "outline" : "default"}
                className="w-full sm:w-auto"
                onClick={handleToggleVisit}
              >
                {marker.visitedByCurrentUser ? (
                  <>
                    <FaCheck className="mr-2" /> Visited
                  </>
                ) : (
                  <>
                    <TbTargetArrow className="mr-2" /> HIT this marker!
                  </>
                )}
              </Button>
            )}

            {marker.createdById === session?.user.id && (
              <Button
                variant={"destructive"}
                className="w-full sm:w-auto"
                onClick={(e) => handleDelete(e, marker)}
              >
                <HiTrash className="mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Voting section styled similar to StackOverflow */}
        <div className="mt-6 flex justify-center items-center gap-4">
          <Button
            variant="ghost"
            className="flex flex-col items-center"
            onClick={() => handleVote("UP")}
          >
            <FaThumbsUp className="text-green-500" />
          </Button>
          <div className="text-xl font-bold">{marker.voteCount}</div>

        </div>
      </SheetContent>

      {/* Comments Dialog */}
      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
          </DialogHeader>
          <MarkerComments markerId={marker.id} />
        </DialogContent>
      </Dialog>

      {/* Comment Modal for new comment */}
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
