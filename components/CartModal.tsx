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
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-semibold">Your Cart</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XIcon size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 mb-6 pb-6 border-b last:border-0"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.restaurant}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <MinusIcon size={20} />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                          <PlusIcon size={20} />
                        </button>
                      </div>
                      <button className="text-red-500 hover:text-red-600 transition-colors">
                        <TrashIcon size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-purple-600 text-white py-3 rounded-full font-medium hover:bg-purple-700 transform hover:scale-[1.02] transition-all">
                Checkout
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
