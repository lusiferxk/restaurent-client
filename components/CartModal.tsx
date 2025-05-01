"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  Clock,
  MapPin,
} from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  image: string;
  description: string;
  ingredients?: string[];
  preparationTime?: string;
  calories?: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 14.99,
    quantity: 1,
    restaurant: "Pizza Paradise",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Fresh tomatoes, mozzarella, basil, and olive oil on a perfectly crispy crust",
    ingredients: ["Tomatoes", "Mozzarella", "Basil", "Olive Oil", "Pizza Dough"],
    preparationTime: "20-25 mins",
    calories: 850,
  },
  {
    id: 2,
    name: "California Roll",
    price: 12.99,
    quantity: 2,
    restaurant: "Sushi Supreme",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Fresh crab meat, avocado and cucumber wrapped in seasoned rice and nori",
    ingredients: ["Crab Meat", "Avocado", "Cucumber", "Sushi Rice", "Nori"],
    preparationTime: "15-20 mins",
    calories: 350,
  },
];

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const [hoveredItem, setHoveredItem] = useState<CartItem | null>(null);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 4.99;
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (fixed to little bit transparent dark) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-50"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-300">
              <h2 className="text-2xl font-bold text-purple-700">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-purple-100 rounded-full transition-colors"
              >
                <XIcon size={24} className="text-purple-700" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="relative flex bg-gray-50 rounded-xl p-4 gap-4 shadow-sm transition-shadow hover:shadow-[0_4px_24px_0_rgba(168,85,247,0.25)]"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Checkbox at the start */}
                  <input type="checkbox" className="accent-purple-600 w-5 h-5 mt-1 mr-2" />
                  {/* Delete icon top right */}
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                    <TrashIcon size={18} />
                  </button>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-base text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="p-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                        <MinusIcon size={18} />
                      </button>
                      <span className="font-semibold text-base text-gray-800">{item.quantity}</span>
                      <button className="p-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors">
                        <PlusIcon size={18} />
                      </button>
                    </div>
                  </div>
                  {/* Price bottom right */}
                  <div className="absolute bottom-3 right-3 text-purple-700 font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-purple-300 p-6 space-y-4 bg-gray-50 rounded-b-xl">
              <div className="flex justify-between text-base font-medium">
                <span>Total:</span>
                <span className="text-purple-700 font-bold text-xl">${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 text-lg">
                Proceed to Checkout <span className="ml-2">→</span>
              </button>
            </div>
          </motion.div>

          {/* Hovered Item Details */}
          <AnimatePresence>
            {hoveredItem && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="fixed right-[420px] top-1/2 transform -translate-y-1/2 w-[300px] bg-white rounded-lg shadow-xl z-50 p-6"
              >
                <img
                  src={hoveredItem.image}
                  alt={hoveredItem.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{hoveredItem.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{hoveredItem.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{hoveredItem.preparationTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{hoveredItem.restaurant}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {hoveredItem.ingredients?.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Calories:</span>
                    <span className="font-medium">{hoveredItem.calories} kcal</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
