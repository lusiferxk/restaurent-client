'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { UserIcon, Lock, Mail, ChefHat, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock login - replace with actual API call
    login({
      id: 1,
      name: 'John Doe',
      email,
      contact: '',
      city: 'New York',
      address: '',
      type: 'user',
    })

    router.push('/')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100"
    >
      <div className="flex min-h-screen">
        {/* Left Side - Visual Branding */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-12 flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-40 right-30 w-60 h-60 rounded-full bg-white"></div>
            <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-white"></div>
          </div>
          
          <div className="relative z-10 max-w-md mx-auto">
            <div className="flex items-center mb-8">
              <Utensils size={32} className="mr-2" />
              <div className="text-4xl font-bold">TasteBite</div>
            </div>
            <h2 className="text-3xl font-bold mb-6">Welcome back!</h2>
            <p className="text-lg text-purple-100 mb-8">
              Sign in to order delicious food from your favorite restaurants or
              manage your restaurant dashboard.
            </p>
            
            {/* <div className="flex space-x-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm"
              >
                <ChefHat size={24} />
                <p className="mt-2 text-sm">Restaurant Owner</p>
              </motion.div>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-sm"
              >
                <UserIcon size={24} />
                <p className="mt-2 text-sm">Food Lover</p>
              </motion.div>
            </div> */}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-md w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 rounded-full bg-white shadow-lg">
                  <UserIcon size={32} className="text-purple-600" />
                </div>
              </div>
              
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Welcome Back!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to continue your culinary journey
              </p>

              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          required
                          className="mt-1 block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Sign in
                      </motion.button>
                    </div>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <motion.div whileHover={{ y: -2 }}>
                        <Link
                          href="/register/user"
                          className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <UserIcon size={16} className="mr-2" />
                          User
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ y: -2 }}>
                        <Link
                          href="/register/restaurant"
                          className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <ChefHat size={16} className="mr-2" />
                          Restaurant
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}