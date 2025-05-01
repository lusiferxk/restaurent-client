import { fetchFromService } from '@/utils/fetchFromService';

export async function fetchMenuItems(restaurantId: string) {
  return fetchFromService('restaurant', `/menu/restaurant/${restaurantId}`, 'GET');
}
