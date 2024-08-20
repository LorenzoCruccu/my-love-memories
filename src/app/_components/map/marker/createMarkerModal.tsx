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
import { Slider } from "~/components/ui/slider";
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
  const [mustSee, setMustSee] = useState("");
  const [suggestedWith, setSuggestedWith] = useState("");
  const [ageRange, setAgeRange] = useState<number[]>([18, 50]); // Updated to number[]
  const [suggestedSpotifySongUrl, setSuggestedSpotifySongUrl] = useState("");

  const utils = api.useUtils();

  const createMarker = api.marker.create.useMutation({
    onSuccess: async () => {
      await utils.marker.invalidate();
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
        mustSee,
        suggestedWith,
        suggestedAgeFrom: ageRange[0],
        suggestedAgeTo: ageRange[1],
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
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Name this spot, be original!"
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="description" className="sm:text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="How do you recognize this spot?"
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
                  <SelectItem value="party">Party</SelectItem>
                  <SelectItem value="romantic">Romantic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="mustSee" className="sm:text-right">
                Must See
              </Label>
              <Select onValueChange={setMustSee}>
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select must-see" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunset">Sunset</SelectItem>
                  <SelectItem value="sunrise">Sunrise</SelectItem>
                  <SelectItem value="stars">Stars</SelectItem>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="beach">Beach</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="monuments">Monuments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="suggestedWith" className="sm:text-right">
                Suggested With
              </Label>
              <Select onValueChange={setSuggestedWith}>
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select suggested with" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="alone">Alone</SelectItem>
                  <SelectItem value="girlfriend">Girlfriend</SelectItem>
                  <SelectItem value="everyone">Everyone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:items-center">
              <Label htmlFor="ageRange" className="sm:text-right">
                Age Range
              </Label>
              <div className="sm:col-span-3">
                <Slider
                  id="ageRange"
                  value={ageRange}
                  onValueChange={(val) => setAgeRange(val as [number, number])} // Cast to [number, number]
                  min={10}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm">
                  <span>{ageRange[0]} years</span>
                  <span>{ageRange[1]} years</span>
                </div>
              </div>
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
