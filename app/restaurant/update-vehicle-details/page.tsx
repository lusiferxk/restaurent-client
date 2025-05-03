"use client";

import React, { useState, useRef } from "react";
import { Save, X, ChevronLeft, Camera } from 'lucide-react';
import DashboardLayout from '../../adminres/DashboardLayout';

const initialVehicle = {
  vehicleNumber: "ABC-1234",
  vehicleImg: "https://example.com/images/vehicle1.jpg",
  vehicleDocuments: "https://example.com/docs/vehicle1_docs.pdf",
  licenseNumber: "B1234567",
};

export default function UpdateVehicleDetails() {
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicle((prev) => ({ ...prev, vehicleImg: typeof reader.result === 'string' ? reader.result : '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage({ type: 'success', text: 'Vehicle details updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update vehicle details. Please try again.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCancel = () => {
    setVehicle(initialVehicle);
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center">
          <a href="/restaurant/vehicle-details" className="flex items-center text-purple-600 hover:text-purple-800">
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Vehicle Details</span>
          </a>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
            Update Vehicle Details
          </h1>
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message.text}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <div
                  className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg h-64 mb-4 relative cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  {vehicle.vehicleImg ? (
                    <img src={vehicle.vehicleImg} alt="Vehicle" className="object-contain h-full max-h-60" />
                  ) : (
                    <div className="text-center">
                      <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-500">Click to upload vehicle image</p>
                      <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-medium mb-2">Vehicle Number*</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={vehicle.vehicleNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-gray-700 font-medium mb-2">License Number*</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={vehicle.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Vehicle Documents URL*</label>
                <input
                  type="text"
                  name="vehicleDocuments"
                  value={vehicle.vehicleDocuments}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
                {vehicle.vehicleDocuments && (
                  <a
                    href={vehicle.vehicleDocuments}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-xs font-medium shadow"
                  >
                    View Vehicle Documents
                  </a>
                )}
              </div>
              <div className="col-span-2 flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                  onClick={handleCancel}
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <Save size={18} className="mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
} 