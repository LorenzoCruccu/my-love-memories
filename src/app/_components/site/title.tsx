import * as React from "react";
import { Badge } from "~/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import Image from "next/image";

const Title: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="absolute left-0 top-0 mt-2 flex transform items-center justify-center p-2 space-x-3 cursor-pointer">
      <Badge
        className="flex items-center rounded-full bg-purple hover:bg-lightPurple p-2 focus:bg-purple-700 sm:px-4 sm:py-2"
        onClick={handleOpenDialog}
      >
        <Image
          className="h-6 w-6 object-contain sm:h-8 sm:w-8"
          src={"/static/hide-and-hit-logo.png"}
          alt={"logo hide and hit"}
          sizes="auto"
          height={32}
          width={32}
        />
        <span className="ml-2 text-base font-bold text-white sm:ml-3 sm:text-lg">
          Hide and Hit
        </span>
      </Badge>

      {/* Dialog for displaying site info */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Site Information
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              Welcome to Hide and Hit. This site allows you to mark locations
              and engage with the community. Explore features and have fun!
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-bold focus:outline-none focus:ring-0">
                    Is it accessible?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-bold focus:outline-none focus:ring-0">
                    How does it work?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can mark locations on the map and interact with other
                    users by commenting and liking markers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-bold focus:outline-none focus:ring-0">
                    Can I delete my markers?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can delete your markers at any time.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Title;
