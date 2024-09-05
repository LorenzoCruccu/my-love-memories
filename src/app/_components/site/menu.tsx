"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { FaBars, FaHome, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Menu: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname(); // Get current path

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleLinkClick = () => {
    handleCloseSheet(); // Close the sheet when a link is clicked
  };

  // Utility function to check if a link is active
  const isActive = (path: string) => pathname === path;

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
        <SheetContent side="left" className="w-64 sm:w-80 bg-gradient-to-b from-purple to-pink-800 text-white">
          <SheetHeader className="flex justify-center">
            {/* Circle Logo */}
            <div className="flex justify-center">
              <Image
                src="/static/my-love-memories.png" // Adjust the path to your logo image
                alt="My Love Memories Logo"
                width={120}  // Width of the logo
                height={120} // Height of the logo
                className="rounded-full"
              />
            </div>
						<SheetClose  autoFocus={false} />
          </SheetHeader>
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-4">
              <Link
                href="/"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/") 
                    ? "bg-purple-900 text-white" // Active state
                    : "text-white hover:bg-purple-600 hover:scale-105"
                }`}
                onClick={handleLinkClick}
              >
                <FaHome size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/about") 
                    ? "bg-purple-900 text-white" // Active state
                    : "text-white hover:bg-purple-600 hover:scale-105"
                }`}
                onClick={handleLinkClick}
              >
                <FaInfoCircle size={20} />
                <span>How this works?</span>
              </Link>
							<Link
                href="/terms-conditions"
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/terms-conditions") 
                    ? "bg-purple-900 text-white" // Active state
                    : "text-white hover:bg-purple-600 hover:scale-105"
                }`}
                onClick={handleLinkClick}
              >
                <FaInfoCircle size={20} />
                <span>Terms and Conditions</span>
              </Link>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Menu;
