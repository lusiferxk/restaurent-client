"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UtensilsIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface RestaurantFormData {
  name: string
  address: string
  city: string
  postal: string
}

export function RestaurantRegistration() {
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    address: '',
    city: '',
    postal: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const requestBody = {
        userId: 3,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        postal: formData.postal,
        isAvailable: true,
        verifiedByAdmin: false,
        menu: []
      };

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register restaurant');
      }

      // Update auth context with the new restaurant data
      login({
        id: 3,
        name: formData.name,
        email: '',
        contact: '',
        city: formData.city,
        address: formData.address,
        type: 'restaurant',
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error registering restaurant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to register restaurant. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="flex min-h-screen">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex lg:flex-1 bg-purple-700 text-white px-12 flex-col justify-center"
        >
          <div className="max-w-md mx-auto">
            <div className="text-4xl font-bold mb-4">tasteBite</div>
            <h2 className="text-3xl font-bold mb-6">Partner with Us</h2>
            <p className="text-lg text-purple-100">
              Join our platform and reach more customers. Grow your business
              with our delivery network and easy-to-use restaurant management
              system.
            </p>
            <div className="mt-8">
              <UtensilsIcon size={120} className="text-purple-200 opacity-50" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-md w-full">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-extrabold text-gray-900 text-center mb-8"
            >
              Register your Restaurant
            </motion.h2>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white shadow rounded-lg p-8"
            >
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    value={formData.postal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        postal: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isSubmitting ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                  >
                    {isSubmitting ? 'Registering...' : 'Register Restaurant'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default RestaurantRegistration;
