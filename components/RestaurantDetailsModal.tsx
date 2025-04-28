import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XIcon, StarIcon, ClockIcon } from 'lucide-react'
import type { Restaurant } from './RestaurantCard'
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}
interface RestaurantDetailsModalProps {
  restaurant: Restaurant
  isOpen: boolean
  onClose: () => void
}
const menuItems: MenuItem[] = [
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
export function RestaurantDetailsModal({
  restaurant,
  isOpen,
  onClose,
}: RestaurantDetailsModalProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 50,
            }}
            className="fixed inset-x-0 bottom-0 z-50 h-[90vh] max-w-3xl mx-auto bg-white rounded-t-3xl overflow-hidden"
          >
            {/* Header Image */}
            <div className="relative h-48">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <XIcon size={24} />
              </button>
            </div>
            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <StarIcon
                    size={16}
                    className="text-yellow-500 mr-1"
                    fill="currentColor"
                  />
                  <span className="font-medium">{restaurant.rating}</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <ClockIcon size={16} className="mr-1" />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <span className="mx-2">•</span>
                <span>{restaurant.deliveryFee} delivery</span>
              </div>
              {/* Categories */}
              <div className="mt-6 mb-8">
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
              <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-400px)]">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <p className="text-purple-600 font-medium mt-2">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
