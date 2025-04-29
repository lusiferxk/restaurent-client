"use client";
import React from "react";
import Image from "next/image";

const categories = [
  { id: 1, name: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
  { id: 2, name: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1899&q=80" },
  { id: 3, name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" },
  { id: 4, name: "Mexican", image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" },
  { id: 5, name: "Dessert", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80" },
  { id: 6, name: "Healthy", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1780&q=80" },
];

// Repeat enough times to fill the line
const repeatedCategories = Array(5).fill(categories).flat();

export function Categories() {
  return (
    <div className="py-13 mt-5 bg-white">
      <div className="container mx-auto px-14">
        <h2 className="text-2xl md:text-3xl text-purple-950 font-bold mb-6">
          What&apos;s on your mind?
        </h2>
        <div className="overflow-hidden">
          <div className="flex animate-slide">
            {repeatedCategories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer flex flex-col items-center mx-4"
              >
                <div
                  className="relative rounded-full overflow-hidden mb-2"
                  style={{ width: "130px", height: "130px" }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-20 group-hover:bg-opacity-30 transition-opacity z-10"></div>
                </div>
                <p className="text-center font-medium mt-2">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-20%);
          }
        }
        .animate-slide {
          display: flex;
          width: 500%; /* Large enough for seamless loop */
          animation: slide 40s linear infinite;
        }
      `}</style>
    </div>
  );
} 