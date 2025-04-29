"use client";

import React, { useState, Fragment } from 'react'
import { StarIcon, ClockIcon } from 'lucide-react'
import { RestaurantDetailsModal } from './RestaurantDetailsModal'
export interface Restaurant {
  id: number
  name: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: string
  categories: string[]
}
interface RestaurantCardProps {
  restaurant: Restaurant
}
export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <div
        className="group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative rounded-lg overflow-hidden aspect-video mb-3">
          <img
            src={restaurant.image || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-sm font-medium">
            {restaurant.deliveryTime} min
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg group-hover:text-purple-600 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center mt-1 text-sm text-gray-600">
            <div className="flex items-center">
              <StarIcon
                size={16}
                className="text-yellow-500 mr-1"
                fill="currentColor"
              />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex flex-wrap">
              {restaurant.categories.map((category, index) => (
                <Fragment key={category}>
                  <span>{category}</span>
                  {index < restaurant.categories.length - 1 && (
                    <span className="mx-1">•</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
          <div className="mt-1 text-sm text-gray-600 flex items-center">
            <ClockIcon size={14} className="mr-1" />
            <span>{restaurant.deliveryTime} min</span>
            <span className="mx-2">•</span>
            <span>{restaurant.deliveryFee} delivery fee</span>
          </div>
        </div>
      </div>
      <RestaurantDetailsModal
        restaurant={restaurant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
