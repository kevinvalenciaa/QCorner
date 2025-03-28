import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User, Star, MapPin, Calendar } from 'lucide-react';
import { mockListings } from '../lib/mockData';

export default function UserProfile() {
  const { id } = useParams();
  const userListings = mockListings.filter(listing => listing.seller_id === id);
  const user = userListings[0]?.seller;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">User Not Found</h2>
          <p className="mt-2 text-gray-600">This user profile doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Hero Banner */}
        <div className="h-48 bg-gradient-to-r from-purple-500 to-indigo-600" />
        
        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-16">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center">
              <span className="text-4xl font-bold text-purple-600">
                {user.full_name.charAt(0)}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">{user.full_name}</h1>
            
            <div className="mt-4 flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Kingston, ON</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined {format(new Date(user.created_at), 'MMMM yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span>5.0 (24 reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Listings by {user.full_name}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listings/${listing.id}`}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {listing.title}
                </h3>
                <p className="mt-1 text-2xl font-bold text-purple-600">
                  ${listing.price.toFixed(2)}
                </p>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>{listing.category}</span>
                  <span>{format(new Date(listing.created_at), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}