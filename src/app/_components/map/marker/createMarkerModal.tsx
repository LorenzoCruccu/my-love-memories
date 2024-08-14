"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Define the props type
type CreateMarkerModalProps = {
  newMarkerLocation: {
    lat: number;
    lng: number;
    address?: string;
  } | null | undefined;
  onMarkerCreated?: () => void;
};

export function CreateMarkerModal({ newMarkerLocation, onMarkerCreated }: CreateMarkerModalProps) {
  const [open, setOpen] = useState(false);

  // State to handle form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const utils = api.useUtils();

  const createMarker = api.marker.create.useMutation({
    onSuccess: async () => {
      await utils.marker.invalidate();
      setOpen(false);
			toast.success("You flagged this spot!")

      if (onMarkerCreated) {
        onMarkerCreated(); // Notify parent component
      }
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate or sanitize inputs as necessary before sending
    if (title.trim() && newMarkerLocation) {
      createMarker.mutate({
        title,
        description,
        lat: newMarkerLocation.lat,
        lng: newMarkerLocation.lng,
        intimacyLevel: 1,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex w-full items-center justify-center">
        <Button variant="outline">Flag this place</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>📍 {newMarkerLocation?.address}</DialogTitle>
          <DialogDescription>Add this place to your collection</DialogDescription>
					<DialogDescription></DialogDescription>

        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name this spot, be original!"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How do you recognize this spot?"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={createMarker.isPending}>
              {createMarker.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
