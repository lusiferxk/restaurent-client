"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../adminres/DashboardLayout';
import { fetchFromService } from '@/utils/fetchFromService';

interface Restaurant {
  id: string;
  name: string;
  city: string;
  verifiedByAdmin: boolean;
}

export default function NearestRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [registeredRestaurants, setRegisteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [registeredId, setRegisteredId] = useState<string | null>(null);
  const [showRegistered, setShowRegistered] = useState(false);

  const fetchNearest = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const city = user.city || 'Gampaha';

    const nearest = await fetchFromService(
      'delivery',
      `/delivery/restaurants/city/Gampaha`,
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
    const data = await fetchFromService(
      'delivery',
      '/delivery/registered-restaurants',
      'GET'
    );
    setRegisteredRestaurants(data);
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

  console.log(registeredId);

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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="flex justify-center mb-6 space-x-4">
          <button
            className={`px-4 py-2 rounded ${!showRegistered ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleShowNearest}
          >
            Nearest Restaurants
          </button>
          <button
            className={`px-4 py-2 rounded ${showRegistered ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleShowRegistered}
          >
            All Registered Restaurants
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {showRegistered ? 'All Registered Restaurants' : 'Nearest Restaurants'}
        </h2>

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

            <ul>
              {(showRegistered ? registeredRestaurants : restaurants).map((r) => (
                <li key={r.id} className="mb-6 p-4 border rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-lg">{r.name}</div>
                    <div className="text-gray-600">City: {r.city}</div>
                    <div className="text-sm mt-1">
                      Status:{" "}
                      <span className={r.verifiedByAdmin ? "text-green-600" : "text-yellow-600"}>
                        {r.verifiedByAdmin ? "Verified" : "Pending"}
                      </span>
                    </div>
                  </div>
                  {!showRegistered && (
                    <button
                      className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
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
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
