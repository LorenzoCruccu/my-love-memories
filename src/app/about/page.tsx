import React from "react";

import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-6 py-10 lg:px-20">
      {/* Header Section with the Engaging Gradient */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-lightPurple-500 p-8 text-center text-white shadow-lg">
        <h1 className="mb-4 text-4xl font-extrabold">About Us</h1>
        <p className="mb-4 text-xl">
          Welcome to Hide and Hit! We are dedicated to providing a fun and
          interactive platform where you can mark your favorite locations, share
          experiences, and connect with others.
        </p>
      </div>

      {/* Info Section */}
      <div className="mb-12 rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Image
            src="/static/hide-and-hit.png"
            alt="Hide and Hit logo"
            width={100}
            height={100}
            className="mx-auto mb-4 h-48 w-48 rounded-full object-cover shadow-lg"
          />
          <h2 className="text-3xl font-bold text-purple-600">
            What is Hide and Hit?
          </h2>
        </div>

        <Separator className="my-6" />

        <p className="mb-6 text-center text-lg leading-relaxed text-gray-700">
          Our mission is to build a community of explorers who love discovering
          new places and sharing their experiences. Whether it&apos;s a hidden gem in
          the city or a breathtaking natural landscape, we believe every spot
          has a story worth telling.
        </p>

        {/* Cards Section with a Light Purple Background */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Discover New Places</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Hide and Hit is all about discovering new and exciting places.
                Whether you&apos;re looking for a serene spot to relax or an
                adventurous location to explore, we&apos;ve got you covered.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Share Your Experiences</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Found a hidden gem? Share it with the community! Upload photos,
                write reviews, and connect with fellow explorers to inspire
                others on their next adventure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-lightPurple-500 p-8 text-center text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">Ready to Explore?</h2>
        <p className="mb-6 text-xl">
          Join Hide and Hit today and start discovering and sharing amazing
          places around the world!
        </p>
        <Link href="/">
          <Button
            variant="default"
            className="bg-white text-purple-700 hover:bg-white"
          >
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;
