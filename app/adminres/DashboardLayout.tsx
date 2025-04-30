"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch("/api/gateway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            service: "restaurant",
            path: "/restaurants/myrestaurant",
            method: "GET",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurant");
        }

        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-600">Loading your dashboard...</div>;
  }

  if (!restaurant?.verifiedByAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Your Restaurant Verification is Pending</h2>
          <p className="text-gray-700">
            Thank you for registering your restaurant. Our team is reviewing your request. You’ll be notified once your
            account is verified and ready to go live.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}

export default DashboardLayout;
