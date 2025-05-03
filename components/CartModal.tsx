"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  XIcon, CheckCircle, ArrowRight, TrashIcon,
  Clock, ChevronDown, ChevronUp, MinusIcon,
  PlusIcon
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchFromService } from "@/utils/fetchFromService";

interface CartItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  description?: string;
  restaurantId: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = 4.99;
  const discount = 5.0;
  const total = subtotal + deliveryFee - discount;

  const toggleItemExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) throw new Error("User not found");

        const [cartResponse, userResponse] = await Promise.all([
          fetchFromService("order", `/api/cart`, "GET"),
          fetchFromService("user", `/api/user`, "GET")
        ]);

        setCartItems(cartResponse.cartItems || []);
        setUser(userResponse);
      } catch (err) {
        toast.error("Failed to load cart or user data");
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  console.log(user);

  const fallBackImage = 'https://via.placeholder.com/100';

  const handleCheckout = async () => {
    setIsSubmitting(true);
    try {
      const orderPayload = {
        restaurantId: cartItems[0]?.restaurantId,
        paymentMethod: "CASH_ON_DELIVERY",
        discount,
        deliveryFee,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        deliveryAddress: user?.address || "Default Address",
        phoneNumber: user?.phoneNumber || "0000000000",
        email: user?.email,
        deliveryUserName: user?.username,
        deliveryUserPhoneNumber: user?.phoneNumber || "0000000000",
        estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        specialNote: "Please deliver soon.",
        location: {
          address: user?.address || "Colombo",
          latitude: 6.9271,
          longitude: 79.8612
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.price,
          quantity: item.quantity,
          discount: 0,
          notes: ""
        }))
      };

      const result = await fetchFromService(
        "order",
        "/orders",
        "POST",
        orderPayload
      );

      toast.success("Order placed successfully!");
      onClose();
      router.push(`/orders/${result.id}`);
    } catch (err) {
      toast.error("Checkout failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const updatedItems = cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      );
      
      await fetchFromService(
        "order",
        `/cart/${itemId}`,
        "PATCH",
        { quantity: newQuantity }
      );
      
      setCartItems(updatedItems);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await fetchFromService(
        "order",
        `cart/remove-item`,
        "DELETE"
      );
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <XIcon size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <CheckCircle size={14} className="mr-1.5 text-green-500" />
                <span>{cartItems.length} items</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="flex p-4">
                    <div className="relative mr-4">
                      <img
                        src={item.image || fallBackImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-xs text-gray-500">{item.restaurantId}</p>
                        </div>
                        <span className="font-bold text-purple-600">
                          Rs {(item.subtotal).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 bg-gray-100 text-gray-600 rounded"
                          >
                            <MinusIcon size={14} />
                          </button>
                          <span className="font-medium text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-100 text-gray-600 rounded"
                          >
                            <PlusIcon size={14} />
                          </button>
                        </div>
                        <button onClick={() => toggleItemExpand(item.id)} className="text-xs text-purple-600 font-medium flex items-center">
                          {expandedItem === item.id ? (
                            <>
                              Less details
                              <ChevronUp size={14} className="ml-1" />
                            </>
                          ) : (
                            <>
                              More details
                              <ChevronDown size={14} className="ml-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-sm text-gray-600 mb-2">{item.description || "No description available."}</p>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center text-red-500 text-sm"
                      >
                        <TrashIcon size={14} className="mr-1" />
                        Remove item
                      </button>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 p-5 bg-gray-50">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700"><span>Subtotal</span><span>Rs {subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-700"><span>Delivery</span><span>Rs {deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-700"><span>Discount</span><span className="text-green-500">-Rs {discount.toFixed(2)}</span></div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
                  <span>Total</span><span className="text-purple-600">Rs {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? "Processing..." : "Checkout"}
                {!isSubmitting && <ArrowRight size={16} />}
              </button>
              <p className="text-xs text-gray-500 mt-3 text-center">Free delivery for orders over Rs 2000</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
