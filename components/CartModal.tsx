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
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  restaurant: string;
  restaurantId: number;
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
    restaurantId: 9876,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
    ingredients: ["Tomatoes", "Mozzarella", "Basil", "Olive Oil"],
    preparationTime: "20-25 mins",
    calories: 850,
  },
  {
    id: 2,
    name: "California Roll",
    price: 12.99,
    quantity: 2,
    restaurant: "Sushi Supreme",
    restaurantId: 9876,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    description: "Crab meat, avocado and cucumber wrapped in sushi rice",
    ingredients: ["Crab", "Avocado", "Cucumber", "Rice", "Nori"],
    preparationTime: "15-20 mins",
    calories: 350,
  },
];

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "45 Queen's Road, Colombo",
    phoneNumber: "+94112223344",
    email: "sachini@example.com",
    deliveryUserName: "Sachini Dilrangi",
    deliveryUserPhoneNumber: "+94771234567",
    specialNote: "Please call when you arrive.",
  });
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 4.99;
  const discount = 5.0;
  const total = subtotal + deliveryFee - discount;

  const toggleItemExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare order data
      const orderData = {
        restaurantId: cartItems[0].restaurantId, // Assuming all items are from the same restaurant
        paymentMethod: "CASH_ON_DELIVERY",
        discount: discount,
        deliveryFee: deliveryFee,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        deliveryAddress: deliveryDetails.address,
        phoneNumber: deliveryDetails.phoneNumber,
        email: deliveryDetails.email,
        deliveryUserName: deliveryDetails.deliveryUserName,
        deliveryUserPhoneNumber: deliveryDetails.deliveryUserPhoneNumber,
        estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
        specialNote: deliveryDetails.specialNote,
        location: {
          address: deliveryDetails.address,
          latitude: 6.9271,
          longitude: 79.8612
        },
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          productPrice: item.price,
          quantity: item.quantity,
          discount: 0, // You can add item-level discount if needed
          notes: "" // You can add item notes if needed
        }))
      };

      // Make API call
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization header with JWT token will be handled automatically by Next.js if using built-in auth
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      
      // Show success message
      toast.success('Order placed successfully!');
      
      // Close cart and redirect to order confirmation page
      onClose();
      router.push(`/orders/${result.orderId}`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glass morphism backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XIcon size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <CheckCircle size={14} className="mr-1.5 text-green-500" />
                <span>{cartItems.length} items</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="flex p-4">
                    <div className="relative mr-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-500">{item.restaurant}</p>
                        </div>
                        <span className="font-bold text-purple-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            <MinusIcon size={14} />
                          </button>
                          <span className="font-medium text-sm">{item.quantity}</span>
                          <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                            <PlusIcon size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => toggleItemExpand(item.id)}
                          className="text-xs text-purple-600 font-medium flex items-center"
                        >
                          {expandedItem === item.id ? (
                            <>
                              <span>Less details</span>
                              <ChevronUp size={14} className="ml-1" />
                            </>
                          ) : (
                            <>
                              <span>More details</span>
                              <ChevronDown size={14} className="ml-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock size={14} className="mr-2 text-purple-500" />
                            <span>{item.preparationTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">🔥</span>
                            <span>{item.calories} cal</span>
                          </div>
                        </div>
                        
                        {item.ingredients && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.map((ingredient) => (
                                <span
                                  key={ingredient}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <button className="mt-3 flex items-center text-red-500 text-sm">
                          <TrashIcon size={14} className="mr-1" />
                          Remove item
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Delivery Information */}
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={deliveryDetails.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={deliveryDetails.phoneNumber}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={deliveryDetails.email}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-200 rounded text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Recipient Name</label>
                    <input
                      type="text"
                      name="deliveryUserName"
                      value={deliveryDetails.deliveryUserName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Recipient Phone</label>
                    <input
                      type="tel"
                      name="deliveryUserPhoneNumber"
                      value={deliveryDetails.deliveryUserPhoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Special Instructions</label>
                    <textarea
                      name="specialNote"
                      value={deliveryDetails.specialNote}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-100 p-5 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-green-500">-${discount.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-purple-600">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isSubmitting}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Checkout'}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Free delivery for orders over $20
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}