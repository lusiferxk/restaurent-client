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
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      setMessage('');
      try {
        const data = await fetchFromService(
          'delivery',
          '/delivery/restaurants/user',
          'GET'
        );
        setRestaurants(data);
      } catch (err: any) {
        setMessage(err.message || 'Error fetching restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
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
      setMessage('Successfully registered!');
    } catch (err: any) {
      setMessage(err.message || 'Registration failed');
    } finally {
      setRegistering(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Nearest Restaurants</h2>
        {loading ? (
          <div className="text-center py-8">Loading nearest restaurants...</div>
        ) : message ? (
          <div className="text-center py-4 text-red-600">{message}</div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No restaurants found.</div>
        ) : (
          <ul>
            {restaurants.map((r) => (
              <li key={r.id} className="mb-6 p-4 border rounded shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-lg">{r.name}</div>
                  <div className="text-gray-600">City: {r.city}</div>
                  <div className="text-sm mt-1">Status: <span className={r.verifiedByAdmin ? 'text-green-600' : 'text-yellow-600'}>{r.verifiedByAdmin ? 'Verified' : 'Pending'}</span></div>
                </div>
                <button
                  className="mt-4 sm:mt-0 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                  disabled={registering === r.id}
                  onClick={() => handleRegister(r.id)}
                >
                  {registering === r.id ? 'Registering...' : 'Register as Delivery'}
                </button>
              </li>
            ))}
          </ul>
        )}
        {message && !loading && (
          <div className="text-center mt-4 text-green-600">{message === 'Successfully registered!' ? message : null}</div>
        )}
      </div>
    </DashboardLayout>
  );
}