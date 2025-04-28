"use client";
import React, { useState } from 'react'
import { RestaurantCard, Restaurant } from './RestaurantCard'
const restaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Pizza Paradise',
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.8,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.99',
    categories: ['Pizza', 'Italian'],
  },
  {
    id: 2,
    name: 'Burger Bliss',
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1899&q=80',
    rating: 4.5,
    deliveryTime: '20-30 min',
    deliveryFee: '$2.49',
    categories: ['Burgers', 'American'],
  },
  {
    id: 3,
    name: 'Sushi Supreme',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80',
    rating: 4.9,
    deliveryTime: '25-40 min',
    deliveryFee: '$3.99',
    categories: ['Sushi', 'Japanese'],
  },
  {
    id: 4,
    name: 'Taco Town',
    image:
      'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.6,
    deliveryTime: '15-30 min',
    deliveryFee: '$1.99',
    categories: ['Mexican', 'Tacos'],
  },
  {
    id: 5,
    name: 'Sweet Treats',
    image:
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80',
    rating: 4.7,
    deliveryTime: '20-35 min',
    deliveryFee: '$2.99',
    categories: ['Dessert', 'Bakery'],
  },
  {
    id: 6,
    name: 'Green Bowl',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: '$1.49',
    categories: ['Healthy', 'Salads'],
  },
  {
    id: 7,
    name: 'Pasta Palace',
    image:
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.4,
    deliveryTime: '25-40 min',
    deliveryFee: '$2.99',
    categories: ['Italian', 'Pasta'],
  },
  {
    id: 8,
    name: 'Breakfast Bar',
    image:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    rating: 4.7,
    deliveryTime: '15-30 min',
    deliveryFee: '$2.49',
    categories: ['Breakfast', 'American'],
  },
]

const filters = ['All', 'Fast delivery', 'Top rated', 'Price', 'Dietary']
function RestaurantList() {
  const [activeFilter, setActiveFilter] = useState('All')
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
  )
}

export default RestaurantList