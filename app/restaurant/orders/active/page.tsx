"use client"

import React, { useState } from 'react'
import { Clock, MapPin, Phone, User } from 'lucide-react'
import DashboardLayout from '../../../adminres/DashboardLayout';


// Sample data - replace with actual API call
const sampleOrders = [
  {
    id: 1,
    customerName: "John Doe",
    items: ["Burger", "Fries", "Coke"],
    total: 25.99,
    status: "Preparing",
    time: "15-25 min",
    address: "123 Main St",
    phone: "555-0123",
    image: "/images/order-placeholder.jpg"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    items: ["Pizza", "Salad"],
    total: 32.50,
    status: "Ready for Pickup",
    time: "20-30 min",
    address: "456 Oak Ave",
    phone: "555-0124",
    image: "/images/order-placeholder.jpg"
  }
]

const ActiveOrders = () => {
  const [orders, setOrders] = useState(sampleOrders)

  return (
    <DashboardLayout>
    <div className="p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-10 text-center">Active Orders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl overflow-hidden shadow bg-white">
            <div className="relative">
              <img src={order.image} alt="Order" className="w-full h-40 object-cover" />
              <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {order.time}
              </span>
              <span className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {order.status}
              </span>
            </div>
            <div className="p-4">
              <div className="font-bold text-lg mb-1">Order #{order.id}</div>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <User className="w-4 h-4 mr-1" /> {order.customerName}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <MapPin className="w-4 h-4 mr-1" /> {order.address}
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Phone className="w-4 h-4 mr-1" /> {order.phone}
              </div>
              <div className="text-gray-500 text-sm mb-2">Items: {order.items.join(", ")}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-semibold">${order.total}</span>
                <button className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-xs">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </DashboardLayout>
  )
}

export default ActiveOrders 