"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "~/components/ui/button";

export default function Navbar() {
  const [state, setState] = React.useState(false);
  const { data: session } = useSession();

  const menus = [
    { title: "Home", path: "/your-path" },
    { title: "Blog", path: "/your-path" },
    { title: "About Us", path: "/your-path" },
    { title: "Contact Us", path: "/your-path" },
  ];

  return (
    <nav className="w-full border-b bg-white md:border-0">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center justify-between py-3 md:py-5">
          <Link href="/">
            <h1 className="text-3xl font-bold text-purple-600">Hide and Hit</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-center md:flex md:items-center md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            {menus.map((item, idx) => (
              <li key={idx} className="text-gray-600 hover:text-indigo-600">
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center space-x-4">
          {session && (
            <div className="flex items-center gap-2 text-gray-600">
              {session.user?.image && (
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarImage className="w-8 h-8 rounded-3xl" src={session.user?.image} />
                  <AvatarFallback>
                    {session.user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="hidden md:inline">{session.user?.name}</span>
            </div>
          )}
          <Button
            variant="default"
            className="rounded-lg bg-purple-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-purple-700"
          >
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="no-underline"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
