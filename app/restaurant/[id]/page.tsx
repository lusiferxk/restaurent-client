"use client";
import React, { useEffect, useState } from "react";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ChevronLeftIcon,
  ThumbsUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchFromService } from "@/utils/fetchFromService";
import { motion } from "framer-motion";
import MealCard from "@/components/MealCard";

const categories = ["All", "Pizza", "Salads", "Drinks", "Desserts"];
const reviews = [
  {
    id: 1,
    author: "Sarah M.",
    rating: 5,
    date: "2 days ago",
    content:
      "Amazing food and quick delivery! The Margherita pizza was absolutely perfect.",
    likes: 12,
    isVerified: true,
  },
  {
    id: 2,
    author: "John D.",
    rating: 4,
    date: "1 week ago",
    content:
      "Great food but delivery took a bit longer than expected. Still worth the wait!",
    likes: 8,
    isVerified: true,
  },
];

const popularDishes = [
  {
    id: 1,
    name: "Margherita Pizza",
    orders: 2504,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    name: "Pepperoni Pizza",
    orders: 2100,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  },
];

export default function RestaurantDetailsPage() {
  const params = useParams();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("menu");
  const [restaurant, setRestaurant] = useState<any>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await fetchFromService(
          "restaurant",
          `/restaurants/${params.id}`,
          "GET"
        );
        setRestaurant(data);
      } catch (err) {
        console.error("Error loading restaurant", err);
      }
    };
    if (params?.id) fetchRestaurant();
  }, [params?.id]);

  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">Restaurant not found</div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Link
        href="/"
        className="fixed top-10 left-9 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-purple-400 transition-colors"
      >
        <ChevronLeftIcon size={24} />
      </Link>

      <div className="relative h-[40vh] md:h-[60vh]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-7 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <StarIcon
                  size={20}
                  className="text-yellow-500 mr-1"
                  fill="currentColor"
                />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon size={20} className="mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <span>{restaurant.deliveryFee} delivery</span>
              <div className="flex items-center">
                <MapPinIcon size={20} className="mr-1" />
                <span>1.2 miles away</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-24 py-10">
        <div className="bg-purple-100 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-purple-900">Hours</h3>
              <div className="text-sm text-gray-600">
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-900">Contact</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <PhoneIcon size={16} className="mr-2" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <GlobeIcon size={16} className="mr-2" />
                  <span>www.restaurant.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-900">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {(restaurant.categories || []).map((category: string) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-15 mt-15 ">
          <h2 className="text-2xl font-bold mb-4">Popular Dishes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-34 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium">{dish.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>{dish.orders} orders</span>
                    <div className="flex items-center">
                      <StarIcon
                        size={16}
                        className="text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b mb-8 border-purple-300">
          <div className="flex space-x-8">
            <button
              className={`pb-4 px-2 ${
                activeTab === "menu"
                  ? "border-b-2 border-purple-600 text-purple-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("menu")}
            >
              Menu
            </button>
            <button
              className={`pb-4 px-2 ${
                activeTab === "reviews"
                  ? "border-b-2 border-purple-600 text-purple-600 font-medium"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>
        </div>

        {activeTab === "menu" ? (
          <>
            <div className="mb-8">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === category
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-6xl mx-auto mt-8 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(restaurant.menu || []).map((item: any, idx: number) => (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                  >
                    <MealCard
                      image={item.image}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      ingredients={item.ingredients || []}
                      restaurantName={restaurant.name}
                      restaurantRating={restaurant.rating}
                      deliveryTime={restaurant.deliveryTime}
                      distance={"1.2 km"}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{review.author}</span>
                      {review.isVerified && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Verified Order
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fill="currentColor"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                    <ThumbsUpIcon size={16} />
                    <span className="text-sm">{review.likes}</span>
                  </button>
                </div>
                <p className="text-gray-600">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
