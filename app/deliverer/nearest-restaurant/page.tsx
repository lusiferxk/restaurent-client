import RestaurantList from '@/components/RestaurantList'
import React from 'react'
import DashboardLayout from '../../adminres/DashboardLayout'

const page = () => {
  return (
    <DashboardLayout>
      <RestaurantList />
    </DashboardLayout>
  )
}

export default page