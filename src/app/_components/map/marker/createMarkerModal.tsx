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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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

export function CreateMarkerModal({
  newMarkerLocation,
  onMarkerCreated,
}: CreateMarkerModalProps) {
  const [open, setOpen] = useState(false);

  // State to handle form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mood, setMood] = useState("");
	const [partnerName, setPartnerName] = useState("");
	const [partnerInstagram, setPartnerInstagram] = useState("");

  const [suggestedSpotifySongUrl, setSuggestedSpotifySongUrl] = useState("");

  const utils = api.useUtils();

  const createMarker = api.marker.create.useMutation({
    onSuccess: async () => {
      await utils.marker.invalidate();
			await utils.objective.invalidate(); // refresh objective stats
      setOpen(false);
      toast.success("You flagged this spot!");

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
        address: newMarkerLocation.address!,
        mood,
				partnerName,
				partnerInstagram,
        suggestedSpotifySongUrl,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex w-full items-center justify-center">
        <Button variant="default">Flag this place</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] w-full p-4">
        <DialogHeader>
          <DialogTitle>📍 {newMarkerLocation?.address}</DialogTitle>
          <DialogDescription>Add this place to your collection</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="title" className="sm:text-right">
                Title*
              </Label>
              <Input
                id="title"
                value={title}
								required
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name this spot, be original!"
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="description" className="sm:text-right">
                Description*
              </Label>
              <Textarea
                id="description"
								required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How do you recognize this spot?"
                className="sm:col-span-3"
              />
            </div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="partner-name" className="sm:text-right">
                Partner Name*
              </Label>
              <Input
                id="partner-name"
								required
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Your partner name"
                className="sm:col-span-3"
              />
            </div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="partner-instagram" className="sm:text-right">
                Partner Instagram Nickname
              </Label>
              <Input
                id="partner-instagram"
                value={partnerInstagram}
								maxLength={30}
                onChange={(e) => setPartnerInstagram(e.target.value)}
                placeholder="Paste Instagram Nickname"
                className="sm:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="mood" className="sm:text-right">
                Mood
              </Label>
              <Select onValueChange={setMood}>
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peaceful">Peaceful</SelectItem>
									<SelectItem value="romantic">Romantic</SelectItem>
                  <SelectItem value="passionate">Passionate</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="suggestedSpotifySongUrl" className="sm:text-right">
                Spotify Song
              </Label>
              <Input
                id="suggestedSpotifySongUrl"
                value={suggestedSpotifySongUrl}
                onChange={(e) => setSuggestedSpotifySongUrl(e.target.value)}
                placeholder="Paste Spotify URL"
                className="sm:col-span-3"
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
