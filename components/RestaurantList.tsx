"use client";
import React, { useEffect, useState } from 'react';
import { RestaurantCard, Restaurant } from './RestaurantCard';
import { fetchFromService } from '@/utils/fetchFromService';

const filters = ['All', 'Fast delivery', 'Top rated', 'Price', 'Dietary'];

function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function loadRestaurants() {
      try {
        const data = await fetchFromService('restaurant', '/restaurants', 'GET');
  
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.image || '',
          rating: item.rating || 0,
          deliveryTime: item.deliveryTime || '30-40 min',
          deliveryFee: item.deliveryFee || '$0',
          categories: item.categories || [],
        }));
  
        setRestaurants(formatted);
      } catch (err: any) {
        setError(err.message || 'Failed to load restaurants.');
      } finally {
        setLoading(false);
      }
    }
  
    loadRestaurants();
  }, []);  

  if (loading) {
    return <div className="p-10 text-center">Loading restaurants...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Popular restaurants near you
        </h2>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-2 mb-6">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${activeFilter === filter ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300 hover:border-purple-600'}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Restaurant grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RestaurantList;
