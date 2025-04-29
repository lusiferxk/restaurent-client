import React from 'react'

export default function HealthAdvice() {
  return (
    <div className="bg-white py-6">
      <div className="container mx-auto px-64 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Plate image and floating food */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <div className="relative w-72 h-72 md:w-96 md:h-96">
            {/* Plate image */}
            <img
              src="https://images.unsplash.com/photo-1564671165093-20688ff1fffa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1lYWx8ZW58MHx8MHx8fDA%3D"
              alt="Grilled salmon with salad"
              className="rounded-full w-full h-full object-cover border-8 border-white shadow-xl"
            />
            {/* Floating food elements (decorative) */}
            <img src="https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dG9tYXRvfGVufDB8fDB8fHww" alt="Tomato" className="absolute w-10 h-10 rounded-full shadow-lg left-0 top-8" />
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avocado" className="absolute w-8 h-8 rounded-full shadow-lg right-4 top-1/2" />
            <img src="https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Nuts" className="absolute w-8 h-8 rounded-full shadow-lg left-10 bottom-4" />
            <img src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Cheese" className="absolute w-10 h-10 rounded-full shadow-lg right-0 bottom-8" />
            <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avocado" className="absolute w-8 h-8 rounded-full shadow-lg right-4 top-1/2" />

          </div>
        </div>
        {/* Right: Text content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-6">
            Fresh, Healthy, Organic,<br />Delicious Fruits
          </h2>
          <p className="text-purple-600 mb-8 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,adipiscing. Organic Delicious Fruits.
          </p>
          <button className="px-8 py-3 bg-purple-500 text-white rounded-full font-medium hover:bg-purple-600 transition-colors">
            LEARN MORE
          </button>
        </div>
      </div>
    </div>
  )
} 