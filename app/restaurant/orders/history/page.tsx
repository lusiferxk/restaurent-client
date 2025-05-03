"use client"

import React, { useState } from 'react'
import { Clock, MapPin, Phone, User, Search } from 'lucide-react'

// Sample data - replace with actual API call
const sampleHistory = [
  {
    id: 1,
    customerName: "John Doe",
    items: ["Burger", "Fries", "Coke"],
    total: 25.99,
    status: "Completed",
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
    status: "Completed",
    time: "20-30 min",
    address: "456 Oak Ave",
    phone: "555-0124",
    image: "/images/order-placeholder.jpg"
  },
  {
    id: 3,
    customerName: "Mike Johnson",
    items: ["Steak", "Mashed Potatoes", "Wine"],
    total: 45.99,
    status: "Completed",
    time: "25-40 min",
    address: "789 Pine Rd",
    phone: "555-0125",
    image: "/images/order-placeholder.jpg"
  }
]

const OrderHistory = () => {
  const [orders, setOrders] = useState(sampleHistory)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order History</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="rounded-xl overflow-hidden shadow bg-white">
            <div className="relative">
              <img src={order.image} alt="Order" className="w-full h-40 object-cover" />
              <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold px-3 py-1 rounded-full shadow">
                {order.time}
              </span>
              <span className="absolute bottom-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full shadow">
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OrderHistory 