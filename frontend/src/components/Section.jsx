import React, { useState } from "react";

export default function Section() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="w-[80%] mx-auto my-10">
      {/* Simple Gallery Layout - Keeping your original arrangement */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
        
        {/* Left Column - 2 stacked images */}
        <div className="w-full lg:w-[33%] flex flex-col gap-4">
          <div
            className="h-[30vh] md:h-[35vh] lg:h-[48%] rounded-lg overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(1)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{ backgroundImage: 'url(pics1.jpg)' }}
            />
            {/* Simple overlay on hover */}
            <div 
              className={`absolute inset-0 transition-all duration-300 ${
                hoveredIndex === 1 ? 'bg-[#CA993B]/10' : ''
              }`}
            />
          </div>
          
          <div
            className="h-[30vh] md:h-[35vh] lg:h-[48%] rounded-lg overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(2)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{ backgroundImage: 'url(pics2.jpg)' }}
            />
            <div 
              className={`absolute inset-0 transition-all duration-300 ${
                hoveredIndex === 2 ? 'bg-[#CA993B]/10' : ''
              }`}
            />
          </div>
        </div>

        {/* Center Column - 1 full height image */}
        <div className="w-full lg:w-[34%]">
          <div
            className="h-[40vh] md:h-[50vh] lg:h-[69.5vh] rounded-lg overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(3)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110"
              style={{ backgroundImage: 'url(pics4.jpg)' }}
            />
            {/* Featured badge */}
            <div className="absolute top-4 left-4">
              <span 
                className="px-3 py-1 text-sm font-medium text-white rounded-full"
                style={{ backgroundColor: '#CA993B' }}
              >
                Featured
              </span>
            </div>
            <div 
              className={`absolute inset-0 transition-all duration-500 ${
                hoveredIndex === 3 ? 'bg-[#CA993B]/10' : ''
              }`}
            />
          </div>
        </div>

        {/* Right Column - 2 stacked images */}
        <div className="w-full lg:w-[33%] flex flex-col gap-4">
          <div
            className="h-[30vh] md:h-[35vh] lg:h-[48%] rounded-lg overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(4)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{ backgroundImage: 'url(pics3.jpg)' }}
            />
            <div 
              className={`absolute inset-0 transition-all duration-300 ${
                hoveredIndex === 4 ? 'bg-[#CA993B]/10' : ''
              }`}
            />
          </div>
          
          <div
            className="h-[30vh] md:h-[35vh] lg:h-[48%] rounded-lg overflow-hidden cursor-pointer relative"
            onMouseEnter={() => setHoveredIndex(5)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-110"
              style={{ backgroundImage: 'url(pics4.jpg)' }}
            />
            <div 
              className={`absolute inset-0 transition-all duration-300 ${
                hoveredIndex === 5 ? 'bg-[#CA993B]/10' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Simple caption below the gallery */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Premium Cow Skin - Prepared with Care
        </p>
      </div>
    </div>
  );
}