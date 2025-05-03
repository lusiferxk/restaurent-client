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


// View Details Modal Component
const ViewDetailsModal = ({ item, onClose, onEdit }) => {
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
                  src={item.image || '/api/placeholder/300/300'} 
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
                <span className="text-xl font-bold">Rs {item.price?.toFixed(2)}</span>
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
                    <h4 className="text-sm font-medium text-gray-500 mb-1">CREATED ON</h4>
                    <p className="text-gray-700">April 25, 2025</p>
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
const EditItemModal = ({ item, onClose, onSave }) => {
  const [editedItem, setEditedItem] = useState(item || {
    name: '',
    price: '',
    description: '',
    available: true,
    image: '/api/placeholder/300/300'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSave callback with the edited item
      if (onSave) {
        onSave(editedItem);
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Menu item updated successfully!' 
      });
      
      // Close modal after a short delay
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
                {editedItem.image ? (
                  <div className="relative w-full">
                    <img 
                      src={editedItem.image} 
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
                rows="4"
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
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // Mock data for demonstration
  const mockMenuItems = [
    {
      id: '1',
      name: 'Chicken Burger',
      price: 750.00,
      description: 'Grilled chicken with spicy mayo',
      available: true,
      image: '/api/placeholder/100/100'
    },
    {
      id: '2',
      name: 'Veggie Pizza',
      price: 950.00,
      description: 'Fresh vegetables on homemade crust',
      available: true,
      image: '/api/placeholder/100/100'
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      price: 450.00,
      description: 'Rich chocolate cake with ganache',
      available: false,
      image: '/api/placeholder/100/100'
    },
    {
      id: '4',
      name: 'Grilled Fish',
      price: 1250.00,
      description: 'Fresh catch of the day with lemon butter',
      available: true,
      image: '/api/placeholder/100/100'
    },
    {
      id: '5',
      name: 'Fried Rice',
      price: 650.00,
      description: 'Wok-fried rice with vegetables',
      available: true,
      image: '/api/placeholder/100/100'
    }
  ];
  
  useEffect(() => {
    // Simulate API fetch with timeout
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMenuItems(mockMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter menu items based on search term and availability filter
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAvailable === 'all') return matchesSearch;
    if (filterAvailable === 'available') return matchesSearch && item.available;
    if (filterAvailable === 'unavailable') return matchesSearch && !item.available;
    
    return matchesSearch;
  });
  
  const openDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
      setDropdownOpen(null);
    }
  };
  
  const handleViewItem = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
    setDropdownOpen(null);
  };
  
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setEditModalOpen(true);
    setDropdownOpen(null);
  };
  
  const handleSaveEdit = (updatedItem) => {
    setMenuItems(menuItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
  };
  
  // Click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  return (
    <DashboardLayout>
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-800">All Menu Items</h1>
        <a 
          href="/restaurant/add-menu-item" 
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          <PlusCircle size={18} className="mr-2" />
          Add New Item
        </a>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-80">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Items</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items found.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Rs {item.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold leading-5 rounded-full ${
                        item.available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative dropdown-container">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => openDropdown(item.id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {dropdownOpen === item.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => handleViewItem(item)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              <Eye size={16} className="mr-3 text-gray-500" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                            >
                              <Edit size={16} className="mr-3 text-gray-500" />
                              Edit Item
                            </button>
                            <button
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash size={16} className="mr-3 text-red-500" />
                              Delete Item
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* View Details Modal */}
      {viewModalOpen && (
        <ViewDetailsModal 
          item={selectedItem}
          onClose={() => setViewModalOpen(false)}
          onEdit={handleEditItem}
        />
      )}
      
      {/* Edit Item Modal */}
      {editModalOpen && (
        <EditItemModal 
          item={selectedItem}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
    </DashboardLayout>
  );
};

export default ViewAllMenuItems;