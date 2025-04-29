"use client"
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  GlobeIcon,
  ChevronLeftIcon,
  ThumbsUpIcon,
} from 'lucide-react'
import Link from 'next/link'
import { restaurants } from '@/components/RestaurantList'
import { motion } from 'framer-motion'
const menuItems = [
  {
    id: 1,
    name: 'Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    description: 'Classic pepperoni with mozzarella and tomato sauce',
    price: 16.99,
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    category: 'Pizza',
  },
  {
    id: 3,
    name: 'Caesar Salad',
    description: 'Romaine lettuce, croutons, parmesan, and caesar dressing',
    price: 8.99,
    image:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    category: 'Salads',
  },
]
const categories = ['All', 'Pizza', 'Salads', 'Drinks', 'Desserts']
const reviews = [
  {
    id: 1,
    author: 'Sarah M.',
    rating: 5,
    date: '2 days ago',
    content:
      'Amazing food and quick delivery! The Margherita pizza was absolutely perfect.',
    likes: 12,
    isVerified: true,
  },
  {
    id: 2,
    author: 'John D.',
    rating: 4,
    date: '1 week ago',
    content:
      'Great food but delivery took a bit longer than expected. Still worth the wait!',
    likes: 8,
    isVerified: true,
  },
  // Add more reviews as needed
]
const popularDishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    orders: 2504,
    rating: 4.8,
    image:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    orders: 2100,
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  // Add more popular dishes as needed
]
export default function RestaurantDetailsPage({ params }: { params: { id: string } }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTab, setActiveTab] = useState('menu')
  const restaurant = restaurants.find((r) => r.id === Number(params.id))
  if (!restaurant) {
    return (
      <div className="container mx-auto px-4 py-8">Restaurant not found</div>
    )
  }
  return (
    <div className="bg-white min-h-screen">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-20 left-4 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
      >
        <ChevronLeftIcon size={24} />
      </Link>
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
              <div className="flex items-center">
                <StarIcon
                  size={20}
                  className="text-yellow-500 mr-1"
                  fill="currentColor"
                />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon size={20} className="mr-1" />
                <span>{restaurant.deliveryTime}</span>
              </div>
              <span>{restaurant.deliveryFee} delivery</span>
              <div className="flex items-center">
                <MapPinIcon size={20} className="mr-1" />
                <span>1.2 miles away</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Restaurant Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Hours</h3>
              <div className="text-sm text-gray-600">
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 12:00 PM - 11:00 PM</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <PhoneIcon size={16} className="mr-2" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <GlobeIcon size={16} className="mr-2" />
                  <span>www.restaurant.com</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cuisine</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Popular Dishes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Popular Dishes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium">{dish.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                    <span>{dish.orders} orders</span>
                    <div className="flex items-center">
                      <StarIcon
                        size={16}
                        className="text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Tabs */}
        <div className="border-b mb-8">
          <div className="flex space-x-8">
            <button
              className={`pb-4 px-2 ${activeTab === 'menu' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('menu')}
            >
              Menu
            </button>
            <button
              className={`pb-4 px-2 ${activeTab === 'reviews' ? 'border-b-2 border-purple-600 text-purple-600 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>
        </div>
        {activeTab === 'menu' ? (
          <>
            {/* Categories */}
            <div className="mb-8">
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            {/* Menu Items */}
            <div className="max-w-6xl mx-auto mt-8 pb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(80,0,120,0.10)' }}
                    className="bg-white rounded-xl shadow-md flex flex-col h-full hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-32 object-cover rounded-t-xl"
                    />
                    <div className="flex-1 flex flex-col p-4">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 flex-1">{item.description}</p>
                      <p className="text-purple-600 font-bold text-base mt-auto">${item.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </> /* Reviews Section */
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{review.author}</span>
                      {review.isVerified && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                          Verified Order
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }
                          fill="currentColor"
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">
                        {review.date}
                      </span>
                    </div>
                  </div>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-600">
                    <ThumbsUpIcon size={16} />
                    <span className="text-sm">{review.likes}</span>
                  </button>
                </div>
                <p className="text-gray-600">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
