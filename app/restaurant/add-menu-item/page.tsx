"use client";

import React, { useState } from 'react';
import {
  Save,
  X,
  ChevronLeft,
  Camera
} from 'lucide-react';
import DashboardLayout from '../../adminres/DashboardLayout'

const AddMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    description: '',
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
    if (e) e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful submission
      setMessage({
        type: 'success',
        text: 'Menu item added successfully!'
      });

      // Reset form
      setMenuItem({
        name: '',
        price: '',
        description: '',
        available: true
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add menu item. Please try again.'
      });
    } finally {
      setIsSubmitting(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <a href="/dashboardres" className="flex items-center text-purple-600 hover:text-purple-800">
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Menu Items</span>
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Add New Menu Item
          </h1>

          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg h-64 mb-4 relative cursor-pointer hover:border-purple-400 transition-colors">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Click to upload image</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF (max. 2MB)</p>
                </div>
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Item Name*
              </label>
              <input
                type="text"
                name="name"
                value={menuItem.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Chicken Burger"
                required
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Price (Rs)*
              </label>
              <input
                type="number"
                name="price"
                value={menuItem.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. 750.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={menuItem.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your menu item"
                rows="4"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={menuItem.available}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="ml-2 text-gray-700">Available for ordering</span>
              </label>
            </div>

            <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                onClick={() => {
                  setMenuItem({
                    name: '',
                    price: '',
                    description: '',
                    available: true
                  });
                }}
              >
                <X size={18} className="mr-2" />
                Cancel
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <Save size={18} className="mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddMenuItem;