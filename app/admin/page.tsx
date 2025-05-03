"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Users,
  Store,
  Package,
  AlertCircle,
  Home,
  Settings,
  BarChart2,
  Bell,
  LogOut,
  ClipboardList,
  ShoppingBag,
  DollarSign,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/Header";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: "pending" | "approved" | "rejected";
  location: string;
  cuisine: string;
  rating: number;
  totalOrders: number;
}

interface DeliveryPerson {
  id: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  vehicleType: string;
  phone: string;
  completedDeliveries: number;
  rating: number;
}

interface Order {
  id: string;
  restaurantName: string;
  customerName: string;
  status: "pending" | "preparing" | "out_for_delivery" | "delivered";
  total: number;
  date: string;
}

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showSidebar, setShowSidebar] = useState(true);
  const [restaurantView, setRestaurantView] = useState<
    "all" | "pending" | "approved"
  >("all");
  const [deliveryView, setDeliveryView] = useState<
    "all" | "pending" | "approved"
  >("all");

  // Mock data - Replace with actual API calls
  useEffect(() => {
    // Simulated data
    setRestaurants([
      {
        id: "1",
        name: "Tasty Bites",
        owner: "John Doe",
        status: "pending",
        location: "New York",
        cuisine: "Italian",
        rating: 4.5,
        totalOrders: 150,
      },
      {
        id: "2",
        name: "Spice Garden",
        owner: "Jane Smith",
        status: "approved",
        location: "Los Angeles",
        cuisine: "Indian",
        rating: 4.8,
        totalOrders: 280,
      },
      {
        id: "3",
        name: "Sushi Master",
        owner: "Mike Chen",
        status: "pending",
        location: "Chicago",
        cuisine: "Japanese",
        rating: 0,
        totalOrders: 0,
      },
    ]);

    setDeliveryPersons([
      {
        id: "1",
        name: "Mike Johnson",
        email: "mike@example.com",
        status: "pending",
        vehicleType: "Motorcycle",
        phone: "+1234567890",
        completedDeliveries: 0,
        rating: 0,
      },
      {
        id: "2",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        status: "approved",
        vehicleType: "Bicycle",
        phone: "+1987654321",
        completedDeliveries: 45,
        rating: 4.7,
      },
      {
        id: "3",
        name: "Alex Brown",
        email: "alex@example.com",
        status: "pending",
        vehicleType: "Car",
        phone: "+1122334455",
        completedDeliveries: 0,
        rating: 0,
      },
    ]);

    setOrders([
      {
        id: "1",
        restaurantName: "Tasty Bites",
        customerName: "Alice Brown",
        status: "pending",
        total: 45.99,
        date: "2024-03-15",
      },
    ]);
  }, []);

  const handleRestaurantAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      // TODO: Implement API call to update restaurant status
      // const response = await fetch(`/api/restaurants/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
      // });
      // if (!response.ok) throw new Error('Failed to update restaurant status');

      // Update local state
      setRestaurants(
        restaurants.map((restaurant) =>
          restaurant.id === id
            ? {
                ...restaurant,
                status: action === "approve" ? "approved" : "rejected",
              }
            : restaurant
        )
      );

      // Show success notification
      alert(
        `Restaurant ${
          action === "approve" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating restaurant status:", error);
      alert("Failed to update restaurant status");
    }
  };

  const handleDeliveryPersonAction = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    try {
      // TODO: Implement API call to update delivery person status
      // const response = await fetch(`/api/delivery/${id}/status`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected' })
      // });
      // if (!response.ok) throw new Error('Failed to update delivery person status');

      // Update local state
      setDeliveryPersons(
        deliveryPersons.map((person) =>
          person.id === id
            ? {
                ...person,
                status: action === "approve" ? "approved" : "rejected",
              }
            : person
        )
      );

      // Show success notification
      alert(
        `Delivery person ${
          action === "approve" ? "approved" : "rejected"
        } successfully`
      );
    } catch (error) {
      console.error("Error updating delivery person status:", error);
      alert("Failed to update delivery person status");
    }
  };

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurantView === "all" || restaurant.status === restaurantView
  );

  const filteredDeliveryPersons = deliveryPersons.filter(
    (person) => deliveryView === "all" || person.status === deliveryView
  );

  const sidebarItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "restaurants", icon: Store, label: "Restaurants" },
    { id: "delivery", icon: Package, label: "Delivery" },
    { id: "orders", icon: ShoppingBag, label: "Orders" },
    { id: "analytics", icon: BarChart2, label: "Analytics" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Restaurants</h3>
              <p className="text-3xl font-bold text-blue-600">
                {restaurants.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">
                Active Delivery Persons
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {deliveryPersons.filter((p) => p.status === "approved").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Pending Approvals</h3>
              <p className="text-3xl font-bold text-orange-600">
                {restaurants.filter((r) => r.status === "pending").length +
                  deliveryPersons.filter((d) => d.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">
                $
                {orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        );

      case "restaurants":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Restaurant Management</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setRestaurantView("all")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    restaurantView === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Restaurants ({restaurants.length})
                </button>
                <button
                  onClick={() => setRestaurantView("pending")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    restaurantView === "pending"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending Approvals (
                  {restaurants.filter((r) => r.status === "pending").length})
                </button>
                <button
                  onClick={() => setRestaurantView("approved")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    restaurantView === "approved"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved (
                  {restaurants.filter((r) => r.status === "approved").length})
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden relative border hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={`https://source.unsplash.com/400x250/?restaurant,food,${restaurant.cuisine}`}
                        alt={restaurant.name}
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                        25-40 min
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <span className="flex items-center mr-2">
                          <svg
                            className="w-4 h-4 text-yellow-500 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                          {restaurant.rating > 0 ? restaurant.rating : "New"}
                        </span>
                        <span>• {restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="flex items-center mr-2">
                          <svg
                            className="w-4 h-4 text-gray-500 mr-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          25-40 min
                        </span>
                        <span>• $3.99 delivery fee</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium ${
                            restaurant.status === "pending"
                              ? "text-yellow-600"
                              : restaurant.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Status:{" "}
                          {restaurant.status.charAt(0).toUpperCase() +
                            restaurant.status.slice(1)}
                        </span>
                        {restaurant.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleRestaurantAction(restaurant.id, "approve")
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleRestaurantAction(restaurant.id, "reject")
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "delivery":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Delivery Management</h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setDeliveryView("all")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    deliveryView === "all"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Delivery Persons ({deliveryPersons.length})
                </button>
                <button
                  onClick={() => setDeliveryView("pending")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    deliveryView === "pending"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending Approvals (
                  {deliveryPersons.filter((d) => d.status === "pending").length}
                  )
                </button>
                <button
                  onClick={() => setDeliveryView("approved")}
                  className={`px-5 py-2 rounded-full font-medium transition-colors duration-200 ${
                    deliveryView === "approved"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Approved (
                  {
                    deliveryPersons.filter((d) => d.status === "approved")
                      .length
                  }
                  )
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDeliveryPersons.map((person) => (
                  <div
                    key={person.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden relative border hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={`https://source.unsplash.com/400x250/?person,delivery,${person.vehicleType}`}
                        alt={person.name}
                        className="w-full h-40 object-cover"
                      />
                      <span className="absolute top-2 right-2 bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {person.vehicleType}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {person.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <span className="flex items-center mr-2">
                          <svg
                            className="w-4 h-4 text-blue-500 mr-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16 7a4 4 0 01-8 0"
                            />
                            <circle cx="12" cy="3" r="2" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 5v2m0 0a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4h1a4 4 0 014 4z"
                            />
                          </svg>
                          {person.email}
                        </span>
                        <span>• {person.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="flex items-center mr-2">
                          <svg
                            className="w-4 h-4 text-green-500 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
                          </svg>
                          {person.rating > 0 ? person.rating : "New"} ⭐
                        </span>
                        <span>• {person.completedDeliveries} deliveries</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`text-xs font-medium ${
                            person.status === "pending"
                              ? "text-yellow-600"
                              : person.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          Status:{" "}
                          {person.status.charAt(0).toUpperCase() +
                            person.status.slice(1)}
                        </span>
                        {person.status === "pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                handleDeliveryPersonAction(person.id, "approve")
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-purple-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleDeliveryPersonAction(person.id, "reject")
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Order Management</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Restaurant</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order.id}</td>
                        <td className="py-3 px-4">{order.restaurantName}</td>
                        <td className="py-3 px-4">{order.customerName}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : order.status === "preparing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "out_for_delivery"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 shadow bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={130}
                  height={80}
                  className="ml-5 mb-4"
                />
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-medium">Welcome, Admin</span>
            <button className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all font-semibold">
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-4 min-h-full">
          <span className="text-2xl font-bold text-purple-700 tracking-tight mb-5">
            Admin Panel
          </span>
          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-4 py-3 rounded-full font-medium transition-colors duration-200 text-lg space-x-3 ${
                  activeTab === item.id
                    ? "bg-purple-100 text-purple-700 shadow"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                <item.icon
                  className={`w-6 h-6 ${
                    activeTab === item.id
                      ? "text-purple-600"
                      : "text-gray-400 group-hover:text-purple-600"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
}
