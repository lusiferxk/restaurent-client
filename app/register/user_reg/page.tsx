"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "@/contexts/AuthContext";
import { UserIcon, MapPin, Smartphone, Mail, Lock, Utensils } from "lucide-react";
import { MapSearch } from "../../../components/MapSearch";
import { motion } from "framer-motion";
import { fetchFromService } from '@/utils/fetchFromService';

interface Location {
  lat: number;
  lng: number;
}

const SRI_LANKAN_DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Moneragala", "Ratnapura", "Kegalle"
];

interface Country {
  cca2: string;
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

function LocationMarker({ location, setLocation }: { location: Location; setLocation: (loc: Location) => void }) {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return location ? <Marker position={location} /> : null;
}

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "+94 ",
  });

  const [location, setLocation] = useState<Location>({
    lat: 6.9271,
    lng: 79.8612,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch countries
        const countriesResponse = await fetch('https://restcountries.com/v3.1/all');
        const countriesData = await countriesResponse.json();
        setCountries(countriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: `${location.lat}, ${location.lng}`,
        city: formData.city,
        postalCode: parseInt(formData.postalCode) || 10000,
        phoneNumber: formData.phoneNumber,
      };

      const response = await fetchFromService("user", "/api/auth/signup/user", "POST", payload);

      login({
        id: 1,
        name: formData.firstName,
        email: formData.email,
        contact: formData.phoneNumber,
        city: formData.city,
        address: `${location.lat}, ${location.lng}`,
        type: "user",
      });

      router.push("/");
    } catch (err: any) {
      alert(err.message || "Signup failed");
    }
  };

  const handleLocationSearch = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data[0]) {
        setLocation({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      }
    } catch (err) {
      console.error("Map search failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100"
    >
      <div className="flex min-h-screen">
        {/* Left Column - Visual Branding */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-12 flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-40 right-30 w-60 h-60 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-white"></div>
          </div>

          <div className="relative z-10 max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <Utensils size={32} className="mr-2" />
              <div className="text-4xl font-bold">TasteBite</div>
            </div>
            <h2 className="text-3xl font-bold mb-6">Join Our Food Community</h2>
            <p className="text-lg text-purple-100 mb-8">
              Create your account to discover amazing restaurants, save your favorites, and get personalized recommendations.
            </p>

            {/* <div className="flex space-x-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm"
              >
                <UserIcon size={24} />
                <p className="mt-2 text-sm">Food Explorer</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm"
              >
                <ChefHat size={24} />
                <p className="mt-2 text-sm">Restaurant Owner</p>
              </motion.div>
            </div> */}
          </div>
        </motion.div>

        {/* Right Column - Registration Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto"
        >
          <div className="max-w-2xl w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="p-8">
                {/* <div className="flex justify-center mb-6">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 shadow-md">
                    <UserIcon size={32} className="text-purple-600" />
                  </div>
                </div> */}

                {/* <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
                  Create Your Account
                </h2>
                <p className="text-center text-gray-500 mb-8">
                  Join us to start your culinary journey
                </p> */}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value, username: e.target.value })
                          }
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="flex gap-2">
                        <div className="relative w-1/3">
                          <select
                            required
                            className="mt-1 block w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={formData.phoneNumber.startsWith("+") ? formData.phoneNumber.split(" ")[0] : "+94"}
                            onChange={(e) =>
                              setFormData({ 
                                ...formData, 
                                phoneNumber: `${e.target.value} ${formData.phoneNumber.split(" ").slice(1).join(" ")}` 
                              })
                            }
                          >
                            {loading ? (
                              <option>Loading...</option>
                            ) : (
                              countries
                                .filter(country => country.idd.root && country.idd.suffixes)
                                .map((country) => {
                                  const code = `${country.idd.root}${country.idd.suffixes[0]}`;
                                  return (
                                    <option key={country.cca2} value={code}>
                                      {code} ({country.name.common})
                                    </option>
                                  );
                                })
                            )}
                          </select>
                        </div>
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Smartphone size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            required
                            className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            value={formData.phoneNumber.split(" ").slice(1).join(" ")}
                            onChange={(e) =>
                              setFormData({ 
                                ...formData, 
                                phoneNumber: `${formData.phoneNumber.split(" ")[0]} ${e.target.value}` 
                              })
                            }
                            placeholder="1234567890"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                        <select
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                        >
                          <option value="" disabled>Select your district</option>
                          {SRI_LANKAN_DISTRICTS.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          className="mt-1 block w-full pl-3 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.postalCode}
                          onChange={(e) =>
                            setFormData({ ...formData, postalCode: e.target.value })
                          }
                          placeholder="10000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={16} className="text-gray-400" />
                        </div>
                        <input
                          type="password"
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Your Location
                    </label>
                    <MapSearch onSearch={handleLocationSearch} />
                    <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200 shadow-sm mt-2">
                      <MapContainer
                        center={location}
                        zoom={13}
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker
                          location={location}
                          setLocation={setLocation}
                        />
                      </MapContainer>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Click on the map or search to set your location
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-purple-600 hover:text-purple-500">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-500">Privacy Policy</a>
                    </label>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Create Account
                    </button>
                  </motion.div>
                </form>

                <div className="mt-6 text-center text-sm">
                  <p className="text-gray-500">
                    Already have an account?{' '}
                    <a href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}