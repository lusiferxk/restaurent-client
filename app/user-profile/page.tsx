"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  Search,
  Edit,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchFromService } from "@/utils/fetchFromService";

// Sample data - replace with API calls
const sampleActiveOrders = [
  {
    id: 1,
    restaurantName: "Burger Place",
    items: ["Double Cheeseburger", "Fries", "Coke"],
    total: 25.99,
    status: "Preparing",
    time: "15-25 min",
    address: "123 Main St",
    phone: "555-0123",
    image: "/images/order-placeholder.jpg",
  },
  {
    id: 2,
    restaurantName: "Pizza Palace",
    items: ["Pepperoni Pizza", "Garlic Bread"],
    total: 32.5,
    status: "On the way",
    time: "10-15 min",
    address: "456 Oak Ave",
    phone: "555-0124",
    image: "/images/order-placeholder.jpg",
  },
];

const sampleOrderHistory = [
  {
    id: 101,
    restaurantName: "Noodle House",
    items: ["Pad Thai", "Spring Rolls", "Thai Tea"],
    total: 28.75,
    status: "Completed",
    date: "May 2, 2025",
    address: "123 Main St",
    phone: "555-0123",
    image: "/images/order-placeholder.jpg",
  },
  {
    id: 102,
    restaurantName: "Taco Time",
    items: ["Burrito Supreme", "Nachos", "Horchata"],
    total: 22.5,
    status: "Completed",
    date: "April 28, 2025",
    address: "123 Main St",
    phone: "555-0123",
    image: "/images/order-placeholder.jpg",
  },
  {
    id: 103,
    restaurantName: "Sushi Spot",
    items: ["California Roll", "Miso Soup", "Green Tea"],
    total: 35.99,
    status: "Completed",
    date: "April 23, 2025",
    address: "123 Main St",
    phone: "555-0123",
    image: "/images/order-placeholder.jpg",
  },
];

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [activeOrders, setActiveOrders] = useState(sampleActiveOrders);
  const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [userLocation, setUserLocation] = useState({
    lat: 6.9271,
    lng: 79.8612,
  });
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
    address: "",
    postalCode: "",
  });

  useEffect(() => {
    // This would be replaced with actual API calls to fetch user data
    if (user) {
      setUserDetails({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        email: user.email || "",
        phoneNumber: user.contact || "",
        city: user.city || "",
        address: user.address || "",
        postalCode: "10000", // Default or from API
      });

      // Parse location from address if available
      if (user.address) {
        try {
          const [lat, lng] = user.address
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            setUserLocation({ lat, lng });
          }
        } catch (error) {
          console.error("Failed to parse location:", error);
        }
      }

      // Fetch active orders and order history
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      // These would be actual API calls
      // const activeOrdersResponse = await fetchFromService("order", "/api/orders/active", "GET");
      // setActiveOrders(activeOrdersResponse);
      // const historyResponse = await fetchFromService("order", "/api/orders/history", "GET");
      // setOrderHistory(historyResponse);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // This would be an actual API call
      // const response = await fetchFromService(
      //   "user",
      //   "/api/user/update",
      //   "PUT",
      //   userDetails
      // );

      setEditMode(false);
      // Update global auth context if needed
      // updateUser(response);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const filteredOrders = orderHistory.filter(
    (order) =>
      order.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Profile Header with Tabs */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center shadow-md">
                  <User size={36} className="text-indigo-600" />
                </div>

                <div className="ml-4">
                  <h1 className="text-2xl font-bold">
                    {userDetails.firstName} {userDetails.lastName}
                  </h1>
                  <p className="text-purple-200 mb-4">Member since April 2025</p>
                  
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 rounded-tl-lg rounded-tr-lg font-medium transition-all ${
                    activeTab === "profile"
                      ? "bg-white text-purple-700"
                      : "bg-purple-500/20 text-white hover:bg-purple-500/40"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("active")}
                  className={`px-4 py-2 rounded-tl-lg rounded-tr-lg font-medium transition-all ${
                    activeTab === "active"
                      ? "bg-white text-purple-700"
                      : "bg-purple-500/20 text-white hover:bg-purple-500/40"
                  }`}
                >
                  Active Orders
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2 rounded-tl-lg rounded-tr-lg font-medium transition-all ${
                    activeTab === "history"
                      ? "bg-white text-purple-700"
                      : "bg-purple-500/20 text-white hover:bg-purple-500/40"
                  }`}
                >
                  Order History
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Personal Information
                </h2>
                <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="flex items-center text-sm border border-purple-400 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition"
                >
                  <Edit size={16} className="mr-1" />
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
                <button
                    onClick={() => setEditMode(!editMode)}
                    className="flex items-center text-sm border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    <Edit size={16} className="mr-1" />
                    {editMode ? "Cancel" : "Log Out"}
                  </button>
                  </div>
              </div>

              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.firstName}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.lastName}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.email}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            email: e.target.value,
                          })
                        }
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.phoneNumber}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.city}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={userDetails.postalCode}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <User className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">Full Name</span>
                      </div>
                      <p className="ml-7 text-gray-800">
                        {userDetails.firstName} {userDetails.lastName}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Mail className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="ml-7 text-gray-800">{userDetails.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Phone className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">Phone</span>
                      </div>
                      <p className="ml-7 text-gray-800">
                        {userDetails.phoneNumber}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                        <span className="font-medium">City</span>
                      </div>
                      <p className="ml-7 text-gray-800">{userDetails.city}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Your Location
                    </h3>
                    <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <MapContainer
                        center={userLocation}
                        zoom={13}
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={userLocation} />
                      </MapContainer>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Orders Tab Content */}
          {activeTab === "active" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">
                Your Active Orders
              </h2>

              {activeOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag size={64} className="mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-4">
                    You don't have any active orders.
                  </p>
                  <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                    Order Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ y: -5 }}
                      className="rounded-xl overflow-hidden shadow bg-white border border-gray-100"
                    >
                      <div className="relative">
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-full h-40 object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {order.time}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {order.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-lg mb-1">
                          Order #{order.id}
                        </div>
                        <div className="text-purple-600 font-medium mb-2">
                          {order.restaurantName}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <Clock className="w-4 h-4 mr-1" /> Expected:{" "}
                          {order.time}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <MapPin className="w-4 h-4 mr-1" /> {order.address}
                        </div>
                        <div className="text-gray-500 text-sm mb-2">
                          Items: {order.items.join(", ")}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-semibold">
                            ${order.total.toFixed(2)}
                          </span>
                          <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm">
                            Track Order
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Order History Tab Content */}
          {activeTab === "history" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-purple-800">
                  Your Order History
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={64} className="mx-auto text-gray-300" />
                  <p className="text-gray-500 mt-4">No order history found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      whileHover={{ y: -5 }}
                      className="rounded-xl overflow-hidden shadow bg-white border border-gray-100"
                    >
                      <div className="relative">
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-full h-40 object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {order.date}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                          {order.status}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="font-bold text-lg mb-1">
                          Order #{order.id}
                        </div>
                        <div className="text-purple-600 font-medium mb-2">
                          {order.restaurantName}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <Calendar className="w-4 h-4 mr-1" /> {order.date}
                        </div>
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <MapPin className="w-4 h-4 mr-1" /> {order.address}
                        </div>
                        <div className="text-gray-500 text-sm mb-2">
                          Items: {order.items.join(", ")}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-semibold">
                            ${order.total.toFixed(2)}
                          </span>
                          <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-sm">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
