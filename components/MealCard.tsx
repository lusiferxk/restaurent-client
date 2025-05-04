import React, { useEffect, useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchFromService } from '@/utils/fetchFromService'

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  available: boolean;
  category?: string;
}

interface MealCardProps {
  restaurantId: string
  restaurantName?: string
  restaurantRating?: number
  distance?: string
  deliveryTime?: string
}

const MealCard: React.FC<MealCardProps> = ({ restaurantId, restaurantName, restaurantRating, distance, deliveryTime }) => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (!restaurantId) {
          throw new Error('Restaurant ID is required');
        }

        const response = await fetchFromService('restaurant', `/menu/restaurant/${restaurantId}`, 'GET');
        setMenuItems(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
        console.error('Error fetching menu items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantId]);

  const handleCheckout = (item: MenuItem) => {
    const params = new URLSearchParams({
      image: item.imageUrl || '',
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      restaurant: restaurantName || '',
      rating: restaurantRating?.toString() || '',
      distance: distance || '',
      deliveryTime: deliveryTime || '',
      itemId: item.id
    });
    
    router.push(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md flex flex-col h-full p-4 animate-pulse">
            <div className="w-full h-44 bg-gray-200 rounded-t-xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mt-auto"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md flex flex-col h-full p-4 text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(90vh-300px)]">
      {menuItems.map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-md flex flex-col h-full hover:bg-purple-50 transition-all cursor-pointer border border-gray-100 relative">
          {/* Cart icon top right */}
          <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 rounded-full p-2 shadow-sm">
            <ShoppingCart size={18} />
          </div>
          <img
            src={item.imageUrl || '/placeholder-image.jpg'}
            alt={item.name}
            className="w-full h-44 object-cover rounded-t-xl"
          />
          <div className="flex-1 flex flex-col p-4">
            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
            <p className="text-xs text-gray-600 mb-2 flex-1">{item.description}</p>
            <p className="text-purple-600 font-bold text-base mb-4">${item.price.toFixed(2)}</p>
            <button
              className="w-full mt-auto bg-purple-600 text-white py-2 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              onClick={() => handleCheckout(item)}
            >
              <ShoppingCart size={18} />
              Checkout
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MealCard 