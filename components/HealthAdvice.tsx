import React from 'react'

export default function HealthAdvice() {
  return (
    <div className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Left: Plate image and floating food */}
        <div className="relative w-full md:w-1/2 flex justify-center order-2 md:order-1">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
            {/* Plate image */}
            <img
              src="https://images.unsplash.com/photo-1564671165093-20688ff1fffa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1lYWx8ZW58MHx8MHx8fDA%3D"
              alt="Grilled salmon with salad"
              className="rounded-full w-full h-full object-cover border-8 border-white shadow-xl"
            />
            {/* Floating food elements - positioned more precisely */}
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dG9tYXRvfGVufDB8fDB8fHww" 
                alt="Tomato" 
                className="w-12 h-12 rounded-full object-cover" 
              />
            </div>
            <div className="absolute -right-4 top-1/4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                alt="Avocado" 
                className="w-10 h-10 rounded-full object-cover" 
              />
            </div>
            <div className="absolute left-8 -bottom-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                alt="Nuts" 
                className="w-10 h-10 rounded-full object-cover" 
              />
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                alt="Cheese" 
                className="w-12 h-12 rounded-full object-cover" 
              />
            </div>
          </div>
        </div>

        {/* Right: Text content */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center order-1 md:order-2 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 leading-tight">
            Fresh, Healthy, Organic,<br className="hidden sm:block" /> Delicious Fruits
          </h2>
          <p className="text-purple-600/90 text-lg leading-relaxed max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, adipiscing. Organic Delicious Fruits.
          </p>
          <button className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-200">
            LEARN MORE
          </button>
        </div>
      </div>
    </div>
  )
}