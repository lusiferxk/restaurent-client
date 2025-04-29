import React from 'react'
import { ShoppingCart } from 'lucide-react'

interface MealCardProps {
  image: string
  name: string
  description: string
  price: number
  ingredients?: string[]
  onAddToCart?: () => void
}

const MealCard: React.FC<MealCardProps> = ({ image, name, description, price, ingredients, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-md flex flex-col h-full hover:bg-purple-50 transition-all cursor-pointer border border-gray-100 relative">
      {/* Cart icon top right */}
      <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 rounded-full p-2 shadow-sm">
        <ShoppingCart size={18} />
      </div>
      <img
        src={image}
        alt={name}
        className="w-full h-44 object-cover rounded-t-xl"
      />
      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-xs text-gray-600 mb-2 flex-1">{description}</p>
        {/* Ingredients list */}
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
          onClick={onAddToCart}
        >
          <ShoppingCart size={18} />
          Checkout
        </button>
      </div>
    </div>
  )
}

export default MealCard 