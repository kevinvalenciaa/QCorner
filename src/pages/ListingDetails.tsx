import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, MessageCircle, AlertCircle, User, MapPin, Clock, Tag, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { mockListings } from '../lib/mockData';
import type { Listing } from '../types';

export default function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const found = mockListings.find(l => l.id === id);
      setListing(found || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const toggleSave = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved listings' : 'Added to saved listings');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
        <p className="text-gray-600 mb-8">This listing may have been removed or doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={listing.images[selectedImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ring-2 transition-all ${
                      selectedImage === index ? 'ring-purple-500 ring-offset-2' : 'ring-transparent hover:ring-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
                <button
                  onClick={toggleSave}
                  className={`p-2 rounded-full ${
                    isSaved
                      ? 'text-red-500 hover:bg-red-50'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-6 w-6" fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                ${listing.price.toFixed(2)}
              </p>
            </div>

            <Link
              to={`/users/${listing.seller_id}`}
              className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-purple-600">
                  {listing.seller?.full_name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {listing.seller?.full_name}
                </h3>
                <p className="text-gray-600">
                  Member since {format(new Date(listing.seller?.created_at || ''), 'MMMM yyyy')}
                </p>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{format(new Date(listing.created_at), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Kingston, ON</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Tag className="h-5 w-5" />
                <span>{listing.category}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="h-5 w-5" />
                <span>{listing.condition}</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
            </div>

            {user && user.id !== listing.seller_id && (
              <button
                onClick={() => toast.success('Message feature coming soon!')}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Contact Seller</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}