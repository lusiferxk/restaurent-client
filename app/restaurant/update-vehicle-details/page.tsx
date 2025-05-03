"use client";

import React, { useState } from "react";

const initialVehicle = {
  vehicleNumber: "ABC-1234",
  vehicleImg: "https://example.com/images/vehicle1.jpg",
  vehicleDocuments: "https://example.com/docs/vehicle1_docs.pdf",
  licenseNumber: "B1234567",
};

export default function UpdateVehicleDetails() {
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the updated data to your API
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">Update Vehicle Details</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={vehicle.vehicleNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Image URL</label>
          <input
            type="text"
            name="vehicleImg"
            value={vehicle.vehicleImg}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          {vehicle.vehicleImg && (
            <img src={vehicle.vehicleImg} alt="Vehicle" className="mt-3 w-40 h-24 object-cover rounded-lg border" />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Vehicle Documents URL</label>
          <input
            type="text"
            name="vehicleDocuments"
            value={vehicle.vehicleDocuments}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={vehicle.licenseNumber}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mt-4"
        >
          Save
        </button>
        {success && (
          <div className="text-green-600 text-center font-semibold mt-2">Vehicle details updated successfully!</div>
        )}
      </form>
    </div>
  );
} 