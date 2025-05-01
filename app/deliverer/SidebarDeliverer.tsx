"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  BikeIcon, ClipboardListIcon, MapPinIcon, UserIcon, BarChartIcon, SettingsIcon, 
  MessageSquareIcon, DollarSignIcon, StarIcon, LogOutIcon, BellIcon,
  CheckCircleIcon, XCircleIcon, ClockIcon, NavigationIcon
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'

function DeliverySidebar() {
  const [activeOrders, setActiveOrders] = useState(3) // Example count for notification badge
  
  const menuItems = [
    {
      title: 'My Deliveries',
      icon: <BikeIcon size={20} />,
      submenu: [
        {
          name: 'Active Orders',
          icon: <ClockIcon size={18} />,
          path: '/delivery/active-orders',
          badge: activeOrders
        },
        {
          name: 'Available Orders',
          icon: <BellIcon size={18} />,
          path: '/delivery/available-orders',
        },
        {
          name: 'Completed Orders',
          icon: <CheckCircleIcon size={18} />,
          path: '/delivery/completed-orders',
        },
        {
          name: 'Rejected Orders',
          icon: <XCircleIcon size={18} />,
          path: '/delivery/rejected-orders',
        },
      ],
    },
    {
      title: 'Navigation',
      icon: <NavigationIcon size={20} />,
      path: '/delivery/navigation',
    },
    {
      title: 'Delivery Zones',
      icon: <MapPinIcon size={20} />,
      path: '/delivery/zones',
    },
    {
      title: 'Schedule',
      icon: <ClipboardListIcon size={20} />,
      path: '/delivery/schedule',
    },
    {
      title: 'Earnings',
      icon: <DollarSignIcon size={20} />,
      submenu: [
        {
          name: 'Earnings History',
          path: '/delivery/earnings/history',
        },
        {
          name: 'Payment Settings',
          path: '/delivery/earnings/payment-settings',
        },
      ],
    },
    {
      title: 'Performance',
      icon: <BarChartIcon size={20} />,
      path: '/delivery/performance',
    },
    {
      title: 'Ratings & Reviews',
      icon: <StarIcon size={20} />,
      path: '/delivery/reviews',
    },
    {
      title: 'Support',
      icon: <MessageSquareIcon size={20} />,
      path: '/delivery/support',
    },
    {
      title: 'Profile',
      icon: <UserIcon size={20} />,
      path: '/delivery/profile',
    },
    {
      title: 'Settings',
      icon: <SettingsIcon size={20} />,
      path: '/delivery/settings',
    },
  ]

  const { user, logout } = useAuth()

  return (
    <div className="flex w-64 bg-white h-full shadow-lg overflow-y-auto">
      <div className="w-full">
        <div className="p-4 border-b border-purple-800">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/images/logo.png" alt="Logo" width={130} height={80} className="ml-5 mb-4" />
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <BikeIcon size={24} className="text-purple-500" />
            <span className="text-xl font-semibold text-purple-500">Delivery Portal</span>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-4">
              <div className="flex items-center px-4 py-2.5 text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer">
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </div>
              {item.submenu && (
                <div className="ml-4 mt-2 space-y-1">
                  {item.submenu.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.path}
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-purple-50"
                    >
                      <div className="flex items-center">
                        {subItem.icon && (
                          <span className="mr-2">{subItem.icon}</span>
                        )}
                        {subItem.name}
                      </div>
                      {subItem.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {subItem.badge}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-auto pt-4 border-t">
            <button
              className="flex items-center w-full px-4 py-2.5 text-red-600 rounded-lg hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOutIcon size={20} />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default DeliverySidebar;