"use client";

import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

export function Hero() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])

  // Sample food items data
  const foodItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$12.90',
      image: '/api/placeholder/120/160'
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$14.90',
      image: '/api/placeholder/120/160'
    },
    {
      id: 3,
      name: 'Beef Burger',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$10.90',
      image: '/api/placeholder/120/160'
    },
    {
      id: 4,
      name: 'Caesar Salad',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$8.90',
      image: '/api/placeholder/120/160'
    }
  ]

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    if (value.trim() === '') {
      setShowResults(false)
    } else {
      setShowResults(true)
      // Filter items based on search term
      const filtered = foodItems.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredItems(filtered)
    }
  }

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative bg-purple-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Food background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Delicious food, delivered to your door
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/80">
            Order from your favorite restaurants with just a few taps
          </p>
          <div className="relative max-w-md mx-auto search-container">
            <input
              type="text"
              placeholder="Search for food"
              className="w-full py-4 px-4 pl-12 rounded-full text-gray-900 focus:outline-none bg-white focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center p-4">
                        <div className="w-20 h-20 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-grow text-left">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                          <p className="font-bold text-gray-900 mt-1">Price: {item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No items found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}