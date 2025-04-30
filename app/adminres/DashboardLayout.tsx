"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface Restaurant {
  id: string;
  name: string;
  userId: number;
  address: string;
  city: string;
  postal: string;
  verifiedByAdmin: boolean;
  deliveryTime: number;
  menu: any[];
  available: boolean;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedRestaurant = restaurants.find((r) => r.id === selectedRestaurantId);

  

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("/api/gateway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            service: "restaurant",
            path: `/restaurants/user/${user?.id}`,
            method: "GET",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data);
        if (data.length > 0) {
          setSelectedRestaurantId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchRestaurants();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading your dashboard...</div>;
  }

  const hasUnverified = restaurants.some((r) => !r.verifiedByAdmin);

  if (restaurants.length === 0 || hasUnverified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Your Restaurant Request is Pending</h2>
          <p className="text-gray-700 mb-4">
            You have one or more restaurants pending admin verification. Please wait until your account is verified.
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <select
            value={selectedRestaurantId || ""}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white shadow-sm text-sm"
          >
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Render children under selected restaurant context */}
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
