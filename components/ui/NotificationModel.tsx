'use client';
import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { format, parseISO } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type?: 'order' | 'promotion';
}

interface CustomJwtPayload {
  userId: number;
  [key: string]: any;
}

export default function NotificationModel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'orders' | 'promotions'>('all');
  const [expandedNotificationId, setExpandedNotificationId] = useState<number | null>(null);
  const stompClient = useRef<Client | null>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setUserId] = useState<number | null>(null);
  const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzYWNoaW5pMTIzIiwidXNlcklkIjoxLCJyb2xlIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3NDUyNTM0OTMsImV4cCI6MTc0ODg1MzQ5MywiaXNzIjoiY3JlYXRpdmVsay1hdXRoIn0.lljkZFZciKLpY_dWHUNS29GZf1Z_bbp1z0QbN7OBC-o";
  const token_ = localStorage.getItem("authToken")


  // Token extraction logic
  useEffect(() => { 
    if (!token) return;
    
    const decodedToken = jwtDecode<CustomJwtPayload>(token);
    const currentUserId = decodedToken.userId;
    setUserId(currentUserId);
    console.log("Auto-extracted userId:", currentUserId);
    
    fetchNotifications();
  }, [token]);


  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
        setExpandedNotificationId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'orders') return notification.type === 'order';
    if (activeTab === 'promotions') return notification.type === 'promotion';
    return true;
  });


  // Format notification date
  const formatNotificationDate = (dateString: string) => {
    try {
      const isoString = dateString.includes(' ') 
        ? dateString.replace(' ', 'T') + 'Z'
        : dateString;
      return format(parseISO(isoString), 'h:mm a').toLowerCase();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '--:-- --';
    }
  };


  // Fetch notifications from the server
  const fetchNotifications = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data: Notification[] = await response.json();
      const userNotifications = data.filter(n => n.userId === currentUserId);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };


  // WebSocket connection and subscription
  useEffect(() => {
    if (!token) return;
  
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        'heart-beat': '10000,10000'
      },
      debug: (str) => console.log('STOMP:', str),
      
      onConnect: () => {
        const subscription = client.subscribe(
          `/user/${currentUserId}/queue/notifications`,
          (message) => {
            try {
              const newNotification = JSON.parse(message.body);
              console.log('Received notification:', newNotification);
              setNotifications(prev => [...prev, newNotification]);
            } catch (error) {
              console.error('Failed to parse message:', error);
            }
          },
          { Authorization: `Bearer ${token}` }
        );
      },
      
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers?.message);
      }
    });
  
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [token]);


  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.map(n => 
        n.id === id ? {...n, read: true} : n
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };


  // Handle notification click
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    setExpandedNotificationId(expandedNotificationId === notification.id ? null : notification.id);
  };


  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await fetch(`http://localhost:8080/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.map(n => ({...n, read: true})));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };


  // Delete notification
  const deleteNotification = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => 
        notifications.find(n => n.id === id)?.read ? prev : prev - 1
      );
      if (expandedNotificationId === id) {
        setExpandedNotificationId(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };


  // Send test notification (for testing purposes)
  // This function is for testing purposes only and should be removed in production
  const sendTestNotification = () => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: '/app/sendNotification',
        body: JSON.stringify({
          title: 'Test Order Notification',
          message: 'This is a test order message',
          type: 'order',
          userId: currentUserId,
          email: 'test@example.com'
        }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  };


  
  return (
    <div className="relative" ref={notificationRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowNotifications(!showNotifications);
          setExpandedNotificationId(null);
          if (!showNotifications) {
            fetchNotifications();
          }
        }}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-sm"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[28rem] bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <div className="flex space-x-1 bg-gray-50 rounded-lg p-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('all');
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    activeTab === 'all' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('orders');
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    activeTab === 'orders' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Orders
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('promotions');
                  }}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    activeTab === 'promotions' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Promotions
                </button>
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8"
                >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent"
                  ></motion.div>
                  <p className="mt-3 text-gray-500">Loading notifications...</p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-red-500 bg-red-50 m-2 rounded-lg"
                >
                  {error}
                </motion.div>
              ) : filteredNotifications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center p-8 text-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <p className="text-gray-500 font-medium">No notifications</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {activeTab === 'all' 
                      ? "You're all caught up!" 
                      : activeTab === 'orders' 
                        ? "No order updates yet" 
                        : "No current promotions"}
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-gray-100 ${
                        !notification.read ? 'bg-blue-50' : ''
                      } ${
                        notification.type === 'order' ? 'border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div 
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotificationClick(notification);
                        }}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex flex-col w-full">
                                <div className="flex items-start space-x-2">
                                  {!notification.read && (
                                    <span className="flex-shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-1.5"></span>
                                  )}
                                  <h4
                                    className={`font-medium text-gray-800 group-hover:text-blue-600 transition-colors ${
                                      expandedNotificationId === notification.id ? 'whitespace-normal' : 'truncate'
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>
                                </div>
                              </div>
                            </div>
                            
                            

                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ 
                                  opacity: 1,
                                  height: expandedNotificationId === notification.id ? 'auto' : 'auto'
                                }}
                                transition={{ duration: 0.2 }}
                              >
                                {expandedNotificationId === notification.id ? (
                                  <div className="mt-2">
                                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                      {notification.message}
                                    </p>
                                    {notification.type === 'order' && (
                                      <div className="mt-3 flex space-x-2">
                                        <button 
                                          className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full hover:bg-blue-200 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          Track Order
                                        </button>
                                        <button 
                                          className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-200 transition-colors"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                          }}
                                        >
                                          View Details
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                )}
                              </motion.div>
                            </AnimatePresence>
                            <div className="flex mt-1 text-xs text-gray-400 space-x-1">
                              <span>
                                {format(
                                  parseISO(
                                    notification.timestamp.includes(' ')
                                      ? notification.timestamp.replace(' ', 'T')
                                      : notification.timestamp
                                  ),
                                  'MMM d, yyyy'
                                )} at
                              </span>
                              <span>{formatNotificationDate(notification.timestamp)}</span>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors group"
                              title="Delete"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  fetchNotifications();
                }}
                disabled={isLoading}
                className="text-sm text-purple-600 hover:text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors flex items-center space-x-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {/* <span>Refresh</span> */}
              </button>
              <div className="flex space-x-2">
                <span className="inline-flex items-center space-x-2 text-sm text-blue-500 hover:text-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
                  <svg  
                    xmlns="http://www.w3.org/2000/svg"  
                    width="1.3em"  
                    height="1.3em"  
                    viewBox="0 0 24 24"  
                    fill="none"  
                    stroke="currentColor"  
                    strokeWidth="2"  
                    strokeLinecap="round"  
                    strokeLinejoin="round"  
                    className="icon icon-tabler icons-tabler-outline icon-tabler-checks"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 12l5 5l10 -10" />
                    <path d="M2 12l5 5m5 -5l5 -5" />
                  </svg>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
                      Promise.all(unreadIds.map(markAsRead));
                    }}
                    className=""
                  >
                    Mark all as read
                  </button>
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    sendTestNotification();
                  }}
                  className="text-sm text-green-600 hover:text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
                >
                  Test WS
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}