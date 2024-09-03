import React, { useState } from "react";
import { type Marker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { HiTrash, HiLocationMarker } from "react-icons/hi";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaComments,
  FaDirections,
  FaCheck,
  FaBed,
  FaCity,
  FaGlassCheers,
  FaHeart,
  FaLandmark,
  FaMoon,
  FaMountain,
  FaMusic,
  FaSmile,
  FaStar,
  FaSun,
  FaTree,
  FaUmbrellaBeach,
  FaUser,
  FaUserFriends,
} from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
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
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TbTargetArrow } from "react-icons/tb";
import { Spotify } from "react-spotify-embed";
import CircleProgress from "~/components/ui/circle-progress";

type MarkerDetailsSheetProps = {
  trigger: boolean;
  marker: MarkerWithVisitStatus;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const getLevelAndProgress = (voteCount: number) => {
  if (voteCount <= 10) {
    return { level: 1, progress: (voteCount / 10) * 100 };
  } else if (voteCount <= 50) {
    return { level: 2, progress: ((voteCount - 10) / 40) * 100 };
  } else {
    return { level: 3, progress: 100 };
  }
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
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false);

  const { data: totalVotes } = api.markerVote.getTotalVotes.useQuery({
    markerId: marker.id,
  });
  const { data: userVote } = api.markerVote.checkUserVote.useQuery({
    markerId: marker.id,
  });

  const { level, progress } = getLevelAndProgress(totalVotes ?? 0);

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

  const voteMarker = api.markerVote.voteMarker.useMutation({
    onSuccess: async () => {
      await utils.markerVote.invalidate();
      toast.success("Vote recorded!");
    },
  });

  const removeVote = api.markerVote.removeVote.useMutation({
    onSuccess: async () => {
      await utils.markerVote.invalidate();
      toast.success("Vote removed!");
    },
  });

  const handleVote = (voteType: "UP" | "DOWN") => {
    if (userVote?.hasVoted) {
      removeVote.mutate({ markerId: marker.id });
    } else {
      voteMarker.mutate({ markerId: marker.id, vote: voteType });
    }
  };

  const getPillIcon = (pillType: string) => {
    switch (pillType) {
      case "party":
        return <FaGlassCheers />;
      case "romantic":
        return <FaHeart />;
      case "peaceful":
        return <FaTree />;

      default:
        return null;
    }
  };

  return (
    <Sheet open={trigger} onOpenChange={onCancel}>
      <SheetContent side={"bottom"} className="pb-6 sm:p-8">
        <SheetHeader>
          <SheetTitle className="mt-2 text-center text-2xl font-bold">
            {marker.title}
            <div className="text-center text-sm text-gray-700">
              <span className="flex justify-center pt-4">
                <HiLocationMarker className="mr-2 h-5 w-5 text-red-500" />
                <span className="font-semibold">{marker?.address}</span>
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Progress Bar Card */}
          <Card className="flex flex-col items-center justify-center pb-4 shadow-lg">
            <CircleProgress
              progress={progress}
              level={level}
              voteCount={totalVotes ?? 0}
            />
            <Button
              variant="outline"
              className="flex flex-col items-center"
              onClick={() => handleVote("UP")}
            >
              {userVote?.hasVoted ? (
                <>
                  <FaThumbsDown className="text-red-500" />
                  Remove Vote
                </>
              ) : (
                <>
                  <FaThumbsUp className="text-green-500" />
                  Upvote
                </>
              )}
            </Button>
          </Card>

          {/* Spotify Song Card */}
          {marker.suggestedSpotifySongUrl && (
            <Card className="flex items-center justify-center shadow-lg">
              <div className="w-full max-w-xl">
                <Spotify wide link={marker.suggestedSpotifySongUrl} />
              </div>
            </Card>
          )}
        </div>

        <div className="mt-4">
          <Card className="shadow-lg">
            <CardHeader>
              <p className="text-center text-sm text-gray-500">
                {marker.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div className="flex flex-wrap justify-center gap-2">
                  {marker.mood && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs"
                    >
                      {getPillIcon(marker.mood)} {marker.mood}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
      </SheetContent>

      <Dialog
        open={isCommentsDialogOpen}
        onOpenChange={setIsCommentsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <h3 className="text-lg font-bold">Comments</h3>
            </DialogTitle>
          </DialogHeader>
          <MarkerComments markerId={marker.id} />
        </DialogContent>
      </Dialog>

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
