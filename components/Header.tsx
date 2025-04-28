'use client'
import React, { useState } from 'react'
import {
  MapPinIcon,
  ShoppingBagIcon,
  UserIcon,
  MenuIcon,
  SearchIcon,
  BellIcon,
} from 'lucide-react'
import NotificationModel from './ui/NotificationModel'
import { CartModal } from './CartModal'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { user, logout } = useAuth()


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link 
              href="/"
              className="text-2xl font-bold text-purple-600 mr-2">
              TasteBite
            </Link>
          </div>
          <div className="hidden md:flex items-center cursor-pointer hover:text-purple-600 transition-colors">
            <MapPinIcon size={18} className="mr-1" />
            <span className="font-medium">New York, NY</span>
          </div>
          <div className="hidden md:block relative flex-grow max-w-md mx-4">
            <input
              type="text"
              placeholder="Search for food, restaurants..."
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingBagIcon size={20} className="text-gray-700" />
            </button>
            <div
              className="p-2 hover:bg-gray-100 rounded-full relative transition-colors duration-200"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <NotificationModel/>
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
            <div className="relative mt-3">
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <SearchIcon
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
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
