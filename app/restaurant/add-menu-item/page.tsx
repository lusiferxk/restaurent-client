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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMenuItem({
      ...menuItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
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

      const verifiedRestaurant = restaurantResponse.find((r) => r.verifiedByAdmin);
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
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
              className="input border rounded p-2"
              required
            />
            <input
              name="price"
              type="number"
              value={menuItem.price}
              onChange={handleChange}
              placeholder="Price (Rs)*"
              className="input border rounded p-2"
              required
              min="0"
              step="0.01"
            />
            <input
              name="category"
              value={menuItem.category}
              onChange={handleChange}
              placeholder="Category (e.g. Rice, Drinks)*"
              className="input border rounded p-2"
              required
            />
            <input
              name="imageUrl"
              value={menuItem.imageUrl}
              onChange={handleChange}
              placeholder="Image URL*"
              className="input border rounded p-2"
              required
            />
            <textarea
              name="description"
              value={menuItem.description}
              onChange={handleChange}
              placeholder="Description"
              rows={4}
              className="input border rounded p-2 md:col-span-2"
            />
            <label className="flex items-center">
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
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <X size={18} className="mr-2" /> Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
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
