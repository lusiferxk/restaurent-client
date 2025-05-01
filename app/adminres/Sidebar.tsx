"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChefHatIcon, ClipboardListIcon, TruckIcon, UsersIcon, BookOpenIcon, BarChartIcon, SettingsIcon, MessageSquareIcon,
  DollarSignIcon, StarIcon, AlertCircleIcon, LogOutIcon, PlusCircleIcon, ListIcon, TrashIcon, PencilIcon,
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'

function Sidebar() {
  const menuItems = [
    {
      title: 'Menu Management',
      icon: <BookOpenIcon size={20} />,
      submenu: [
        {
          name: 'Add Menu Item',
          icon: <PlusCircleIcon size={18} />,
          path: '/restaurant/add-menu-item',
        },
        {
          name: 'View All Items',
          icon: <ListIcon size={18} />,
          path: '/restaurant/view-all-menu-items',
        },
       
       
      ],
    },
    {
      title: 'Orders',
      icon: <ClipboardListIcon size={20} />,
      submenu: [
        {
          name: 'Create Order',
          path: '/restaurant/create-order',
        },
        {
          name: 'Active Orders',
          path: '/restaurant/orders/active',
        },
        {
          name: 'Order History',
          path: '/restaurant/orders/history',
        },
        {
          name: 'Create cart',
          icon: <ListIcon size={18} />,
          path: '/restaurant/create-cart',
        },
      ],
    },
    {
      title: 'Delivery',
      icon: <TruckIcon size={20} />,
      submenu: [
        {
          name: 'Delivery Partners',
          path: '/restaurant/delivery/partners',
        },
        {
          name: 'Delivery Zones',
          path: '/restaurant/delivery/zones',
        },
      ],
    },
    {
      title: 'orders',
      icon: <UsersIcon size={20} />,
      submenu: [
       
        {
          name: 'Schedules',
          path: '/restaurant/staff/schedules',
        },
      ],
    },
    {
      title: 'Analytics',
      icon: <BarChartIcon size={20} />,
      path: '/restaurant/analytics',
    },
    {
      title: 'Reviews',
      icon: <StarIcon size={20} />,
      path: '/restaurant/reviews',
    },
    {
      title: 'Finances',
      icon: <DollarSignIcon size={20} />,
      submenu: [
        {
          name: 'Earnings',
          path: '/restaurant/finances/earnings',
        },
        {
          name: 'Payouts',
          path: '/restaurant/finances/payouts',
        },
      ],
    },
    {
      title: 'Support',
      icon: <MessageSquareIcon size={20} />,
      path: '/restaurant/support',
    },
    {
      title: 'Settings',
      icon: <SettingsIcon size={20} />,
      path: '/restaurant/settings',
    },
  ]

  const { user, logout } = useAuth()


  return (

    <div className="flexw-64 bg-white h-full shadow-lg overflow-y-auto ">
      <div className="p-4 border-b border-purple-800">
      <div className="flex items-center">
            <Link 
              href="/">
              <Image src="/images/logo.png" alt="Logo" width={130} height={80} className="ml-5 mb-4" />
            </Link>
          </div>
        <div className="flex items-center space-x-2">
          <ChefHatIcon size={24} className="text-purple-500" />
          <span className="text-xl font-semibold text-purple-500">Restaurant Portal</span>
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
                    className="flex items-center px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-purple-50"
                  >
                    {subItem.icon && (
                      <span className="mr-2">{subItem.icon}</span>
                    )}
                    {subItem.name}
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
  )
}

export default Sidebar;