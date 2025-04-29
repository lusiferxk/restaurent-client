"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ShoppingCart, StarIcon, ClockIcon, MapPinIcon, PlusIcon, MinusIcon } from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  // Get meal and restaurant data from query params
  const image = searchParams.get("image");
  const name = searchParams.get("name");
  const description = searchParams.get("description");
  const price = Number(searchParams.get("price"));
  const ingredients = searchParams.get("ingredients")?.split(",") || [];
  const restaurant = searchParams.get("restaurant");
  const rating = searchParams.get("rating");
  const distance = searchParams.get("distance");
  const deliveryTime = searchParams.get("deliveryTime");

  const [quantity, setQuantity] = useState(1);

  if (!image || !name || !restaurant) {
    return <div className="container mx-auto py-16 text-center text-gray-500">No meal selected for checkout.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-10">
        {/* First column: Big image */}
        <div className="flex-shrink-0 w-full md:w-96 flex items-center justify-center">
          <img src={image} alt={name} className="w-full h-96 object-cover rounded-xl border border-gray-200" />
        </div>
        {/* Second column: Details */}
        <div className="flex-1 flex flex-col justify-between">
          {/* Restaurant Details */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-purple-700 mb-2 flex items-center gap-2">
              {restaurant}
              <span className="flex items-center gap-1 text-yellow-500 text-base">
                <StarIcon size={18} className="text-yellow-500" />
                {rating}
              </span>
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1"><MapPinIcon size={16} /> {distance || "1.2 km"}</span>
              <span className="flex items-center gap-1"><ClockIcon size={16} /> {deliveryTime || "20-30 min"}</span>
            </div>
          </div>
          {/* Meal Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {name}
                <span className="ml-2 text-purple-600"><ShoppingCart size={24} /></span>
              </h2>
              <p className="text-gray-600 mb-2">{description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ing) => (
                  <span key={ing} className="bg-gray-100 text-gray-700 rounded-xl px-3 py-1 text-sm">{ing}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><MinusIcon size={18} /></button>
                <span className="font-bold text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><PlusIcon size={18} /></button>
              </div>
              <div className="text-xl font-bold text-purple-700">${(price * quantity).toFixed(2)}</div>
            </div>
            <button className="mt-8 w-full bg-purple-600 text-white py-3 rounded-full font-medium hover:bg-purple-700 flex items-center justify-center gap-2 text-lg">
              <ShoppingCart size={20} /> Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 