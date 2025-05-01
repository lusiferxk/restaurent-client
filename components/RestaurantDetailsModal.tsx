"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, StarIcon, ClockIcon } from 'lucide-react';
import type { Restaurant } from './RestaurantCard';
import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category?: string;
  image?: string;
}

interface RestaurantDetailsModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export function RestaurantDetailsModal({
  restaurant,
  isOpen,
  onClose,
}: RestaurantDetailsModalProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const router = useRouter();
  const fallbackImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

  const menuItems: MenuItem[] = restaurant.menu || [];

  const dynamicCategories = useMemo(() => {
    return ['All', ...Array.from(new Set(menuItems.map(i => i.category).filter(Boolean)))];
  }, [menuItems]);

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const handleExpand = () => {
    onClose();
    router.push(`/restaurant/${restaurant.id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-0 bottom-0 z-50 h-[90vh] max-w-3xl mx-auto bg-white rounded-t-3xl overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={restaurant.image || fallbackImage}
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
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">{restaurant.name}</h2>
                <button
                  onClick={handleExpand}
                  className="text-purple-600 hover:underline text-base font-medium"
                >
                  View full page
                </button>
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <StarIcon size={16} className="text-yellow-500 mr-1" fill="currentColor" />
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

              <div className="mt-6 mb-8">
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {dynamicCategories.map(category => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                        activeCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(category || 'All')}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-auto max-h-[calc(90vh-400px)]">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07 }}
                    whileHover={{ scale: 1.04, boxShadow: '0 4px 24px rgba(80,0,120,0.10)' }}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    <img
                      src={item.image || fallbackImage}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover mb-3 shadow"
                    />
                    <h3 className="font-semibold text-center mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-600 text-center mb-2">{item.description}</p>
                    <p className="text-purple-600 font-bold text-base">${item.price.toFixed(2)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default RestaurantDetailsModal;
