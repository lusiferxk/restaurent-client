// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   XIcon,
//   MinusIcon,
//   PlusIcon,
//   TrashIcon,
//   Clock,
//   MapPin as MapPinIcon,
//   ArrowRight,
//   CheckCircle,
//   ChevronDown,
//   ChevronUp,
//   CreditCard as CreditCardIcon,
//   Banknote as BanknoteIcon,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { Stripe } from "@stripe/stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import StripePaymentForm from "./StripePaymentForm";
// import { jwtDecode } from "jwt-decode";
// import { Client } from "@stomp/stompjs";

// // Initialize Stripe properly
// let stripePromise: Promise<Stripe | null> | null = null;

// const getStripe = (): Promise<Stripe | null> => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
//   }
//   return stripePromise;
// };

// interface CustomJwtPayload {
//   userId: number;
// }

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   restaurant: string;
//   restaurantId: number;
//   image: string;
//   description: string;
//   ingredients?: string[];
//   preparationTime?: string;
//   calories?: number;
// }

// interface CartModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const cartItems: CartItem[] = [
//   {
//     id: 1,
//     name: "Margherita Pizza",
//     price: 14.99,
//     quantity: 1,
//     restaurant: "Pizza Paradise",
//     restaurantId: 9876,
//     image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Classic pizza with fresh tomatoes, mozzarella, and basil",
//     ingredients: ["Tomatoes", "Mozzarella", "Basil", "Olive Oil"],
//     preparationTime: "20-25 mins",
//     calories: 850,
//   },
//   {
//     id: 2,
//     name: "California Roll",
//     price: 12.99,
//     quantity: 2,
//     restaurant: "Sushi Supreme",
//     restaurantId: 9876,
//     image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
//     description: "Crab meat, avocado and cucumber wrapped in sushi rice",
//     ingredients: ["Crab", "Avocado", "Cucumber", "Rice", "Nori"],
//     preparationTime: "15-20 mins",
//     calories: 350,
//   },
// ];

// export function CartModal({ isOpen, onClose }: CartModalProps) {
//   const [token, setToken] = useState<string | null>(null);
//   const [currentUserId, setUserId] = useState<number | null>(null);
//   const router = useRouter();
//   const [expandedItem, setExpandedItem] = useState<number | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "cash">("card");
//   const [paymentCompleted, setPaymentCompleted] = useState(false);
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//     const stompClient = useRef<Client | null>(null);
//   const [userLocation, setUserLocation] = useState<{
//     latitude: number | null;
//     longitude: number | null;
//     address: string;
//   }>({
//     latitude: null,
//     longitude: null,
//     address: "",
//   });

//   const [deliveryDetails, setDeliveryDetails] = useState({
//     address: "45 Queen's Road, Colombo",
//     phoneNumber: "+94112223344",
//     email: "sachini@example.com",
//     deliveryUserName: "Sachini Dilrangi",
//     deliveryUserPhoneNumber: "+94771234567",
//     specialNote: "Please call when you arrive.",
//   });

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setToken(localStorage.getItem("authToken"));
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode<CustomJwtPayload>(token);
//         setUserId(decodedToken.userId);
//       } catch (error) {
//         console.error('Invalid token:', error);
//       }
//     }
//   }, [token]);

//   const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const deliveryFee = 4.99;
//   const discount = 5.0;
//   const total = subtotal + deliveryFee - discount;

//   const toggleItemExpand = (id: number) => {
//     setExpandedItem(expandedItem === id ? null : id);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setDeliveryDetails(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const sendTestNotification = (id: number) => {
//     if (stompClient.current?.connected) {
//       stompClient.current.publish({
//         destination: '/app/sendNotification',
//         body: JSON.stringify({
//           title: 'Order Successfully Placed',
//           message: `Your Order#${id} has been placed successfully! We will notify you once it is ready for delivery.`,
//           type: 'order',
//           userId: currentUserId,
//           email: 'sudaraka731@gmail.com'
//         }),
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }
//   };

//   const getCurrentLocation = async () => {
//     setLocationLoading(true);
//     try {
//       if (!navigator.geolocation) {
//         throw new Error("Geolocation is not supported by your browser");
//       }

//       const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });

//       const { latitude, longitude } = position.coords;
      
//       // Reverse geocode to get address
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//       );
      
//       if (!response.ok) {
//         throw new Error("Failed to fetch address");
//       }

//       const data = await response.json();
//       const address = data.display_name || `${data.address?.road || ''}, ${data.address?.city || ''}`;

//       setUserLocation({
//         latitude,
//         longitude,
//         address: address || "Current Location"
//       });

//       // Update delivery address with the found location
//       setDeliveryDetails(prev => ({
//         ...prev,
//         address: address || prev.address
//       }));

//       toast.success("Location fetched successfully!");
//     } catch (error) {
//       console.error("Error getting location:", error);
//       toast.error(error instanceof Error ? error.message : "Failed to get location");
//     } finally {
//       setLocationLoading(false);
//     }
//   };

//   const createOrder = async () => {
//     try {
//       if (!token) {
//         toast.error("Please login to place an order");
//         router.push("/login");
//         return;
//       }

//       // Validate delivery address
//       if (!deliveryDetails.address) {
//         toast.error("Please enter your delivery address");
//         return;
//       }

//       setIsSubmitting(true);
      
//       const orderData = {
//         restaurantId: cartItems[0].restaurantId,
//         paymentMethod: selectedPaymentMethod === "card" ? "CREDIT_CARD_ONLINE" : "CASH_ON_DELIVERY",
//         discount: discount,
//         deliveryFee: deliveryFee,
//         orderStatus: "PENDING",
//         paymentStatus: selectedPaymentMethod === "card" ? "PENDING" : "PENDING",
//         deliveryAddress: deliveryDetails.address,
//         phoneNumber: deliveryDetails.phoneNumber,
//         email: deliveryDetails.email,
//         deliveryUserName: deliveryDetails.deliveryUserName,
//         deliveryUserPhoneNumber: deliveryDetails.deliveryUserPhoneNumber,
//         estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
//         specialNote: deliveryDetails.specialNote,
//         location: {
//           address: deliveryDetails.address,
//           latitude: userLocation.latitude || 0, // Default to 0 if not available
//           longitude: userLocation.longitude || 0 // Default to 0 if not available
//         },
//         items: cartItems.map(item => ({
//           productId: item.id,
//           productName: item.name,
//           productPrice: item.price,
//           quantity: item.quantity,
//           discount: 0,
//           notes: ""
//         }))
//       };

//       const orderResponse = await fetch('http://localhost:8080/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(orderData)
//       });

//       if (!orderResponse.ok) {
//         const errorData = await orderResponse.json().catch(() => ({}));
//         throw new Error(errorData.message || 'Failed to create order');
//       }

//       const orderResult = await orderResponse.json();
//       setOrderId(orderResult.id);
      
//       if (selectedPaymentMethod === "card") {
//         const paymentResponse = await fetch('http://localhost:3005/api/payment', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ 
//             orderId: orderResult.id,
//             originalOrderAmount: total,
//             userId: currentUserId
//           })
//         });
      
//         if (!paymentResponse.ok) {
//           const errorData = await paymentResponse.json();
//           throw new Error(errorData.message || 'Failed to create payment intent');
//         }
      
//         const paymentResult = await paymentResponse.json();
//         setClientSecret(paymentResult.clientSecret);
//       }

//       return orderResult.id;
//     } catch (error) {
//       console.error('Error during order creation:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
//       toast.error(errorMessage);
      
//       if (orderId) {
//         toast.error('Order was created but payment failed. Please check your orders.');
//         router.push(`/orders/${orderId}`);
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCashPayment = async () => {
//     try {
//       await createOrder();
//       toast.success('Order placed successfully!');
//       onClose();
//       router.push(`/orders/${orderId}`);
//     } catch (error) {
//       console.error('Error placing order:', error);
//     }
//   };

//   const handlePaymentSuccess = async () => {
//     if (orderId) {
//       sendTestNotification(Number(orderId));
//     }
//     try {
//       if (orderId) {
//         await fetch(`http://localhost:8080/api/orders/status/${orderId}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ status: "CONFIRMED" })
//         });
//       }

//       setPaymentCompleted(true);
//       toast.success('Payment successful! Order is being processed.');
//       onClose();
//       router.push(`/orders/${orderId}`);
//     } catch (error) {
//       console.error('Error handling payment success:', error);
//     }
//   };

//   if (paymentCompleted) {
//     return (
//       <AnimatePresence>
//         {isOpen && (
//           <>
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={onClose}
//               className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
//             />
//             <motion.div
//               initial={{ x: "100%" }}
//               animate={{ x: 0 }}
//               exit={{ x: "100%" }}
//               transition={{ type: "spring", damping: 25, stiffness: 300 }}
//               className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
//             >
//               <div className="p-10 text-center">
//                 <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
//                 <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
//                 <p className="text-gray-600 mb-6">Your order is being processed.</p>
//                 <button
//                   onClick={() => {
//                     onClose();
//                     router.push(`/orders/${orderId}`);
//                   }}
//                   className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
//                 >
//                   View Order Details
//                 </button>
//               </div>
//             </motion.div>
//           </>
//         )}
//       </AnimatePresence>
//     );
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             onClick={onClose}
//             className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
//           />

//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
//           >
//             <div className="p-5 border-b border-gray-100">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
//                 <button
//                   onClick={onClose}
//                   className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                 >
//                   <XIcon size={20} className="text-gray-600" />
//                 </button>
//               </div>
//               <div className="flex items-center mt-1 text-sm text-gray-500">
//                 <CheckCircle size={14} className="mr-1.5 text-green-500" />
//                 <span>{cartItems.length} items</span>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto p-5 space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
//                 >
//                   <div className="flex p-4">
//                     <div className="relative mr-4">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-16 h-16 rounded-lg object-cover"
//                       />
//                       <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
//                         {item.quantity}
//                       </span>
//                     </div>
                    
//                     <div className="flex-1">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                           <p className="text-xs text-gray-500">{item.restaurant}</p>
//                         </div>
//                         <span className="font-bold text-purple-600">
//                           ${(item.price * item.quantity).toFixed(2)}
//                         </span>
//                       </div>
                      
//                       <div className="flex items-center justify-between mt-3">
//                         <div className="flex items-center space-x-2">
//                           <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
//                             <MinusIcon size={14} />
//                           </button>
//                           <span className="font-medium text-sm">{item.quantity}</span>
//                           <button className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
//                             <PlusIcon size={14} />
//                           </button>
//                         </div>
                        
//                         <button 
//                           onClick={() => toggleItemExpand(item.id)}
//                           className="text-xs text-purple-600 font-medium flex items-center"
//                         >
//                           {expandedItem === item.id ? (
//                             <>
//                               <span>Less details</span>
//                               <ChevronUp size={14} className="ml-1" />
//                             </>
//                           ) : (
//                             <>
//                               <span>More details</span>
//                               <ChevronDown size={14} className="ml-1" />
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {expandedItem === item.id && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: 'auto', opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.2 }}
//                       className="px-4 pb-4"
//                     >
//                       <div className="pt-3 border-t border-gray-100">
//                         <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        
//                         <div className="grid grid-cols-2 gap-3 text-sm">
//                           <div className="flex items-center text-gray-600">
//                             <Clock size={14} className="mr-2 text-purple-500" />
//                             <span>{item.preparationTime}</span>
//                           </div>
//                           <div className="flex items-center text-gray-600">
//                             <span className="mr-2">🔥</span>
//                             <span>{item.calories} cal</span>
//                           </div>
//                         </div>
                        
//                         {item.ingredients && (
//                           <div className="mt-3">
//                             <h4 className="text-xs font-medium text-gray-500 mb-1">Ingredients:</h4>
//                             <div className="flex flex-wrap gap-1">
//                               {item.ingredients.map((ingredient) => (
//                                 <span
//                                   key={ingredient}
//                                   className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
//                                 >
//                                   {ingredient}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         )}
                        
//                         <button className="mt-3 flex items-center text-red-500 text-sm">
//                           <TrashIcon size={14} className="mr-1" />
//                           Remove item
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </div>
//               ))}

//               <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                
//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Delivery Address</label>
//                     <input
//                       type="text"
//                       name="address"
//                       value={deliveryDetails.address}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded text-sm"
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
//                       <input
//                         type="tel"
//                         name="phoneNumber"
//                         value={deliveryDetails.phoneNumber}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border border-gray-200 rounded text-sm"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm text-gray-600 mb-1">Email</label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={deliveryDetails.email}
//                         onChange={handleInputChange}
//                         className="w-full p-2 border border-gray-200 rounded text-sm"
//                       />
//                     </div>
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Recipient Name</label>
//                     <input
//                       type="text"
//                       name="deliveryUserName"
//                       value={deliveryDetails.deliveryUserName}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded text-sm"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Recipient Phone</label>
//                     <input
//                       type="tel"
//                       name="deliveryUserPhoneNumber"
//                       value={deliveryDetails.deliveryUserPhoneNumber}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded text-sm"
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Special Instructions</label>
//                     <textarea
//                       name="specialNote"
//                       value={deliveryDetails.specialNote}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-200 rounded text-sm"
//                       rows={2}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-4">
//                 <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
//                 <div className="space-y-3">
//                   <button
//                     type="button"
//                     onClick={() => setSelectedPaymentMethod("card")}
//                     className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
//                       selectedPaymentMethod === "card"
//                         ? "border-purple-500 bg-purple-50"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <CreditCardIcon className="h-5 w-5" />
//                     <span>Credit/Debit Card</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setSelectedPaymentMethod("cash")}
//                     className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
//                       selectedPaymentMethod === "cash"
//                         ? "border-purple-500 bg-purple-50"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <BanknoteIcon className="h-5 w-5" />
//                     <span>Cash on Delivery</span>
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-100 p-5 bg-gray-50">
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between text-gray-700">
//                   <span>Subtotal</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-700">
//                   <span>Delivery</span>
//                   <span>${deliveryFee.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-700">
//                   <span>Discount</span>
//                   <span className="text-green-500">-${discount.toFixed(2)}</span>
//                 </div>
//                 <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
//                   <span>Total</span>
//                   <span className="text-purple-600">${total.toFixed(2)}</span>
//                 </div>
//               </div>
              
//               {selectedPaymentMethod === "card" ? (
//                 <>
//                   <button 
//                     onClick={createOrder}
//                     disabled={isSubmitting}
//                     className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
//                       isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//                     }`}
//                   >
//                     {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
//                     {!isSubmitting && <ArrowRight size={16} />}
//                   </button>
                  
//                   {clientSecret && (
//                     <Elements stripe={getStripe()} options={{ clientSecret }}>
//                       <StripePaymentForm
//                         orderId={orderId || ""}
//                         totalAmount={total}
//                         restaurantId={cartItems[0].restaurantId.toString()}
//                         onPaymentSuccess={handlePaymentSuccess}
//                         loading={isSubmitting}
//                         setLoading={setIsSubmitting}
//                         clientSecret={clientSecret} // Added this line
//                       />
//                     </Elements>
//                   )}
//                 </>
//               ) : (
//                 <button 
//                   onClick={handleCashPayment}
//                   disabled={isSubmitting}
//                   className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
//                     isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                 >
//                   {isSubmitting ? 'Processing...' : 'Place Order'}
//                   {!isSubmitting && <ArrowRight size={16} />}
//                 </button>
//               )}
                            
//               <p className="text-xs text-gray-500 mt-3 text-center">
//                 Free delivery for orders over $20
//               </p>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  Clock,
  MapPin as MapPinIcon,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard as CreditCardIcon,
  Banknote as BanknoteIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import { jwtDecode } from "jwt-decode";
import { Client } from "@stomp/stompjs";
import { fetchFromService } from "@/utils/fetchFromService";

// Initialize Stripe properly
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

interface CustomJwtPayload {
  userId: number;
}

interface CartItem {
  id: number;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  restaurant: string;
  restaurantId: number;
  image: string;
  description: string;
  ingredients?: string[];
  preparationTime?: string;
  calories?: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const fallBackImage = 'https://via.placeholder.com/100';

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const [token, setToken] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [currentUserId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "cash">("card");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    address: string;
  }>({
    latitude: null,
    longitude: null,
    address: "",
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    address: "45 Queen's Road, Colombo",
    phoneNumber: "+94112223344",
    email: "sachini@example.com",
    deliveryUserName: "Sachini Dilrangi",
    deliveryUserPhoneNumber: "+94771234567",
    specialNote: "Please call when you arrive.",
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem("authToken"));
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.id) throw new Error("User not found");

        const [cartResponse, userResponse] = await Promise.all([
          fetchFromService("order", `/api/cart`, "GET"),
          fetchFromService("user", `/api/user`, "GET")
        ]);

        setCartItems(cartResponse.cartItems || []);
        setUser(userResponse);
      } catch (err) {
        toast.error("Failed to load cart or user data");
      }
    };

    if (isOpen) fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<CustomJwtPayload>(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, [token]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 4.99;
  const discount = 5.0;
  const total = subtotal + deliveryFee - discount;

  const toggleItemExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const updatedItems = cartItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
          : item
      );
      
      await fetchFromService(
        "order",
        `/cart/${itemId}`,
        "PATCH",
        { quantity: newQuantity }
      );
      
      setCartItems(updatedItems);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await fetchFromService(
        "order",
        `cart/remove-item`,
        "PUT"
      );
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const sendTestNotification = (id: number) => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/sendNotification',
        body: JSON.stringify({
          title: 'Order Successfully Placed',
          message: `Your Order#${id} has been placed successfully! We will notify you once it is ready for delivery.`,
          type: 'order',
          userId: currentUserId,
          email: 'sudaraka731@gmail.com'
        }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  };

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch address");
      }

      const data = await response.json();
      const address = data.display_name || `${data.address?.road || ''}, ${data.address?.city || ''}`;

      setUserLocation({
        latitude,
        longitude,
        address: address || "Current Location"
      });

      // Update delivery address with the found location
      setDeliveryDetails(prev => ({
        ...prev,
        address: address || prev.address
      }));

      toast.success("Location fetched successfully!");
    } catch (error) {
      console.error("Error getting location:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get location");
    } finally {
      setLocationLoading(false);
    }
  };

  const getCoordinatesFromAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }

      const data = await response.json();
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.error("Error getting coordinates:", error);
    }
    return { latitude: 0, longitude: 0 };
  };

  const createOrder = async () => {
    try {
      if (!token) {
        toast.error("Please login to place an order");
        router.push("/login");
        return;
      }

      // Validate delivery address
      if (!deliveryDetails.address) {
        toast.error("Please enter your delivery address");
        return;
      }

      setIsSubmitting(true);
      
      // Get coordinates - use current location if available, otherwise geocode the address
      let coordinates = { latitude: 0, longitude: 0 };
      if (userLocation.latitude && userLocation.longitude) {
        coordinates = {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        };
      } else {
        coordinates = await getCoordinatesFromAddress(deliveryDetails.address);
      }

      const orderData = {
        restaurantId: cartItems[0].restaurantId || "6812298cbdd57d4d7476a502",
        paymentMethod: selectedPaymentMethod === "card" ? "CREDIT_CARD_ONLINE" : "CASH_ON_DELIVERY",
        discount: discount,
        deliveryFee: deliveryFee,
        orderStatus: "PENDING",
        paymentStatus: selectedPaymentMethod === "card" ? "PENDING" : "PENDING",
        deliveryAddress: deliveryDetails.address,
        phoneNumber: deliveryDetails.phoneNumber,
        email: deliveryDetails.email,
        deliveryUserName: deliveryDetails.deliveryUserName,
        deliveryUserPhoneNumber: deliveryDetails.deliveryUserPhoneNumber,
        estimatedDeliveryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        specialNote: deliveryDetails.specialNote,
        location: {
          address: deliveryDetails.address,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.price,
          quantity: item.quantity,
          discount: 0,
          notes: ""
        }))
      };

      const orderResponse = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderResult = await orderResponse.json();
      setOrderId(orderResult.id);
      
      if (selectedPaymentMethod === "card") {
        const paymentResponse = await fetch('http://localhost:3005/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            orderId: orderResult.id,
            originalOrderAmount: total,
            userId: currentUserId
          })
        });
      
        if (!paymentResponse.ok) {
          const errorData = await paymentResponse.json();
          throw new Error(errorData.message || 'Failed to create payment intent');
        } else {
          // handlePaymentSuccess();
        }
      
        const paymentResult = await paymentResponse.json();
        setClientSecret(paymentResult.clientSecret);
        setShowPaymentForm(true);
      }

      return orderResult.id;
    } catch (error) {
      console.error('Error during order creation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order. Please try again.';
      toast.error(errorMessage);
      
      if (orderId) {
        toast.error('Order was created but payment failed. Please check your orders.');
        router.push(`/orders/${orderId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCashPayment = async () => {
    try {
      await createOrder();
      toast.success('Order placed successfully!');
      onClose();
      router.push(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handlePaymentSuccess = async () => {
    if (orderId) {
      sendTestNotification(Number(orderId));
    }
    try {
      if (orderId) {
        await fetch(`http://localhost:3005/api/orders/status/${orderId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: "CONFIRMED" })
        });
      }

      setPaymentCompleted(true);
      toast.success('Payment successful! Order is being processed.');
      onClose();
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  };

  if (paymentCompleted) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="p-10 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-600 mb-6">Your order is being processed.</p>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/orders/${orderId}`);
                  }}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold"
                >
                  View Order Details
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Cart</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XIcon size={20} className="text-gray-600" />
                </button>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <CheckCircle size={14} className="mr-1.5 text-green-500" />
                <span>{cartItems.length} items</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <div className="flex p-4">
                    <div className="relative mr-4">
                      <img
                        src={item.image || fallBackImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.productName}</h3>
                          <p className="text-xs text-gray-500">{item.restaurant}</p>
                        </div>
                        <span className="font-bold text-purple-600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          >
                            <MinusIcon size={14} />
                          </button>
                          <span className="font-medium text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                          >
                            <PlusIcon size={14} />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => toggleItemExpand(item.id)}
                          className="text-xs text-purple-600 font-medium flex items-center"
                        >
                          {expandedItem === item.id ? (
                            <>
                              <span>Less details</span>
                              <ChevronUp size={14} className="ml-1" />
                            </>
                          ) : (
                            <>
                              <span>More details</span>
                              <ChevronDown size={14} className="ml-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <div className="pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock size={14} className="mr-2 text-purple-500" />
                            <span>{item.preparationTime}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">🔥</span>
                            <span>{item.calories} cal</span>
                          </div>
                        </div>
                        
                        {item.ingredients && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Ingredients:</h4>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.map((ingredient) => (
                                <span
                                  key={ingredient}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="mt-3 flex items-center text-red-500 text-sm"
                        >
                          <TrashIcon size={14} className="mr-1" />
                          Remove item
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {cartItems.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              )}

              {cartItems.length > 0 && (
                <>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                    
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium text-gray-600">Delivery Location</h4>
                      <button
                        onClick={getCurrentLocation}
                        disabled={locationLoading}
                        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                      >
                        <MapPinIcon size={16} />
                        {locationLoading ? "Getting Location..." : "Use Current Location"}
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Delivery Address</label>
                        <input
                          type="text"
                          name="address"
                          value={deliveryDetails.address}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={deliveryDetails.phoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={deliveryDetails.email}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-200 rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Recipient Name</label>
                        <input
                          type="text"
                          name="deliveryUserName"
                          value={deliveryDetails.deliveryUserName}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Recipient Phone</label>
                        <input
                          type="tel"
                          name="deliveryUserPhoneNumber"
                          value={deliveryDetails.deliveryUserPhoneNumber}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Special Instructions</label>
                        <textarea
                          name="specialNote"
                          value={deliveryDetails.specialNote}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("card")}
                        className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                          selectedPaymentMethod === "card"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <CreditCardIcon className="h-5 w-5" />
                        <span>Credit/Debit Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("cash")}
                        className={`w-full p-3 rounded-lg border flex items-center gap-3 ${
                          selectedPaymentMethod === "cash"
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200"
                        }`}
                      >
                        <BanknoteIcon className="h-5 w-5" />
                        <span>Cash on Delivery</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-100 p-5 bg-gray-50">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="text-green-500">-${discount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {selectedPaymentMethod === "card" ? (
                  <>
                    {!showPaymentForm ? (
                      <button 
                        onClick={createOrder}
                        disabled={isSubmitting || cartItems.length === 0}
                        className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                        {!isSubmitting && <ArrowRight size={16} />}
                      </button>
                    ) : null}
                    
                    {clientSecret && showPaymentForm && (
                      <Elements stripe={getStripe()} options={{ clientSecret }}>
                        <StripePaymentForm
                          orderId={orderId || ""}
                          totalAmount={total}
                          restaurantId={cartItems[0]?.restaurantId?.toString() || ""}
                          onPaymentSuccess={handlePaymentSuccess}
                          loading={isSubmitting}
                          setLoading={setIsSubmitting}
                          clientSecret={clientSecret}
                        />
                      </Elements>
                    )}
                  </>
                ) : (
                  <button 
                    onClick={handleCashPayment}
                    disabled={isSubmitting || cartItems.length === 0}
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                    {!isSubmitting && <ArrowRight size={16} />}
                  </button>
                )}
                              
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Free delivery for orders over $20
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}