"use client";

import React, { useEffect, useState } from "react";
import DeliverySidebar from "../deliverer/SidebarDeliverer";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BikeIcon, UserIcon } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface DeliveryPerson {
  id: string;
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  vehicleType: string;
  vehiclePlate: string;
  status: 'online' | 'offline' | 'busy';
  isVerified: boolean;
  currentZone: string;
  rating: number;
}

function DeliveryDashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [deliveryProfile, setDeliveryProfile] = useState<DeliveryPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'online' | 'offline' | 'busy'>('offline');

  useEffect(() => {
    const fetchDeliveryProfile = async () => {
      try {
        const response = await fetch("/api/gateway", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            service: "delivery",
            path: `/delivery/profile/${user?.id}`,
            method: "GET",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch delivery profile");
        }

        const data = await response.json();
        setDeliveryProfile(data);
        setStatus(data.status);
      } catch (error) {
        console.error("Error fetching delivery profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDeliveryProfile();
    }
  }, [user?.id]);

  const handleStatusChange = async (newStatus: 'online' | 'offline' | 'busy') => {
    try {
      const response = await fetch("/api/gateway", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          service: "delivery",
          path: `/delivery/status/${deliveryProfile?.id}`,
          method: "PUT",
          body: { status: newStatus }
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setStatus(newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-600">Loading your dashboard...</div>;
  }

  if (!deliveryProfile || !deliveryProfile.isVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-semibold text-purple-600 mb-4">Your Delivery Account is Pending</h2>
          <p className="text-gray-700 mb-4">
            Your delivery partner registration is pending verification. Please wait until your account is verified by our team.
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
      <DeliverySidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <BikeIcon size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="font-semibold">{deliveryProfile.firstName} {deliveryProfile.lastName}</h2>
                <p className="text-sm text-gray-500">{deliveryProfile.vehicleType} • {deliveryProfile.vehiclePlate}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Status:</span>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value as 'online' | 'offline' | 'busy')}
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    status === 'online' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : status === 'busy' 
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  <option value="online">Online</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <StarIcon size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{deliveryProfile.rating.toFixed(1)}</span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <UserIcon size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DeliveryDashboardLayout;