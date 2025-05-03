import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { fetchFromService } from '@/utils/fetchFromService'

interface MealCardProps {
  image: string
  name: string
  description: string
  price: number
  ingredients?: string[]
  onAddToCart?: () => void
  restaurantName?: string
  restaurantRating?: number
  distance?: string
  deliveryTime?: string
  productId: string
  restaurantId: string
}

const MealCard: React.FC<MealCardProps> = ({
  image,
  name,
  description,
  price,
  ingredients,
  onAddToCart,
  restaurantName,
  restaurantRating,
  distance,
  deliveryTime,
  productId,
  restaurantId,
}) => {
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      await fetchFromService(
        'order',
        '/api/cart',
        'POST',
        {
          productId,
          productName: name,
          price,
          restaurantId
        }
      );

      const params = new URLSearchParams({
        image,
        name,
        description,
        price: price.toString(),
        ingredients: ingredients?.join(',') || '',
        restaurant: restaurantName || '',
        rating: restaurantRating?.toString() || '',
        distance: distance || '',
        deliveryTime: deliveryTime || ''
      });
      router.push(`/checkout?${params.toString()}`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full hover:bg-purple-50 transition-all cursor-pointer border border-gray-100 relative">
      {/* <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 rounded-full p-2 shadow-sm">
        <ShoppingCart size={18} />
      </div> */}
      <img
        src={image}
        alt={name}
        className="w-full h-44 object-cover rounded-t-xl"
      />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-xs text-gray-600 mb-2 flex-1">{description}</p>
        {ingredients && ingredients.length > 0 && (
          <div className="mb-3">
            <span className="font-semibold text-sm text-gray-800">Ingredients:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {ingredients.map((ing) => (
                <span key={ing} className="bg-gray-100 text-gray-700 rounded-xl px-3 py-1 text-sm">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
        <p className="text-purple-600 font-bold text-base mb-4">${price.toFixed(2)}</p>
        <button
          className="w-full mt-auto bg-purple-600 text-white py-2 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          onClick={handleCheckout}
        >
          <ShoppingCart size={18} />
          Add to cart
        </button>
      </div>
    </div>
  )
}

export default MealCard
