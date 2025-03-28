import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sliders } from 'lucide-react';
import { mockListings } from '../lib/mockData';
import type { Listing } from '../types';

const categories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Sports Equipment',
  'Other'
];

export default function Home() {
  const [listings] = useState<Listing[]>(mockListings);
  const [loading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredListings = listings
    .filter(listing => 
      listing.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? listing.category === category : true)
    )
    .sort((a, b) => {
      switch (sort) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Queen's University Marketplace
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Buy and sell within the Queen's community
        </p>
        
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Sliders className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No listings found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listings/${listing.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-w-4 aspect-h-3 relative">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <p className="text-xl font-bold text-white">
                    ${listing.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {listing.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <Link
                    to={`/users/${listing.seller_id}`}
                    className="text-sm text-gray-600 hover:text-purple-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {listing.seller?.full_name}
                  </Link>
                  <span className="text-sm text-gray-500">
                    {listing.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}