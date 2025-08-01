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

  const isOwner = user?.roles.includes("ROLE_RESTAURANT_OWNER");
  const isDelivery = user?.roles.includes("ROLE_DELIVERY_PERSON");

  if (user && !isOwner && !isDelivery) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700 mb-4">
            This dashboard is restricted to restaurant owners and delivery personnel only.
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

    if (user?.id && isOwner) {
      fetchRestaurants();
    } else {
      setLoading(false);
    }
  }, [user?.id, isOwner]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  // Check if user has any restaurants that are not verified
  const hasUnverifiedRestaurants = restaurants.some((r) => !r.verifiedByAdmin);
  const hasVerifiedRestaurants = restaurants.some((r) => r.verifiedByAdmin);

  if (isOwner && hasUnverifiedRestaurants && !hasVerifiedRestaurants) {
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
        {/* <div className="flex items-center justify-between mb-6">
          {isOwner && (
            <select
              value={selectedRestaurantId || ""}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              className="px-4 py-2 border rounded-md bg-white shadow-sm text-sm"
            >
              {restaurants
                .filter((r) => r.verifiedByAdmin)
                .map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
            </select>
          )}
        </div> */}

        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
