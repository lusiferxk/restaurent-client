"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BikeIcon } from "lucide-react";
import { motion } from "framer-motion";
import { fetchFromService } from "@/utils/fetchFromService";

export default function DeliveryPersonRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: 0,
    phoneNumber: "",
    vehicleNumber: "",
    vehicleType: "",
    vehicleImg: "",
    profileImg: "",
    nic: "",
    vehicleDocuments: "",
    licenseNumber: "",
  });

  const DISTRICTS = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Moneragala",
    "Ratnapura",
    "Kegalle",
  ];
  const VEHICLE_TYPES = ["Bicycle", "Motorcycle", "Car", "Van"];

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetchFromService(
        "user",
        "/api/auth/signup/deliveryperson",
        "POST",
        formData
      );

      if (response?.user && response?.token) {
        const userWithCity = { ...response.user, city: formData.city };
        localStorage.setItem("user", JSON.stringify(userWithCity));
        localStorage.setItem("authToken", response.token);
        router.push("/dashboard/dashboardres");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      const msg = err.message || "Registration failed.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-h-screen bg-gray-50"
    >
      <div className="flex min-h-screen max-h-screen">
        <div className="hidden lg:flex flex-1 bg-purple-700 text-white px-12 min-h-screen max-h-screen items-center justify-center">
          <div className="w-full flex flex-col items-center justify-center text-center">
            <BikeIcon size={100} className="text-purple-200 opacity-50 mb-6" />
            <div className="text-4xl font-bold mb-4">tasteBite</div>
            <h2 className="text-3xl font-bold mb-6">Join Our Delivery Network</h2>
            <p className="text-lg text-purple-100">Become a delivery partner and earn money on your own schedule.</p>
          </div>
        </div>

        <div className="flex-1 flex items-center max-h-screen justify-center px-4 sm:px-6 lg:px-8 py-1 overflow-y-auto">
          <div className="max-w-2xl w-full">
            <h2 className="text-3xl font-extrabold text-purple-900 text-center mb-5">
              Delivery Partner Registration
            </h2>
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-xl rounded-2xl p-8 space-y-6 max-h-[80vh] overflow-y-auto"
            >
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
                 <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                
                 <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="NIC"
                  required
                  value={formData.nic}
                  onChange={(e) =>
                    setFormData({ ...formData, nic: e.target.value })
                  }
                />
               
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Phone Number"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
               
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  type="number"
                  placeholder="Postal Code"
                  required
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      postalCode: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <input
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <select
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              >
                <option value="" disabled>
                  Select City
                </option>
                {DISTRICTS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Profile Image URL"
                required
                value={formData.profileImg}
                onChange={(e) =>
                  setFormData({ ...formData, profileImg: e.target.value })
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  placeholder="Vehicle Number"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleNumber: e.target.value })
                  }
                />
                <select
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  required
                  value={formData.vehicleType}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicleType: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Select Vehicle
                  </option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <input
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="License Number"
                required
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value })
                }
              />
              <input
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Vehicle Image URL"
                required
                value={formData.vehicleImg}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleImg: e.target.value })
                }
              />
              <input
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                placeholder="Vehicle Documents URL"
                required
                value={formData.vehicleDocuments}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleDocuments: e.target.value })
                }
              />
              <input
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-xl font-semibold text-white mt-4 ${
                  isSubmitting
                    ? "bg-purple-400"
                    : "bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </button>
              <div className="text-center mt-4 text-gray-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Sign in
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
