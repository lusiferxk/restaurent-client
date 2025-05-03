"use client";

import React, { useState } from 'react';
import { Save, X, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../adminres/DashboardLayout';
import { fetchFromService } from '@/utils/fetchFromService';

const AddMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    available: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setMenuItem({
      ...menuItem,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?.id) throw new Error("User not found in localStorage.");

      const restaurantResponse = await fetchFromService(
        'restaurant',
        `/restaurants/user/${user.id}`,
        'GET'
      );

      const verifiedRestaurant = restaurantResponse.find((r: any) => r.verifiedByAdmin);
      if (!verifiedRestaurant) throw new Error("No verified restaurant found for this user.");

      const restaurantId = verifiedRestaurant.id;

      await fetchFromService(
        'restaurant',
        '/menu/add',
        'POST',
        [
          {
            ...menuItem,
            userId: user.id,
            restaurantId,
            price: parseFloat(menuItem.price)
          }
        ]
      );

      setMessage({ type: 'success', text: 'Menu item added successfully!' });

      setMenuItem({
        name: '',
        price: '',
        description: '',
        category: '',
        imageUrl: '',
        available: true
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add menu item. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <a href="/restaurant/view-all-menu-items" className="flex items-center text-purple-600 hover:text-purple-800">
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Menu Items</span>
          </a>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h1 className="text-2xl font-extrabold text-purple-800 mb-8 pb-4 border-b border-gray-200 text-center">
            Add New Menu Item
          </h1>

          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <input
              name="name"
              value={menuItem.name}
              onChange={handleChange}
              placeholder="Item Name*"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              name="price"
              type="number"
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Price (Rs)*"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              required
              min="0"
              step="0.01"
            />
            <input
              name="category"
              value={menuItem.category}
              onChange={handleChange}
              placeholder="Category (e.g. Rice, Drinks)*"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              name="imageUrl"
              value={menuItem.imageUrl}
              onChange={handleChange}
              placeholder="Image URL*"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
              required
            />
            <textarea
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-purple-500 md:col-span-2"
            />
            <label className="flex items-center md:col-span-2">
              <input
                type="checkbox"
                name="available"
                checked={menuItem.available}
                onChange={handleChange}
                className="h-5 w-5 text-purple-600"
              />
              <span className="ml-2">Available</span>
            </label>

            <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  setMenuItem({
                    name: '',
                    price: '',
                    description: '',
                    category: '',
                    imageUrl: '',
                    available: true
                  })
                }
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center font-semibold"
              >
                <X size={18} className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save size={18} className="mr-2" /> {isSubmitting ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMenuItem;
