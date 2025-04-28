import React from 'react'
import { SearchIcon } from 'lucide-react'
export function Hero() {
  return (
    <div className="relative bg-purple-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Food background"
          className="w-full h-full object-cover opacity-20"
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
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter delivery address"
              className="w-full py-4 px-4 pl-12 rounded-full text-gray-900 focus:outline-none bg-white focus:ring-2 focus:ring-purple-500"
            />
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-full transition-colors">
              Find Food
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
