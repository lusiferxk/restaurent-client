"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Filter, 
  MoreVertical,
  Edit,
  Trash,
  Eye
} from 'lucide-react';

const ViewAllMenuItems = () => {
  const [menuItems, setMenuItems] = useState<{ 
    id: string; 
    name: string; 
    price: number; 
    description: string; 
    available: boolean; 
    image: string; 
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState('all');
  
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
  
  const [dropdownOpen, setDropdownOpen] = useState(null);
  
  const openDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };
  
  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id));
      setDropdownOpen(null);
    }
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Menu Items</h1>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => openDropdown(item.id)}
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {dropdownOpen === item.id && (
                        <div className="absolute right-6 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <a
                              href={`/restaurant/menu/${item.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye size={16} className="mr-3 text-gray-500" />
                              View Details
                            </a>
                            <a
                              href={`/restaurant/menu/edit/${item.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit size={16} className="mr-3 text-gray-500" />
                              Edit Item
                            </a>
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
    </div>
  );
};

export default ViewAllMenuItems;