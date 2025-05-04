"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UtensilsIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchFromService } from '@/utils/fetchFromService'

interface OwnerFormData {
  id: number
  username: string
  password: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
}

interface RestaurantFormData {
  name: string
  address: string
  city: string
  postal: string
  deliveryTime: number
}

export function RestaurantRegistration() {
  const [step, setStep] = useState<'owner' | 'restaurant'>('owner')
  const [ownerFormData, setOwnerFormData] = useState<OwnerFormData>({
    id: 0,
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  })
  const [restaurantFormData, setRestaurantFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    city: '',
    postal: '',
    deliveryTime: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { username, password, email, firstName, lastName, phoneNumber } = ownerFormData;

      // Register first
      const response = await fetchFromService('user', '/api/auth/signup/restaurantowner', 'POST', {
        username,
        password,
        email,
        firstName,
        lastName,
        phoneNumber,
      });

      setOwnerFormData(prev => ({ ...prev, id: response.id }));

      const loginResponse = await fetchFromService('user', '/api/auth/login', 'POST', {
        username,
        password
      });

      login({
        id: loginResponse.id,
        username: loginResponse.username,
        email: loginResponse.email,
        roles: loginResponse.roles
      }, loginResponse.token);

      setStep('restaurant');
    } catch (error) {
      console.error('Error registering owner:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestaurantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken')
      if (!token) {
        throw new Error('Authentication token not found. Please try logging in again.')
      }

      const requestBody = {
        name: restaurantFormData.name,
        userId: Number(ownerFormData.id),
        address: restaurantFormData.address,
        city: restaurantFormData.city,
        postal: restaurantFormData.postal,
        deliveryTime: restaurantFormData.deliveryTime,
        isAvailable: true,
        verifiedByAdmin: false,
        menu: []
      }

      const response = await fetchFromService('restaurant', '/restaurants/add', 'POST', requestBody)

      if (!response) {
        throw new Error('No response received from restaurant service')
      }

      router.push('/dashboard/dashboardres')
    } catch (error) {
      console.error('Error registering restaurant:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to register restaurant. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
    "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
    "Moneragala", "Ratnapura", "Kegalle"
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hidden lg:flex lg:flex-1 bg-purple-700 text-white px-8 flex-col justify-center">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <UtensilsIcon size={60} className="text-purple-200" />
            </div>
            <div className="text-3xl font-bold mb-3">tasteBite</div>
            <h2 className="text-2xl font-bold mb-4">Partner with Us</h2>
            <p className="text-base text-purple-100">Join our platform and reach more customers. Grow your business with our delivery network and easy-to-use restaurant management system.</p>
          </div>
        </motion.div>

        <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
          <div className="max-w-md w-full">
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-bold text-purple-900 text-center mb-6">
                  {step === 'owner' ? 'Register as Restaurant Owner' : 'Register your Restaurant'}
                </motion.h2>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-bold text-purple-900 text-center mb-6">
                  {step === 'owner' ? 'Register as Restaurant Owner' : 'Register your Restaurant'}
                </motion.h2> */}
                {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
                {step === 'owner' ? (
                  <form onSubmit={handleOwnerSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.username} onChange={(e) => setOwnerFormData({ ...ownerFormData, username: e.target.value })} placeholder="Username" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.password} onChange={(e) => setOwnerFormData({ ...ownerFormData, password: e.target.value })} placeholder="Password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.email} onChange={(e) => setOwnerFormData({ ...ownerFormData, email: e.target.value })} placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.firstName} onChange={(e) => setOwnerFormData({ ...ownerFormData, firstName: e.target.value })} placeholder="First Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.lastName} onChange={(e) => setOwnerFormData({ ...ownerFormData, lastName: e.target.value })} placeholder="Last Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={ownerFormData.phoneNumber} onChange={(e) => setOwnerFormData({ ...ownerFormData, phoneNumber: e.target.value })} placeholder="Phone Number" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className={`w-full py-2 rounded-lg font-semibold text-white mt-4 ${isSubmitting ? 'bg-purple-400' : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'}`}>
                      {isSubmitting ? 'Registering...' : 'Next: Register Restaurant'}
                    </button>
                    <div className="text-center mt-3 text-gray-500 text-sm">
                      Already have an account? <a href="/login" className="text-purple-600 font-semibold hover:underline">Sign in</a>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRestaurantSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={restaurantFormData.name} onChange={(e) => setRestaurantFormData({ ...restaurantFormData, name: e.target.value })} placeholder="Restaurant Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={restaurantFormData.address} onChange={(e) => setRestaurantFormData({ ...restaurantFormData, address: e.target.value })} placeholder="Address" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <select required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={restaurantFormData.city} onChange={(e) => setRestaurantFormData({ ...restaurantFormData, city: e.target.value })}>
                        <option value="">Select your district</option>
                        {DISTRICTS.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input type="text" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={restaurantFormData.postal} onChange={(e) => setRestaurantFormData({ ...restaurantFormData, postal: e.target.value })} placeholder="Postal Code" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (minutes)</label>
                      <input type="number" required className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500" value={restaurantFormData.deliveryTime} onChange={(e) => setRestaurantFormData({ ...restaurantFormData, deliveryTime: Number(e.target.value) })} placeholder="Delivery Time" />
                    </div>
                    <button type="submit" disabled={isSubmitting} className={`w-full py-2 rounded-lg font-semibold text-white mt-4 ${isSubmitting ? 'bg-purple-400' : 'bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600'}`}>
                      {isSubmitting ? 'Registering...' : 'Register Restaurant'}
                    </button>
                    <div className="text-center mt-3 text-gray-500 text-sm">
                      Already have an account? <a href="/login" className="text-purple-600 font-semibold hover:underline">Sign in</a>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default RestaurantRegistration;