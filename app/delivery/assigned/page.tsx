"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  MapPin,
  Phone,
  User,
  Package,
  MessageSquare,
  Truck,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import DashboardLayout from "../../adminres/DashboardLayout"
import { motion } from "framer-motion"

interface OrderItem {
  id: number
  productId: string
  productName: string
  productPrice: number
  quantity: number
  discount: number
  notes: string
  total: number
}

interface Location {
  id: number
  address: string
  latitude: number
  longitude: number
}

interface Order {
  id: number
  restaurantId: string
  userId: number
  paymentMethod: string
  orderTotal: number
  discount: number
  deliveryFee: number
  finalPrice: number
  orderStatus: string
  paymentStatus: string
  deliveryAddress: string
  phoneNumber: string
  email: string
  deliveryUserName: string
  deliveryUserPhoneNumber: string
  estimatedDeliveryTime: string
  specialNote: string
  deliveryId: string | null
  location: Location
  items: OrderItem[]
}

const DELIVERY_STATUSES = ["PENDING", "PICKED_UP", "IN_TRANSIT", "DELIVERED"] as const

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "PICKED_UP":
      return "bg-blue-100 text-blue-800"
    case "IN_TRANSIT":
      return "bg-purple-100 text-purple-800"
    case "DELIVERED":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <AlertTriangle className="w-4 h-4 mr-1" />
    case "PICKED_UP":
      return <Package className="w-4 h-4 mr-1" />
    case "IN_TRANSIT":
      return <Truck className="w-4 h-4 mr-1" />
    case "DELIVERED":
      return <CheckCircle className="w-4 h-4 mr-1" />
    default:
      return null
  }
}

const AssignedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("user") || "{}")

        // Check if user is authenticated and has delivery person role
        if (!user?.id) {
          throw new Error("User not found in localStorage. Please log in.")
        }

        if (!user?.roles?.includes("ROLE_DELIVERY_PERSON")) {
          throw new Error("Access denied. Only delivery persons can view assigned orders.")
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
              longitude: 79.8612,
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
                total: 1200,
              },
              {
                id: 2,
                productId: "prod2",
                productName: "Coca Cola",
                productPrice: 300,
                quantity: 1,
                discount: 0,
                notes: "",
                total: 300,
              },
            ],
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
              longitude: 79.8612,
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
                total: 1600,
              },
              {
                id: 4,
                productId: "prod4",
                productName: "French Fries",
                productPrice: 500,
                quantity: 1,
                discount: 0,
                notes: "Extra salt",
                total: 500,
              },
              {
                id: 5,
                productId: "prod2",
                productName: "Coca Cola",
                productPrice: 300,
                quantity: 1,
                discount: 0,
                notes: "",
                total: 300,
              },
            ],
          },
        ]

        setOrders(dummyOrders)
        setFilteredOrders(dummyOrders)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders")
        console.error("Error fetching orders:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search term and status filter
    let result = [...orders]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.deliveryUserName.toLowerCase().includes(term) ||
          order.deliveryAddress.toLowerCase().includes(term),
      )
    }

    if (statusFilter) {
      result = result.filter((order) => order.orderStatus === statusFilter)
    }

    setFilteredOrders(result)
  }, [orders, searchTerm, statusFilter])

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingStatus(orderId)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, orderStatus: newStatus } : order)),
      )
    } catch (err) {
      console.error("Error updating delivery status:", err)
      alert(`Failed to update status: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter(null)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-purple-800 mb-6">My Assigned Orders</h1>
            <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
              <div className="animate-pulse flex space-x-4 mb-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-1/4"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="flex items-center">
                          <div className="h-4 w-4 bg-gray-200 rounded-full mr-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                      {[1, 2].map((j) => (
                        <div key={j} className="flex justify-between mb-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800 mb-4 md:mb-0">My Assigned Orders</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">
                {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white shadow-lg rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name, or address..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={statusFilter || ""}
                    onChange={(e) => setStatusFilter(e.target.value || null)}
                    className="pl-3 pr-10 py-2 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {DELIVERY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {(searchTerm || statusFilter) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h2>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any assigned orders yet"}
              </p>
              {(searchTerm || statusFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-bold text-lg text-gray-800">Order #{order.id}</div>
                      <div className="relative group">
                        <div
                          className={`flex items-center ${getStatusColor(order.orderStatus)} px-3 py-1 rounded-full text-sm font-medium`}
                        >
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus.replace(/_/g, " ")}
                        </div>

                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                          {DELIVERY_STATUSES.map((status) => (
                            <button
                              key={status}
                              onClick={() => handleStatusUpdate(order.id, status)}
                              disabled={updatingStatus === order.id || order.orderStatus === status}
                              className={`w-full text-left px-4 py-2 text-sm ${
                                order.orderStatus === status
                                  ? "bg-purple-100 text-purple-800 font-medium"
                                  : "hover:bg-gray-100"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {status.replace(/_/g, " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="font-medium">{order.deliveryUserName}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-purple-600" />
                        <span>{order.deliveryUserPhoneNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-purple-600" />
                        <span className="line-clamp-1">{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-purple-600" />
                        <span>
                          Est. Delivery:{" "}
                          {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {order.specialNote && (
                        <div className="flex items-start text-gray-600 bg-yellow-50 p-2 rounded-lg">
                          <MessageSquare className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{order.specialNote}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="font-semibold text-gray-800 mb-2">Order Items:</div>
                      <div className="max-h-32 overflow-y-auto pr-2 space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{item.quantity}x</span> {item.productName}
                              {item.notes && <div className="text-xs text-gray-500 mt-0.5">{item.notes}</div>}
                            </div>
                            <span className="text-gray-700 font-medium ml-2">Rs {item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-6 px-6 py-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>Rs {order.orderTotal.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Discount:</span>
                          <span className="text-green-600">-Rs {order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span>Rs {order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2 text-purple-800">
                        <span>Total:</span>
                        <span>Rs {order.finalPrice.toFixed(2)}</span>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span
                          className={`text-sm font-medium ${
                            order.paymentMethod === "CASH" ? "text-orange-600" : "text-green-600"
                          }`}
                        >
                          {order.paymentMethod === "CASH" ? "Collect Cash" : "Paid Online"}
                        </span>
                        <button
                          onClick={() => {
                            // This would open a dropdown with more actions
                            alert(`More actions for Order #${order.id}`)
                          }}
                          className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-full"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AssignedOrders
