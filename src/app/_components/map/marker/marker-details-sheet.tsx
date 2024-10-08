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
  FaInstagram,
  FaHeartbeat,
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
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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

  const handleIsShared = api.marker.toggleIsShared.useMutation({
    onSuccess: async () => {
      await utils.markerComment.invalidate();
      const message = marker.isShared ? "Back in time!" : "Good job!";
      toast.success(message);
      marker.isShared = !marker.isShared;
    },
  });

  const addComment = api.markerComment.create.useMutation({
    onSuccess: async () => {
      handleIsShared.mutate({ id: marker.id });
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
    if (marker.isShared) {
      handleIsShared.mutate({ id: marker.id });
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
      await utils.objective.invalidate(); // refresh objective stats
      toast.success("Vote recorded!");
    },
  });

  const removeVote = api.markerVote.removeVote.useMutation({
    onSuccess: async () => {
      await utils.markerVote.invalidate();
      await utils.objective.invalidate(); // refresh objective stats
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
  <SheetContent
    side={"bottom"}
    className="pb-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-64px)]"
  >
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

    <div className="mt-4 flex w-full flex-wrap items-stretch gap-6 overflow-y-scroll">
      {/* Progress Bar Card */}
      <div className="flex-grow">
        <Card className="flex h-full flex-col items-center justify-center pb-4 shadow-lg">
          <CircleProgress
            progress={progress}
            level={level}
            voteCount={totalVotes ?? 0}
          />
          {session?.user && (
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
          )}
        </Card>
      </div>

      {/* Shared Experience Card */}
      <div className="flex-grow">
        <Card className="flex h-full flex-col items-center justify-center rounded-lg bg-white p-6 pb-4 shadow-lg">
          <h3 className="mb-2 flex flex-col items-center text-center text-lg font-bold">
            {/* Avatar and Name in the First Row */}
            <div className="flex items-center">
              <Avatar className="mr-2 h-6 w-6">
                {marker.createdBy.image ? (
                  <AvatarImage
                    className="h-6 w-6 rounded-full object-cover"
                    src={marker.createdBy.image}
                    alt={marker.createdBy.name ?? "User avatar"}
                  />
                ) : (
                  <AvatarFallback className="flex h-full w-full items-center justify-center text-lg">
                    {marker.createdBy.name
                      ? marker.createdBy.name.charAt(0)
                      : ""}
                  </AvatarFallback>
                )}
              </Avatar>
              <p className="text-2xl text-gray-800">
                {session?.user.id === marker.createdById
                  ? "You"
                  : marker.createdBy.name}
              </p>
            </div>

            {/* Second Row with "shared this experience with" */}
            <span className="mt-1">shared this experience with</span>
          </h3>

          {marker.partnerName && (
            <p className="pb-3 text-3xl text-gray-800">
              {marker.partnerName}
            </p>
          )}
          {marker.partnerInstagram && (
            <div className="flex items-center">
              {/* Link to Instagram Profile */}
              <Link
                target="_blank"
                href={`https://instagram.com/${marker.partnerInstagram}`}
                passHref
              >
                <Badge
                  variant="outline"
                  className="flex cursor-pointer items-center gap-1 text-lg"
                >
                  <FaInstagram className="mr-2 text-pink-600" />
                  <p className="text-gray-600">
                    @{marker.partnerInstagram}
                  </p>
                </Badge>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Spotify Song Card */}
      {marker.suggestedSpotifySongUrl && (
        <div className="flex-grow">
          <Card className="flex h-full items-center justify-center shadow-lg">
            <div className="w-full max-w-xl px-4">
              <Spotify wide link={marker.suggestedSpotifySongUrl} />
            </div>
          </Card>
        </div>
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

        {session?.user.id === marker.createdById && (
          <Button
            variant={marker.isShared ? "outline" : "default"}
            className="w-full sm:w-auto"
            onClick={handleToggleVisit}
          >
            {marker.isShared ? (
              <>
                <FaHeartbeat className="mr-2" /> Shared
              </>
            ) : (
              <>
                <FaHeart className="mr-2" /> Share this memory with everyone
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
