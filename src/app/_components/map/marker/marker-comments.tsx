import React, { useState } from "react";
import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input"; // Assuming you have an Input component
import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { HiPaperAirplane, HiTrash } from "react-icons/hi"; // Only using the trash icon for deletion
import { useAlertDialog } from "~/providers/alert-dialog-provider";

type MarkerCommentsProps = {
  markerId: number;
};

const MarkerComments: React.FC<MarkerCommentsProps> = ({ markerId }) => {
  const { data: session } = useSession();
  const [comments] = api.markerComment.getCommentsFromMarkerId.useSuspenseQuery(
    { markerId }
  );
  const utils = api.useUtils();
  const { showAlertDialog } = useAlertDialog();

  const createComment = api.markerComment.create.useMutation({
    onSuccess: async () => {
      await utils.markerComment.invalidate();
      toast.success("Comment added!");
    },
  });

  const deleteComment = api.markerComment.delete.useMutation({
    onSuccess: async () => {
      await utils.markerComment.invalidate();
      toast.success("Comment deleted!");
    },
  });

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    createComment.mutate({
      markerId,
      text: newComment,
    });

    setNewComment("");
  };

  const handleDeleteComment = (commentId: number) => {
    showAlertDialog({
      title: "Confirm Deletion",
      description:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      onCancel: () => console.log("Deletion cancelled"),
      onConfirm: () => {
        deleteComment.mutate({
          id: commentId,
        });
      },
    });
  };

  return (
    <div>
      <h3 className="mt-4 text-lg font-bold">Comments</h3>
      <Separator className="my-2" />
      <ScrollArea className="h-32">
        {comments?.map((comment) => (
          <div key={comment.id} className="flex items-start gap-4 py-2">
            <Avatar>
              <AvatarImage
                src={comment.createdBy.image ?? ""}
                alt={comment.createdBy.name ?? "image"}
              />
              <AvatarFallback>
                {comment.createdBy.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-semibold">
                  {comment.createdBy.name}
                </p>
                {comment.createdById === session?.user?.id && (
                  <button
                    className="pr-4 text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteComment(comment.id)}
                    aria-label="Delete comment"
                  >
                    <HiTrash className="h-5 w-5" />
                  </button>
                )}
              </div>
              <p className="text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
      {session && (
        <div className="mt-4 flex items-center gap-2">
          <Avatar className="shrink-0">
            <AvatarImage
              src={session.user?.image ?? ""}
              alt={session.user?.name ?? "Avatar"}
            />
            <AvatarFallback>{session.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 items-center rounded-md border bg-white p-2">
            <Input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border-none focus:ring-0"
              disabled={createComment.isPending}
            />
            <Button
              variant="ghost"
              className="text-blue-600"
              onClick={handleAddComment}
              disabled={createComment.isPending}
            >
              {createComment.isPending ? (
                <div className="loader h-5 w-5 border-2 border-t-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <HiPaperAirplane className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkerComments;
