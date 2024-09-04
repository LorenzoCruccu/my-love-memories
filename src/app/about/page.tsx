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
        <h1 className="mb-4 text-4xl font-extrabold">About My Love Memories</h1>
        <p className="mb-4 text-xl">
          Welcome to My Love Memories! Capture and cherish your most beautiful moments by marking special places with your partner and sharing the emotions that made them unforgettable.
        </p>
      </div>

      {/* Info Section */}
      <div className="mb-12 rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <Image
            src="/static/my-love-memories.png"
            alt="My Love Memories Logo"
            width={100}
            height={100}
            className="mx-auto mb-4 h-48 w-48 rounded-full object-cover shadow-lg"
          />
          <h2 className="text-3xl font-bold text-purple-600">
            What is My Love Memories?
          </h2>
        </div>

        <Separator className="my-6" />

        <p className="mb-6 text-center text-lg leading-relaxed text-gray-700">
          My Love Memories is a platform that allows you to mark locations that hold special meaning in your relationship. Whether it&apos;s where you first met, a romantic date spot, or a place that holds emotional value, we believe every memory deserves to be saved and revisited.
        </p>

        {/* Cards Section */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Mark Your Special Places</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                With My Love Memories, you can mark any location that’s important to you and your partner. Add details about the mood, the date, and even your partner’s name to make every marker uniquely yours.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Capture the Mood</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Every memory carries an emotion—whether it’s romantic, joyful, or peaceful. Tell the story of your memory by selecting the mood that best describes the moment you want to preserve.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Objectives Section */}
      <div className="mb-12 rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-purple-600">Your Journey, Your Objectives</h2>
        <p className="mb-6 text-center text-lg text-gray-700">
          As you mark your places and capture moods, complete meaningful objectives along the way. From marking your first ten places to capturing special moments at landmarks, every objective brings you closer to creating a beautiful journey of love and memories.
        </p>

        {/* Objectives Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Mark 10 Special Places</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Start by marking your first 10 places that mean the most to you. From your first date to your favorite vacation spot, mark the memories that define your journey.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-lightPurple-100 shadow-lg">
            <CardHeader className="text-center text-purple-700">
              <h3 className="mb-2 text-xl font-bold">Capture Unique Moments</h3>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                As you continue to add memories, complete objectives that celebrate your unique journey. Each objective unlocks more memories to treasure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-lightPurple-500 p-8 text-center text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">Ready to Capture Your Love Story?</h2>
        <p className="mb-6 text-xl">
          Start marking your favorite memories today and create a lasting journey of love.
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
