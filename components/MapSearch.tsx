"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";

interface MapSearchProps {
  onSearch: (address: string) => void;
}

export function MapSearch({ onSearch }: MapSearchProps) {
  const [address, setAddress] = useState("");

  const handleSearch = () => {
    if (address.trim() !== "") {
      onSearch(address);
    }
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search for a location..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      <SearchIcon
        size={20}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <button
        type="button" // IMPORTANT
        onClick={handleSearch} // Call manually
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700"
      >
        Search
      </button>
    </div>
  );
}
