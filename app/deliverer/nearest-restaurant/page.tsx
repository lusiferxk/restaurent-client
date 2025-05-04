"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../adminres/DashboardLayout';
import { fetchFromService } from '@/utils/fetchFromService';
import { Search } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  city: string;
  verifiedByAdmin: boolean;
  image?: string;
}

export default function NearestRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [registeredRestaurants, setRegisteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [showRegistered, setShowRegistered] = useState(false);
  const [search, setSearch] = useState('');

  const fetchNearest = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const city = user.city || 'Gampaha';

    const nearest = await fetchFromService(
      'delivery',
      `/delivery/restaurants/city/colombo`,
      'GET'
    );
    setRestaurants(nearest);
  };

  const fetchRegisteredId = async () => {
    const res = await fetchFromService(
      'delivery',
      '/delivery/registered-restaurant',
      'GET'
    );
    if (res && typeof res.restaurantId === 'string') {
      setRegisteredId(res.restaurantId);
    }
  };

  const fetchRegisteredRestaurants = async () => {
    const res = await fetchFromService(
      'delivery',
      '/delivery/registered-restaurant',
      'GET'
    );

    if (res && typeof res.restaurantId === 'string') {
      const restaurant = await fetchFromService(
        'restaurant',
        `/restaurants/${res.restaurantId}`,
        'GET'
      );

      if (restaurant) {
        setRegisteredRestaurants([restaurant]); 
      }
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        await fetchNearest();
        await fetchRegisteredId();
      } catch (err: any) {
        setMessage(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleRegister = async (restaurantId: string) => {
    setRegistering(restaurantId);
    setMessage('');
    try {
      await fetchFromService(
        'delivery',
        '/delivery/register',
        'POST',
        { restaurantId }
      );
      await fetchRegisteredId();
      setMessage('Successfully registered!');
    } catch (err: any) {
      setMessage(err.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  const handleShowRegistered = async () => {
    setShowRegistered(true);
    setMessage('');
    try {
      setLoading(true);
      await fetchRegisteredRestaurants();
    } catch (err: any) {
      setMessage(err.message || 'Failed to fetch registered restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleShowNearest = () => {
    setShowRegistered(false);
    setMessage('');
  };

  // Add a fallback image for restaurants
  const fallbackImage = 'https://www.allrecipes.com/thmb/aefJMDXKqs42oAP71dQuYf_-Qdc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/6776_Pizza-Dough_ddmfs_4x3_1724-fd91f26e0bd6400a9e89c6866336532b.jpg';

  // Filter restaurants by search
  const filteredRestaurants = (showRegistered ? registeredRestaurants : restaurants).filter(
    r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex items-center mb-8 gap-4">
          <button
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${!showRegistered ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleShowNearest}
          >
            Nearest Restaurants
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-medium transition-colors ${showRegistered ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleShowRegistered}
          >
            All Registered Restaurants
          </button>
          <div className="relative flex-1 max-w-xs ml-70 ">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Restaurant..."
              className="pl-12 w-full bg-gray-100  rounded-xl px-6 py-2 font-medium text-purple-700 focus:ring-2 focus:ring-purple-500 transition border-1 border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : message && (
          <div className={`text-center py-4 ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        {!loading && (
          <>
            {showRegistered
              ? registeredRestaurants.length === 0 && (
                <div className="text-center py-8 text-gray-500">No restaurants found.</div>
              )
              : restaurants.length === 0 && (
                <div className="text-center py-8 text-gray-500">No restaurants found.</div>
              )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredRestaurants.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={r.image || fallbackImage}
                      alt={r.name}
                      className="w-full h-36 object-cover"
                    />
                    <span className={`absolute top-2 right-2 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full shadow ${r.verifiedByAdmin ? 'text-green-700' : 'text-yellow-700'}`}>
                      {r.verifiedByAdmin ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="p-3">
                    <div className="font-bold text-base mb-1 text-gray-800">{r.name}</div>
                    <div className="flex items-center text-gray-600 text-xs mb-1">
                      <span className="mr-2">{r.city}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                      <span>Status:</span>
                      <span className={`ml-1 font-semibold ${r.verifiedByAdmin ? 'text-green-600' : 'text-yellow-600'}`}>{r.verifiedByAdmin ? 'Verified' : 'Pending'}</span>
                    </div>
                    {!showRegistered && (
                      <button
                        className="mt-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors w-full disabled:opacity-50 text-xs"
                        disabled={registering === r.id || registeredId === r.id}
                        onClick={() => handleRegister(r.id)}
                      >
                        {registeredId === r.id
                          ? "Registered"
                          : registering === r.id
                            ? "Registering..."
                            : "Register as Delivery"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
