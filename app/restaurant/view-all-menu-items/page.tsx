"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  MoreVertical,
  Edit,
  Trash,
  Eye,
  X,
  Save,
  Camera,
  DollarSign
} from 'lucide-react';
import DashboardLayout from '../../adminres/DashboardLayout';
import { fetchFromService } from '@/utils/fetchFromService';

interface MenuItem {
  id: string;
  name: string;
  price: number | string;
  description: string;
  available: boolean;
  imageUrl?: string;
  category?: string;
}

interface Restaurant {
  id: string;
  verifiedByAdmin: boolean;
}

interface ViewDetailsModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onEdit: (item: MenuItem) => void;
}

interface EditItemModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

// Helper function to format price
const formatPrice = (price: number | string): string => {
  if (typeof price === 'string') {
    return `Rs ${parseFloat(price).toFixed(2)}`;
  }
  return `Rs ${price.toFixed(2)}`;
};

// View Details Modal Component
const ViewDetailsModal = ({ item, onClose, onEdit }: ViewDetailsModalProps) => {

  if (!item) return null;
  
  return (
    <DashboardLayout>
    <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Menu Item Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-1/3">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={item.imageUrl || 'https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                  item.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              
              <div className="flex items-center text-gray-700 mb-4">
                <DollarSign size={20} className="text-purple-500 mr-2" />
                <span className="text-xl font-bold">{formatPrice(item.price)}</span>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">DESCRIPTION</h4>
                <p className="text-gray-700">{item.description}</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">ITEM ID</h4>
                    <p className="text-gray-700">{item.id}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">CATEGORY</h4>
                    <p className="text-gray-700">{item.category || 'Uncategorized'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(item)}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Edit Item
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

// Edit Item Modal Component
const EditItemModal = ({ item, onClose, onSave }: EditItemModalProps) => {
  const [editedItem, setEditedItem] = useState<MenuItem>(item || {
    id: '',
    name: '',
    price: 0,
    description: '',
    available: true,
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setEditedItem({
      ...editedItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await fetchFromService(
        'restaurant',
        `/menu/${editedItem.id}`,
        'PATCH',
        editedItem
      );
      
      onSave(editedItem);
      setMessage({ 
        type: 'success', 
        text: 'Menu item updated successfully!' 
      });
      
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to update menu item. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!item) return null;
  
  return (
    <DashboardLayout>
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Edit Menu Item</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="col-span-2">
              <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 relative cursor-pointer hover:border-purple-400 transition-colors">
                {editedItem.imageUrl ? (
                  <div className="relative w-full">
                    <img 
                      src={editedItem.imageUrl} 
                      alt="Menu item preview" 
                      className="h-48 w-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-center">
                        <Camera size={24} className="mx-auto mb-2" />
                        Change Image
                      </p>
                    </div>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Click to upload image</p>
                    <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF (max. 2MB)</p>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Item Name */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Item Name*
              </label>
              <input
                type="text"
                name="name"
                value={editedItem.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Chicken Burger"
                required
              />
            </div>
            
            {/* Price */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-gray-700 font-medium mb-2">
                Price (Rs)*
              </label>
              <input
                type="number"
                name="price"
                value={editedItem.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. 750.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            {/* Description */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={editedItem.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your menu item"
                rows={4}
              />
            </div>
            
            {/* Availability */}
            <div className="col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={editedItem.available}
                  onChange={handleChange}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500 rounded"
                />
                <span className="ml-2 text-gray-700">Available for ordering</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
          >
            <X size={18} className="mr-2" />
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save size={18} className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

// Main ViewAllMenuItems Component
const ViewAllMenuItems = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) throw new Error("User not found in localStorage.");

        // Get restaurant ID for the user
        const restaurantResponse = await fetchFromService(
          'restaurant',
          `/restaurants/user/${user.id}`,
          'GET'
        );

        if (!Array.isArray(restaurantResponse)) {
          throw new Error("Invalid response format from restaurants API");
        }

        const verifiedRestaurant = restaurantResponse.find((r: Restaurant) => r.verifiedByAdmin);
        if (!verifiedRestaurant) throw new Error("No verified restaurant found for this user.");

        const restaurantId = verifiedRestaurant.id;

        // Fetch menu items for the restaurant
        const response = await fetchFromService(
          'restaurant',
          `/menu/restaurant/${restaurantId}`,
          'GET'
        );

        if (!Array.isArray(response)) {
          throw new Error("Invalid response format from menu API");
        }

        // Ensure all prices are numbers
        const formattedMenuItems = response.map(item => ({
          ...item,
          price: typeof item.price === 'string' ? parseFloat(item.price) : item.price
        }));

        setMenuItems(formattedMenuItems);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch menu items');
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetchFromService(
        'restaurant',
        `/menu/${id}`,
        'DELETE'
      );

      setMenuItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err: any) {
      console.error('Error deleting menu item:', err);
      alert('Failed to delete menu item');
    }
  };

  const handleViewItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedItem: MenuItem) => {
    try {
      await fetchFromService(
        'restaurant',
        `/menu/${updatedItem.id}`,
        'PATCH',
        updatedItem
      );

      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      alert('Failed to update menu item');
    }
  };

  // Filter menu items based on search term
  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-800">Menu Items</h1>
          <a
            href="/restaurant/add-menu-item"
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <PlusCircle size={20} className="mr-2" />
            Add New Item
          </a>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter size={20} className="mr-2" />
            Filter
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">Loading menu items...</div>
        ) : (
          /* Menu Items Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative">
                  <img
                    src={item.imageUrl || 'https://plus.unsplash.com/premium_photo-1664478291780-0c67f5fb15e6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openDropdownId === item.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleViewItem(item)}
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="flex items-center w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                        >
                          <Trash size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mt-1">{item.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-purple-600 font-bold">{formatPrice(item.price)}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {isViewModalOpen && (
          <ViewDetailsModal
            item={selectedItem}
            onClose={() => setIsViewModalOpen(false)}
            onEdit={() => {
              setIsViewModalOpen(false);
              handleEditItem(selectedItem!);
            }}
          />
        )}

        {isEditModalOpen && (
          <EditItemModal
            item={selectedItem}
            onClose={() => setIsEditModalOpen(false)}
            onSave={(updatedItem) => {
              handleSaveEdit(updatedItem);
              setIsEditModalOpen(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewAllMenuItems;