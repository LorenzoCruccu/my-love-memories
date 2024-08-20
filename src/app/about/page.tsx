// app/about/page.tsx
import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-4">About Us</h1>
      <p className="text-center text-lg text-gray-700">
        Welcome to Hide and Hit! We are dedicated to providing a fun and interactive platform where you can mark your favorite locations, share experiences, and connect with others.
      </p>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Our mission is to build a community of explorers who love discovering new places and sharing their experiences. Whether it's a hidden gem in the city or a breathtaking natural landscape, we believe every spot has a story worth telling.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
