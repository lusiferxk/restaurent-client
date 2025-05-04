"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BadgeCheck, Loader2, AlertCircle, Save, Upload } from "lucide-react"
import DashboardLayout from "../../adminres/DashboardLayout"
import { fetchFromService } from "@/utils/fetchFromService"

// Interface for vehicle response from API
interface VehicleResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: number
  phoneNumber: string
  vehicleNumber: string
  vehicleType: string
  vehicleImg: string
  profileImg: string
  nic: string
  vehicleDocuments: string
  licenseNumber: string
  isVerified?: boolean
}

// Interface for vehicle update request
interface VehicleUpdateRequest {
  vehicleNumber: string
  vehicleType: string
  vehicleImg: string
  vehicleDocuments: string
  licenseNumber: string
}

const UpdateVehicle = () => {
  const [vehicleData, setVehicleData] = useState<VehicleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState<VehicleUpdateRequest>({
    vehicleNumber: "",
    vehicleType: "",
    vehicleImg: "",
    vehicleDocuments: "",
    licenseNumber: "",
  })

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")

        if (!user?.id) {
          throw new Error("User not found. Please log in again.")
        }

        // Fetch vehicle details from API
        const response = await fetchFromService("user", `/api/user/vehicle/${user.id}`, "GET")

        // Set vehicle data from API response
        setVehicleData(response)

        // Initialize form data with current values
        setFormData({
          vehicleNumber: response.vehicleNumber || "",
          vehicleType: response.vehicleType || "",
          vehicleImg: response.vehicleImg || "",
          vehicleDocuments: response.vehicleDocuments || "",
          licenseNumber: response.licenseNumber || "",
        })
      } catch (err) {
        console.error("Error fetching vehicle details:", err)
        setError("Failed to load vehicle details.")
      } finally {
        setLoading(false)
      }
    }

    fetchVehicleDetails()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setUpdating(true)
      setUpdateSuccess(false)

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!user?.id) {
        throw new Error("User not found. Please log in again.")
      }

      // Update vehicle details via API
      const response = await fetchFromService("user", "/api/user/update-vehicle", "PUT", formData)

      // Update local state with response
      setVehicleData(response)
      setUpdateSuccess(true)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating vehicle details:", err)
      setError("Failed to update vehicle details. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 min-h-screen flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center">Update Vehicle Details</h1>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl p-10 items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
            <p className="mt-4 text-gray-600">Loading vehicle details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 min-h-screen flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-8 text-center">Update Vehicle Details</h1>

        {error && (
          <div className="w-full max-w-5xl mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {updateSuccess && (
          <div className="w-full max-w-5xl mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
            <div className="flex items-center">
              <BadgeCheck className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-green-700">Vehicle details updated successfully!</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Bike">Bike</option>
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="vehicleImg" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Image URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="vehicleImg"
                      name="vehicleImg"
                      value={formData.vehicleImg}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      className="bg-gray-100 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                      title="Upload Image"
                    >
                      <Upload className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  {formData.vehicleImg && (
                    <div className="mt-2">
                      <img
                        src={formData.vehicleImg || "/placeholder.svg"}
                        alt="Vehicle Preview"
                        className="h-20 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x200?text=Invalid+URL"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="vehicleDocuments" className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Documents URL
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="vehicleDocuments"
                      name="vehicleDocuments"
                      value={formData.vehicleDocuments}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/document.pdf"
                    />
                    <button
                      type="button"
                      className="bg-gray-100 px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                      title="Upload Document"
                    >
                      <Upload className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-base font-semibold shadow flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default UpdateVehicle
