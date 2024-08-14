import React from "react";
import { type Marker } from "@prisma/client";
import { useSession } from "next-auth/react";
import { HiTrash } from "react-icons/hi";
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
        "Are you sure you want to delete this marker? This action cannot be undone.",
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

  return (
    <Sheet open={trigger} onOpenChange={onCancel}>
      <SheetContent side={"bottom"} className="pb-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">{marker.title}</SheetTitle>
          <SheetDescription className="mt-2 text-sm text-gray-500">
            {marker.description}
          </SheetDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant={"outline"}>Directions</Button>
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
