import { Hero } from '@/components/Hero'
import { Categories } from '@/components/Categories'
import RestaurantList from '@/components/RestaurantList'
import HealthAdvice from '@/components/HealthAdvice'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <HealthAdvice />
      <RestaurantList />
    </>
  )
}
