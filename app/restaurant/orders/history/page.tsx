"use client"

import React, { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, User, Package, DollarSign, MessageSquare } from 'lucide-react'
import DashboardLayout from '../../../adminres/DashboardLayout'
import { fetchFromService } from '@/utils/fetchFromService'

interface OrderItem {
  id: number;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  discount: number;
  notes: string;
  total: number;
}

interface Location {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface Order {
  id: number;
  restaurantId: string;
  userId: number;
  paymentMethod: string;
  orderTotal: number;
  discount: number;
  deliveryFee: number;
  finalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  deliveryAddress: string;
  phoneNumber: string;
  email: string;
  deliveryUserName: string;
  deliveryUserPhoneNumber: string;
  estimatedDeliveryTime: string;
  specialNote: string;
  deliveryId: string | null;
  location: Location;
  items: OrderItem[];
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) throw new Error("User not found in localStorage.");

        const restaurantResponse = await fetchFromService(
          'restaurant',
          `/restaurants/user/${user.id}`,
          'GET'
        );

        const verifiedRestaurant = restaurantResponse.find((r: any) => r.verifiedByAdmin);
        if (!verifiedRestaurant) throw new Error("No verified restaurant found for this user.");

        const restaurantId = verifiedRestaurant.id;
        const response = await fetchFromService(
          'order',
          `/api/orders/restaurant/${restaurantId}`,
          'GET'
        );

        // Filter for completed or cancelled orders
        const historyOrders = response.content.filter((order: Order) => 
          order.orderStatus === 'COMPLETED' || order.orderStatus === 'CANCELLED'
        );
        
        setOrders(historyOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">Order History</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow bg-white animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">
          <h1 className="text-3xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">Order History</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl overflow-hidden shadow bg-white">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-bold text-lg">Order #{order.id}</div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.orderStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.orderStatus}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{order.deliveryUserName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{order.deliveryUserPhoneNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Est. Delivery: {new Date(order.estimatedDeliveryTime).toLocaleString()}</span>
                  </div>
                  {order.specialNote && (
                    <div className="flex items-center text-gray-600">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      <span>{order.specialNote}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="font-semibold mb-2">Order Items:</div>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm mb-1">
                      <span>
                        {item.quantity}x {item.productName}
                        {item.notes && <span className="text-gray-500"> ({item.notes})</span>}
                      </span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Subtotal:</span>
                    <span>${order.orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Discount:</span>
                    <span>${order.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Delivery Fee:</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total:</span>
                    <span>${order.finalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderHistory; 