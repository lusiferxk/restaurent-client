import React from 'react'
import DashboardLayout  from '../admin/DashboardLayout'
import {
  BarChartIcon,
  TruckIcon,
  StarIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ClockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  InfoIcon,
} from 'lucide-react'
 function Dashboard() {
  const stats = [
    {
      title: "Today's Orders",
      value: '45',
      icon: BarChartIcon,
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'Active Deliveries',
      value: '8',
      icon: TruckIcon,
      change: '+2.4%',
      trend: 'up',
    },
    {
      title: 'Rating',
      value: '4.8',
      icon: StarIcon,
      change: '+0.2',
      trend: 'up',
    },
    {
      title: "Today's Revenue",
      value: '$1,245',
      icon: DollarSignIcon,
      change: '+15.3%',
      trend: 'up',
    },
  ]
  const recentOrders = [
    {
      id: '#12345',
      customer: 'John Doe',
      items: 3,
      total: '$42.50',
      status: 'Processing',
      time: '5 mins ago',
    },
    {
      id: '#12344',
      customer: 'Jane Smith',
      items: 2,
      total: '$28.99',
      status: 'Delivered',
      time: '15 mins ago',
    },
    {
      id: '#12343',
      customer: 'Mike Johnson',
      items: 4,
      total: '$55.75',
      status: 'In Transit',
      time: '25 mins ago',
    },
    {
      id: '#12342',
      customer: 'Sarah Williams',
      items: 1,
      total: '$18.99',
      status: 'Preparing',
      time: '30 mins ago',
    },
  ]
  const popularItems = [
    {
      name: 'Margherita Pizza',
      orders: 124,
      revenue: '$1,860',
      trend: '+12%',
    },
    {
      name: 'Chicken Wings',
      orders: 98,
      revenue: '$1,470',
      trend: '+8%',
    },
    {
      name: 'Caesar Salad',
      orders: 87,
      revenue: '$957',
      trend: '+5%',
    },
    {
      name: 'Chocolate Cake',
      orders: 76,
      revenue: '$836',
      trend: '+15%',
    },
  ]
  const alerts = [
    {
      type: 'warning',
      message: 'Low stock on essential ingredients',
      time: '1 hour ago',
    },
    {
      type: 'success',
      message: 'All delivery drivers are active',
      time: '2 hours ago',
    },
    {
      type: 'info',
      message: 'New review received',
      time: '3 hours ago',
    },
  ]
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-purple-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 font-medium">{stat.title}</span>
              <stat.icon className="text-purple-500" size={24} />
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
              <span className="ml-2 text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h2>
            <button className="text-purple-500 hover:text-purple-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {order.id}
                  </span>
                  <p className="text-sm text-gray-600">{order.customer}</p>
                </div>
                <div className="text-sm text-gray-600">{order.items} items</div>
                <div className="text-sm font-medium text-gray-900">
                  {order.total}
                </div>
                <div className="text-sm">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-900">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Popular Items
            </h2>
            <button className="text-purple-500 hover:text-purple-600 text-sm font-medium">
              View Report
            </button>
          </div>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div>
                  <span className="font-medium text-gray-900">{item.name}</span>
                  <p className="text-sm text-gray-600">{item.orders} orders</p>
                </div>
                <div className="text-right">
                  <span className="font-medium text-gray-900">
                    {item.revenue}
                  </span>
                  <p className="text-sm text-green-600">{item.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Recent Alerts
        </h2>
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
            >
              {alert.type === 'warning' && (
                <AlertCircleIcon className="text-yellow-500" size={20} />
              )}
              {alert.type === 'success' && (
                <CheckCircleIcon className="text-green-500" size={20} />
              )}
              {alert.type === 'info' && (
                <InfoIcon className="text-blue-500" size={20} />
              )}
              <div className="flex-1">
                <p className="text-gray-900">{alert.message}</p>
                <span className="text-sm text-gray-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard;
