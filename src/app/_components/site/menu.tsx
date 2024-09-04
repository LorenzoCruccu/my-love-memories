"use client";

import * as React from "react";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { FaBars, FaHome, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";

const Menu: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleLinkClick = () => {
    handleCloseSheet(); // Close the sheet when a link is clicked
  };

  return (
    <div className="absolute z-30 left-0 top-0 mt-2 flex items-center p-2 space-x-3 cursor-pointer">
      <Badge
        className="flex items-center rounded-full bg-purple hover:bg-lightPurple p-2 focus:bg-purple-700 sm:px-4 sm:py-2"
        onClick={handleOpenSheet}
      >
        <Button
          variant="ghost"
          className="ml-2 text-white focus:outline-none"
          onClick={handleOpenSheet}
        >
          <FaBars size={24} />
        </Button>
      </Badge>

      {/* Sheet for displaying site info */}
      <Sheet open={isSheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent side="left" className="w-64 sm:w-80 bg-purple-100">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-purple-700">Hide and Hit</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-4">
              <Link
                href="/"
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaHome size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={handleLinkClick}
              >
                <FaInfoCircle size={20} />
                <span>How this works?</span>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Menu;
