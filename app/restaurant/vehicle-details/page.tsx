"use client"

import React from 'react'
import { MapPin, Phone, Car, FileText, BadgeCheck } from 'lucide-react'
import DashboardLayout from '../../adminres/DashboardLayout';


const vehicleData = {
  username: "delivery4",
  email: "deliveryperson4@example.com",
  firstName: "Kamal",
  lastName: "Perera",
  address: "123 Main Street",
  city: "Colombo",
  postalCode: 10100,
  phoneNumber: "0771234567",
  vehicleNumber: "AB-1234",
  vehicleType: "Bike",
  vehicleImg: "http://example.com/images/vehicle.jpg",
  profileImg: "http://example.com/images/profile.jpg",
  nic: "901234567V",
  vehicleDocuments: "http://example.com/docs/vehicle-docs.pdf",
  licenseNumber: "B1234567"
}

const VehicleDetails = () => {
  return (
    <DashboardLayout>
    <div className="p-8 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-purple-700 mb-13 text-center">Vehicle Details</h1>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Profile Section */}
        <div className="md:w-1/3 flex flex-col items-center p-10 bg-purple-50">
          <img
            src={vehicleData.profileImg}
            alt="Profile"
            className="w-50 h-50 rounded-full object-cover border-2 border-purple-300 mb-6 shadow"
          />
          <div className="text-2xl font-bold text-purple-700 mb-1">{vehicleData.firstName} {vehicleData.lastName}</div>
          <div className="text-gray-500 text-base mb-2">{vehicleData.username}</div>
          <div className="flex items-center text-gray-600 text-base mb-1">
            <Phone className="w-5 h-5 mr-2" /> {vehicleData.phoneNumber}
          </div>
          <div className="flex items-center text-gray-600 text-base">
            <MapPin className="w-5 h-5 mr-2" /> {vehicleData.address}, {vehicleData.city}
          </div>
        </div>
        {/* Vehicle Section */}
        <div className="md:w-2/3 p-10 flex flex-col gap-8 justify-center">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <img
              src={vehicleData.vehicleImg}
              alt="Vehicle"
              className="w-78 h-74 object-cover rounded-xl border-2 border-purple-200 shadow-lg"
            />
            <div>
              <div className="flex items-center text-2xl font-bold text-purple-700 mb-2">
                <Car className="w-6 h-6 mr-3" /> {vehicleData.vehicleType} - {vehicleData.vehicleNumber}
              </div>
              <div className="flex items-center text-gray-700 text-lg mb-1">
                <BadgeCheck className="w-5 h-5 mr-2 text-purple-500" /> License: {vehicleData.licenseNumber}
              </div>
              <div className="flex items-center text-gray-700 text-lg mb-1">
                <FileText className="w-5 h-5 mr-2 text-purple-500" /> NIC: {vehicleData.nic}
              </div>
              <a
                href={vehicleData.vehicleDocuments}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-base font-semibold shadow"
              >
                View Vehicle Documents
              </a>
            </div>
          </div>
          <div className="mt-6">
            <div className="text-gray-700 text-lg mb-2"><span className="font-semibold text-purple-700">Email:</span> {vehicleData.email}</div>
            <div className="text-gray-700 text-lg"><span className="font-semibold text-purple-700">Postal Code:</span> {vehicleData.postalCode}</div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  )
}

export default VehicleDetails 