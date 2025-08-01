"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ChefHatIcon, ClipboardListIcon, TruckIcon, UsersIcon, BookOpenIcon, BarChartIcon, SettingsIcon, MessageSquareIcon, NotebookTabs,
  DollarSignIcon, StarIcon, AlertCircleIcon, LogOutIcon, PlusCircleIcon, ListIcon, TrashIcon, PencilIcon, CheckCheck, History, ListCollapse,
} from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'

function Sidebar() {
  const { user, logout } = useAuth()
  const isRestaurantOwner = user?.roles?.includes("ROLE_RESTAURANT_OWNER")
  const isDeliveryPerson = user?.roles?.includes("ROLE_DELIVERY_PERSON")

  const menuItems = [
    ...(isRestaurantOwner ? [
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
            icon: <PlusCircleIcon size={18} />,
            path: '/restaurant/create-order',
          },
          {
            name: 'Active Orders',
            icon: <CheckCheck size={18} />,
            path: '/restaurant/orders/active',
          },
          {
            name: 'Order History',
            icon: <History size={18} />,
            path: '/restaurant/orders/history',
          },
        ],
      },
    ] : []),
    ...(isDeliveryPerson ? [
      {
        title: 'Delivery',
        icon: <TruckIcon size={20} />,
        submenu: [
          {
            name: 'Restaurant Details',
            icon: <ListCollapse size={18} />,
            path: '/deliverer/nearest-restaurant',
          },
          {
            name: 'My Assigned Orders',
            icon: <ClipboardListIcon size={18} />,
            path: '/delivery/assigned',
          },
        ],
      },
      {
        title: 'Vehicle Management',
        icon: <TruckIcon size={20} />,
        submenu: [
          {
            name: 'Vehicle Details',
            icon: <NotebookTabs size={18} />,
            path: '/restaurant/vehicle-details',
          },
          {
            name: 'Update Vehicle Details',
            icon: <PencilIcon size={18} />,
            path: '/restaurant/update-vehicle-details',
          },
        ],
      },
    ] : []),
    {
      title: 'Settings',
      icon: <SettingsIcon size={20} />,
      path: '/restaurant/settings',
    },
  ]

  return (
    <div className="flexw-64 bg-white h-full shadow-lg overflow-y-auto" style={{ scrollbarColor: '#8200db #f3f4f6', scrollbarWidth: 'thin' }}>
      <div className="p-4 border-b border-purple-400">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={130} height={80} className="ml-5 mb-4" />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <ChefHatIcon size={24} className="text-purple-500" />
          <span className="text-xl font-semibold text-purple-500">
            {isRestaurantOwner ? "Restaurant Portal" : "Delivery Portal"}
          </span>
        </div>
      </div>
      <nav className="p-4 bg-purple-50">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center px-4 py-2.5 text-purple-600 rounded-lg hover:bg-purple-50 cursor-pointer">
              {item.icon}
              <span className="ml-3 font-medium">{item.title}</span>
            </div>
            {item.submenu && (
              <div className="ml-4 mt-2 space-y-1">
                {item.submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.path}
                    className="flex items-center px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-purple-50"
                  >
                    {subItem.icon && (
                      <span className="mr-2">{subItem.icon}</span>
                    )}
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="mt-auto pt-4 border-t border-purple-400">
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

export default Sidebar;
