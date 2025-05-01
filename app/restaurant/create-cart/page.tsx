"use client";

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Plus, 
  Minus,
  CreditCard,
  DollarSign,
  Truck,
  User,
  PlusCircle,
  ShoppingCart,
  ArrowLeft,
  Home
} from 'lucide-react';

/******************************
 * CART PAGE COMPONENT
 ******************************/
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  
  // Mock product data
  const mockProduct = {
    productId: 108,
    productName: "Chicken Burger",
    price: 6,
    restaurantId: 2004,
    image: "/api/placeholder/100/100"
  };
  
  useEffect(() => {
    // Simulate fetching cart data
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setCartItems([{ ...mockProduct, quantity: 1, note: '' }]);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const updateCartItem = () => {
    setCartItems([{ ...mockProduct, quantity, note }]);
  };
  
  const removeFromCart = () => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      setCartItems([]);
    }
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getTax = () => {
    return getTotalPrice() * 0.05; // 5% tax
  };
  
  const getDeliveryFee = () => {
    return 2.50;
  };
  
  const getFinalTotal = () => {
    return getTotalPrice() + getTax() + getDeliveryFee();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <a href="/restaurant" className="mr-4">
          <ArrowLeft className="text-gray-600" />
        </a>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
          <a 
            href="/restaurant/menu" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            <Home size={18} className="mr-2" />
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Cart Items</h2>
              
              {cartItems.map((item) => (
                <div key={item.productId} className="border-b pb-4 mb-4">
                  <div className="flex items-start">
                    <div className="h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.productName}</h3>
                        <button onClick={removeFromCart} className="text-red-500">
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">Unit Price: ${item.price.toFixed(2)}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border rounded-md">
                          <button 
                            onClick={decreaseQuantity}
                            className="px-3 py-1 border-r hover:bg-gray-100"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1">{quantity}</span>
                          <button 
                            onClick={increaseQuantity}
                            className="px-3 py-1 border-l hover:bg-gray-100"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="font-medium">
                          ${(item.price * quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      {showNoteInput ? (
                        <div className="mt-3">
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add special instructions..."
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="2"
                          ></textarea>
                          <div className="flex justify-end mt-2">
                            <button 
                              onClick={() => {
                                updateCartItem();
                                setShowNoteInput(false);
                              }}
                              className="px-3 py-1 bg-purple-600 text-white text-sm rounded-md"
                            >
                              Save Note
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setShowNoteInput(true)}
                          className="text-purple-600 text-sm flex items-center mt-2"
                        >
                          <MessageSquare size={14} className="mr-1" />
                          {note ? 'Edit Special Instructions' : 'Add Special Instructions'}
                        </button>
                      )}
                      
                      {note && !showNoteInput && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Note:</span> {note}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => window.location.href = "/restaurant/menu"}
                className="flex items-center text-purple-600 hover:text-purple-700"
              >
                <PlusCircle size={18} className="mr-2" />
                Add More Items
              </button>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${getDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 font-semibold flex justify-between">
                  <span>Total</span>
                  <span>${getFinalTotal().toFixed(2)}</span>
                </div>
              </div>
              
              <a 
                href="/restaurant/checkout" 
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-md hover:bg-purple-700"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;