'use client'
import React, { useState, useEffect } from 'react'
import {
  MapPinIcon,
  ShoppingCart,
  UserIcon,
  MenuIcon,
  Search,
  ChefHat,
} from 'lucide-react'
import NotificationModel from './ui/NotificationModel'
import { CartModal } from './CartModal'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [filteredItems, setFilteredItems] = useState([])
  const { user, logout } = useAuth()
  const storedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  // Sample food items data
  const foodItems = [
    {
      id: 1,
      name: 'Pizza Margherita',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$12.90',
      image: '/api/placeholder/60/60'
    },
    {
      id: 2,
      name: 'Pasta Carbonara',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$14.90',
      image: '/api/placeholder/60/60'
    },
    {
      id: 3,
      name: 'Beef Burger',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$10.90',
      image: '/api/placeholder/60/60'
    },
    {
      id: 4,
      name: 'Caesar Salad',
      description: 'Please note that the actual appearance may vary slightly from the photograph.',
      price: '$8.90',
      image: '/api/placeholder/60/60'
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/images/logo.png" alt="Logo" width={130} height={80} className="ml-5" />
            </Link>
          </div>
          <div className="hidden md:flex items-center cursor-pointer hover:text-purple-600 transition-colors">
            <MapPinIcon size={18} className="mr-1" />
            <span className="font-medium">New York, NY</span>
          </div>
          
          {/* Desktop Search Container */}
          <div className="hidden md:block relative flex-grow max-w-md mx-4 search-container">
            <input
              type="text"
              placeholder="Search for food, restaurants..."
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            
            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center p-3">
                        <div className="w-12 h-12 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="ml-3 flex-grow">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600">{item.description}</p>
                          <p className="font-bold text-gray-900 text-xs mt-1">Price: {item.price}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">No items found</div>
                )}
              </div>
            )}
          </div>
          
          {user?.roles?.includes("ROLE_RESTAURANT_OWNER") && (
            <Link
              href="/dashboard/dashboardres"
              className="hidden md:flex items-center px-2 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 mr-2"
            >
              <ChefHat size={18} className="mr-0" />
            </Link>
          )}
          <Link
            href="/deliverer/dashboard-deliverer"
            className="hidden md:flex items-center px-2 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-200 transform hover:scale-105 mr-2"
          >
            <ChefHat size={18} className="mr-0" />
          </Link>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCart size={20} className="text-gray-700" />
            </button>
            <div
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors duration-200"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <NotificationModel />
            </div>
            <div className='hidden md:flex items-center text-sm'>
              {storedUser?.username}
            </div>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => logout()}
                  className="hidden md:flex items-center ml-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  <UserIcon size={18} className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center ml-4 px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                <UserIcon size={18} className="mr-2" />
                <span>Sign In</span>
              </Link>
            )}
            <button
              className="md:hidden p-2 ml-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <MenuIcon size={20} />
            </button>
          </div>
        </div>

        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        {isMenuOpen && (
          <div className="mt-4 md:hidden bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center py-3 border-b">
              <MapPinIcon size={18} className="mr-2" />
              <span className="font-medium">New York, NY</span>
            </div>
            
            {/* Mobile Search Container */}
            <div className="relative mt-3 search-container">
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              
              {/* Mobile Search Results Dropdown */}
              {showResults && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-lg overflow-hidden z-20">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center p-3">
                          <div className="w-12 h-12 flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                          <div className="ml-3 flex-grow">
                            <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-600">{item.description}</p>
                            <p className="font-bold text-gray-900 text-xs mt-1">Price: {item.price}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500 text-sm">No items found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-3 py-3 border-t">
              <button className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                <UserIcon size={18} className="mr-2" />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}