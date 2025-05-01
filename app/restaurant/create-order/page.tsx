"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ClipboardListIcon, 
  TruckIcon, 
  CreditCardIcon, 
  UserIcon, 
  MapPinIcon, 
  PhoneIcon, 
  MailIcon, 
  ClockIcon, 
  AlertCircleIcon,
  EditIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronLeftIcon,
  PrinterIcon
} from 'lucide-react'

// Mock data for the order - in a real application, you would fetch this from an API
const orderData = {
  orderId: "ORD-2025042601",
  createdAt: "2025-04-26T18:30:00",
  restaurantId: 9876,
  paymentMethod: "CASH_ON_DELIVERY",
  discount: 5.0,
  deliveryFee: 3.5,
  orderStatus: "PENDING",
  paymentStatus: "PENDING",
  deliveryAddress: "45 Queen's Road, Colombo",
  phoneNumber: "‪+94112223344‬",
  email: "sachini@example.com",
  deliveryUserName: "Sachini Dilrangi",
  deliveryUserPhoneNumber: "‪+94771234567‬",
  estimatedDeliveryTime: "2025-04-26T20:00:00",
  specialNote: "Please call when you arrive.",
  location: {
    address: "45 Queen's Road, Colombo",
    latitude: 6.9271,
    longitude: 79.8612
  },
  items: [
    {
      productId: 3001,
      productName: "Veggie Pizza",
      productPrice: 15.99,
      quantity: 2,
      discount: 2.0,
      notes: "Extra cheese, no olives"
    },
    {
      productId: 3002,
      productName: "Mango Smoothie",
      productPrice: 5.5,
      quantity: 1,
      discount: 0.5,
      notes: "Less sugar"
    }
  ]
}

// Order status options for updating status
const orderStatusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "PREPARING", label: "Preparing", color: "bg-indigo-100 text-indigo-800" },
  { value: "READY_FOR_PICKUP", label: "Ready for Pickup", color: "bg-cyan-100 text-cyan-800" },
  { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "bg-orange-100 text-orange-800" },
  { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" }
]

// Payment status options for updating status
const paymentStatusOptions = [
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "PAID", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "REFUNDED", label: "Refunded", color: "bg-red-100 text-red-800" }
]

const OrderPage = () => {
  const [order, setOrder] = useState(orderData)
  const [isUpdating, setIsUpdating] = useState(false)
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(order.orderStatus)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(order.paymentStatus)

  // Calculate subtotal, discount, and total
  const subtotal = order.items.reduce((acc, item) => {
    return acc + (item.productPrice * item.quantity)
  }, 0)
  
  const itemsDiscount = order.items.reduce((acc, item) => {
    return acc + (item.discount || 0)
  }, 0)
  
  const totalDiscount = itemsDiscount + order.discount
  const total = subtotal - totalDiscount + order.deliveryFee

  // Function to handle order status update
  const handleUpdateStatus = () => {
    setIsUpdating(true)
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setOrder({
        ...order,
        orderStatus: selectedOrderStatus,
        paymentStatus: selectedPaymentStatus
      })
      setIsUpdating(false)
    }, 1000)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get the appropriate status badge
  const getStatusBadge = (status, options) => {
    const statusOption = options.find(option => option.value === status)
    return statusOption ? (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusOption.color}`}>
        {statusOption.label}
      </span>
    ) : null
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back button and page title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Link 
            href="/restaurant/orders/active"
            className="flex items-center text-purple-600 hover:text-purple-800"
          >
            <ChevronLeftIcon size={20} />
            <span className="ml-1">Back to Orders</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={() => window.print()}
          >
            <PrinterIcon size={18} className="mr-2" />
            Print Order
          </button>
        </div>
      </div>

      {/* Order header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Order #{order.orderId}</h1>
            <p className="text-gray-500">Created on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <div className="flex flex-col items-start sm:items-end">
              <p className="text-sm text-gray-500 mb-1">Order Status</p>
              {getStatusBadge(order.orderStatus, orderStatusOptions)}
            </div>
            <div className="flex flex-col items-start sm:items-end">
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              {getStatusBadge(order.paymentStatus, paymentStatusOptions)}
            </div>
          </div>
        </div>

        {/* Order status update form */}
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-6">
          <h3 className="font-medium text-gray-700 mb-3">Update Order Status</h3>
          <div className="flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm text-gray-600 mb-1">Order Status</label>
              <select 
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white"
                value={selectedOrderStatus}
                onChange={(e) => setSelectedOrderStatus(e.target.value)}
                disabled={isUpdating}
              >
                {orderStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto">
              <label className="block text-sm text-gray-600 mb-1">Payment Status</label>
              <select 
                className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white"
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                disabled={isUpdating}
              >
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-auto flex items-end">
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300"
                onClick={handleUpdateStatus}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <ClipboardListIcon size={20} className="mr-2 text-purple-600" />
                Order Items
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Item</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Price</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Qty</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Discount</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index} className={index < order.items.length - 1 ? "border-b border-gray-100" : ""}>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{item.productName}</p>
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">${item.productPrice.toFixed(2)}</td>
                      <td className="py-4 px-4 text-right">{item.quantity}</td>
                      <td className="py-4 px-4 text-right">
                        {item.discount > 0 ? `-$${item.discount.toFixed(2)}` : '-'}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        ${((item.productPrice * item.quantity) - (item.discount || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200">
                    <td colSpan="4" className="py-3 px-4 text-right text-sm font-medium text-gray-500">Subtotal</td>
                    <td className="py-3 px-4 text-right font-medium">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-right text-sm font-medium text-gray-500">Item Discounts</td>
                    <td className="py-3 px-4 text-right font-medium text-red-600">-${itemsDiscount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-right text-sm font-medium text-gray-500">Order Discount</td>
                    <td className="py-3 px-4 text-right font-medium text-red-600">-${order.discount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-right text-sm font-medium text-gray-500">Delivery Fee</td>
                    <td className="py-3 px-4 text-right font-medium">${order.deliveryFee.toFixed(2)}</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td colSpan="4" className="py-3 px-4 text-right font-medium text-gray-800">Total</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Customer Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <UserIcon size={20} className="mr-2 text-purple-600" />
              Customer Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MailIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{order.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CreditCardIcon size={20} className="mr-2 text-purple-600" />
              Payment Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="text-gray-800">{order.paymentMethod.replace(/_/g, ' ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TruckIcon size={20} className="mr-2 text-purple-600" />
              Delivery Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <UserIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="text-gray-800">{order.deliveryUserName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-800">{order.deliveryUserPhoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon size={18} className="text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-gray-800">{formatDate(order.estimatedDeliveryTime)}</p>
                </div>
              </div>
              {order.specialNote && (
                <div className="flex items-start pt-2 border-t border-gray-100">
                  <AlertCircleIcon size={18} className="text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Special Note</p>
                    <p className="text-gray-800">{order.specialNote}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <MapPinIcon size={20} className="mr-2 text-purple-600" />
              Delivery Location
            </h2>
            <div className="bg-gray-200 w-full h-40 rounded-md flex items-center justify-center">
              <p className="text-gray-500 text-sm">Map view would appear here</p>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              <p>Latitude: {order.location.latitude}</p>
              <p>Longitude: {order.location.longitude}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPage