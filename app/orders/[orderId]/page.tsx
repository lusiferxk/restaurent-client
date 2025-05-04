// app/orders/[orderId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  MapPin, 
  CreditCard, 
  Banknote,
  ArrowLeft,
  Printer,
  Share2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchFromService } from "@/utils/fetchFromService";
import { motion } from "framer-motion";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  restaurantName: string;
  restaurantId: string;
  status: string;
  paymentMethod: "CREDIT_CARD_ONLINE" | "CASH_ON_DELIVERY";
  paymentStatus: string;
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  subtotal: number;
  items: OrderItem[];
  createdAt: string;
  estimatedDeliveryTime?: string;
  deliveryAddress: string;
  deliveryUserName: string;
  deliveryUserPhoneNumber: string;
  specialNote?: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/orders/${orderId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrder(response);
      } catch (err) {
        toast.error("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }

    // Update current time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [orderId]);

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "PENDING":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "Order Received" };
      case "CONFIRMED":
        return { color: "bg-purple-100 text-purple-800", icon: CheckCircle, text: "Order Confirmed" };
      case "PREPARING":
        return { color: "bg-blue-100 text-blue-800", icon: Clock, text: "Preparing Your Food" };
      case "DELIVERING":
        return { color: "bg-blue-100 text-blue-800", icon: Truck, text: "On The Way" };
      case "COMPLETED":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Delivered" };
      case "CANCELLED":
        return { color: "bg-red-100 text-red-800", icon: Clock, text: "Cancelled" };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock, text: "Processing" };
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDeliveryTime = () => {
    if (!order?.estimatedDeliveryTime) return "Calculating...";
    const deliveryTime = new Date(order.estimatedDeliveryTime);
    const diff = deliveryTime.getTime() - currentTime.getTime();
    const minutes = Math.max(0, Math.floor(diff / 60000));
    
    if (minutes <= 0) return "Any moment now";
    if (minutes < 60) return `About ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `About ${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `My Order #${order?.orderNumber}`,
          text: `Check out my order from ${order?.restaurantName}`,
          url: window.location.href,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for</p>
          <button
            onClick={() => router.push("/orders")}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  const statusDetails = getStatusDetails(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Order Success Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your order #{order.orderNumber} has been confirmed
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8 print:shadow-none">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Print"
                >
                  <Printer className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            {/* Order Status */}
            <div className="flex items-center mb-6">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}>
                <statusDetails.icon className="h-4 w-4 mr-2" />
                {statusDetails.text}
              </div>
              <div className="ml-4 text-sm text-gray-500">
                {order.estimatedDeliveryTime ? (
                  <span>Estimated delivery: {calculateDeliveryTime()}</span>
                ) : (
                  <span>We'll notify you when your order is ready</span>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Your Items</h3>
              <ul className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="py-4 flex"
                  >
                    <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-400">
                          <span>No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.productName}</h3>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <p>Qty: {item.quantity}</p>
                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Delivery Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                    <div>
                      <p className="font-medium">{order.deliveryUserName}</p>
                      <p className="text-gray-600">{order.deliveryAddress}</p>
                      <p className="text-gray-600 mt-1">{order.deliveryUserPhoneNumber}</p>
                      {order.specialNote && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-500">Special Instructions:</p>
                          <p className="text-sm text-gray-600">{order.specialNote}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    {order.paymentMethod === "CREDIT_CARD_ONLINE" ? (
                      <>
                        <CreditCard className="h-5 w-5 text-purple-600 mr-3" />
                        <span>Paid with Credit Card</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="h-5 w-5 text-purple-600 mr-3" />
                        <span>Cash on Delivery</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span>${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 font-medium">
                      <span>Total</span>
                      <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Order Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-4">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-purple-600 border-4 border-white"></div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">Order Placed</p>
                      <p className="text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  {order.status === "COMPLETED" && order.estimatedDeliveryTime && (
                    <div className="relative pl-8">
                      <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-green-600 border-4 border-white"></div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">Delivered</p>
                        <p className="text-gray-500">{formatDate(order.estimatedDeliveryTime)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View All Orders
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Need help with your order?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about your order, please contact our customer support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Contact Support
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}