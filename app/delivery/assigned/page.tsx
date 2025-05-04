"use client"

import React, { useState, useEffect } from 'react'
import { Clock, MapPin, Phone, User, Package, DollarSign, MessageSquare, Truck } from 'lucide-react'
import DashboardLayout from '../../adminres/DashboardLayout'
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

const DELIVERY_STATUSES = [
  'PENDING',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED'
] as const;

const AssignedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Check if user is authenticated and has delivery person role
        if (!user?.id) {
          throw new Error("User not found in localStorage. Please log in.");
        }
        
        if (!user?.roles?.includes("ROLE_DELIVERY_PERSON")) {
          throw new Error("Access denied. Only delivery persons can view assigned orders.");
        }

        // Dummy order data for testing
        const dummyOrders: Order[] = [
          {
            id: 1,
            restaurantId: "rest1",
            userId: 101,
            paymentMethod: "CASH",
            orderTotal: 1500,
            discount: 100,
            deliveryFee: 200,
            finalPrice: 1600,
            orderStatus: "PENDING",
            paymentStatus: "PAID",
            deliveryAddress: "123 Main St, City",
            phoneNumber: "0771234567",
            email: "customer@example.com",
            deliveryUserName: "John Doe",
            deliveryUserPhoneNumber: "0777654321",
            estimatedDeliveryTime: "2024-03-20T15:30:00",
            specialNote: "Please call before delivery",
            deliveryId: "22",
            location: {
              id: 1,
              address: "123 Main St, City",
              latitude: 6.9271,
              longitude: 79.8612
            },
            items: [
              {
                id: 1,
                productId: "prod1",
                productName: "Chicken Pizza",
                productPrice: 1200,
                quantity: 1,
                discount: 0,
                notes: "Extra cheese",
                total: 1200
              },
              {
                id: 2,
                productId: "prod2",
                productName: "Coca Cola",
                productPrice: 300,
                quantity: 1,
                discount: 0,
                notes: "",
                total: 300
              }
            ]
          },
          {
            id: 2,
            restaurantId: "rest1",
            userId: 102,
            paymentMethod: "CARD",
            orderTotal: 2500,
            discount: 200,
            deliveryFee: 200,
            finalPrice: 2500,
            orderStatus: "PICKED_UP",
            paymentStatus: "PAID",
            deliveryAddress: "456 Oak Ave, Town",
            phoneNumber: "0772345678",
            email: "customer2@example.com",
            deliveryUserName: "Jane Smith",
            deliveryUserPhoneNumber: "0778765432",
            estimatedDeliveryTime: "2024-03-20T16:00:00",
            specialNote: "Leave at front door",
            deliveryId: "22",
            location: {
              id: 2,
              address: "456 Oak Ave, Town",
              latitude: 6.9271,
              longitude: 79.8612
            },
            items: [
              {
                id: 3,
                productId: "prod3",
                productName: "Beef Burger",
                productPrice: 800,
                quantity: 2,
                discount: 0,
                notes: "No onions",
                total: 1600
              },
              {
                id: 4,
                productId: "prod4",
                productName: "French Fries",
                productPrice: 500,
                quantity: 1,
                discount: 0,
                notes: "Extra salt",
                total: 500
              },
              {
                id: 5,
                productId: "prod2",
                productName: "Coca Cola",
                productPrice: 300,
                quantity: 1,
                discount: 0,
                notes: "",
                total: 300
              }
            ]
          }
        ];

        setOrders(dummyOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId
            ? { ...order, orderStatus: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error('Error updating delivery status:', err);
      alert(`Failed to update status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">My Assigned Orders</h1>
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
        <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">My Assigned Orders</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl overflow-hidden shadow bg-white">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="font-bold text-lg">Order #{order.id}</div>
                  <div className="flex gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingStatus === order.id}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium disabled:opacity-50"
                    >
                      {DELIVERY_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
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

export default AssignedOrders; 