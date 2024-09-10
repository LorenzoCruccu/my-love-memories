"use client";

import * as React from "react";
import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { FaBars, FaHome, FaInfoCircle } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.substring(0, 7) ?? '00current';
const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const Menu: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const pathname = usePathname();

  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
  };

  const handleLinkClick = () => {
    handleCloseSheet();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="absolute left-0 top-0 z-30 mt-2 flex cursor-pointer items-center space-x-3 p-2">
      <Badge
        className="flex items-center rounded-full bg-purple p-2 hover:bg-lightPurple focus:bg-purple-700 sm:px-4 sm:py-2"
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

      <Sheet open={isSheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent
          side="left"
          className="w-64 bg-gradient-to-b from-purple to-pink-800 text-white sm:w-80"
        >
          <SheetHeader className="flex justify-center">
            <VisuallyHidden>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Menu</SheetDescription>
            </VisuallyHidden>
            <div className="flex justify-center">
              <Image
                src="/static/my-love-memories.png"
                alt="My Love Memories Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
            <SheetClose autoFocus={false} />
          </SheetHeader>
          <div className="space-y-4 px-4 py-6">
            <nav className="space-y-4">
              <Link
                href="/"
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                  isActive("/")
                    ? "bg-purple-900 text-white"
                    : "text-white hover:scale-105 hover:bg-purple-600"
                }`}
                onClick={handleLinkClick}
              >
                <FaHome size={20} />
                <span>Home</span>
              </Link>
              <Link
                href="/about"
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                  isActive("/about")
                    ? "bg-purple-900 text-white"
                    : "text-white hover:scale-105 hover:bg-purple-600"
                }`}
                onClick={handleLinkClick}
              >
                <FaInfoCircle size={20} />
                <span>About us</span>
              </Link>
              <Link
                href="/terms-conditions"
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-300 ${
                  isActive("/terms-conditions")
                    ? "bg-purple-900 text-white"
                    : "text-white hover:scale-105 hover:bg-purple-600"
                }`}
                onClick={handleLinkClick}
              >
                <FaInfoCircle size={20} />
                <span>Terms and Conditions</span>
              </Link>
            </nav>
          </div>

          <div className="absolute bottom-4 left-4 text-gray-400 text-sm">
            {environment} v.{version}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Menu;
