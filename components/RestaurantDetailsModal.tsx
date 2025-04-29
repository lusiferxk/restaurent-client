"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, StarIcon, ClockIcon } from 'lucide-react';
import type { Restaurant } from './RestaurantCard';
import { fetchMenuItems } from '@/utils/fetchMenuItems';

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
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchMenuItems(String(restaurant.id))
        .then((data) => setMenuItems(data))
        .catch((err) => {
          console.error('Failed to load menu items:', err);
          setMenuItems([]);
        })
        .finally(() => setLoading(false));
    }
  }, [restaurant.id, isOpen]);

  const dynamicCategories = ['All', ...Array.from(new Set(menuItems.map(i => i.category).filter(Boolean)))];

  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === activeCategory);

  const fallbackImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

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

            <div className="p-6">
              <h2 className="text-2xl font-bold">{restaurant.name}</h2>

              <div className="flex items-center mt-2 text-sm text-gray-600 flex-wrap">
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
                  {dynamicCategories.map((category) => (
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

              <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-400px)]">
                {loading ? (
                  <div className="text-center text-gray-500">Loading menu...</div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center text-gray-500">No items in this category.</div>
                ) : (
                  filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <img
                        src={item.image || fallbackImage}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        <p className="text-purple-600 font-medium mt-2">
                          Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
