import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Package, Bookmark, Loader2, User } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { mockListings, mockSavedListings } from '../lib/mockData';
import type { Listing, SavedListing } from '../types';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'saved' | 'settings'>('listings');
  const [myListings] = useState<Listing[]>(mockListings.filter(l => l.seller_id === user?.id));
  const [savedListings] = useState<SavedListing[]>(mockSavedListings);
  const [loading] = useState(false);

  if (!user) {
    navigate('/auth');
    return null;
  }

  const updateListingStatus = async (listingId: string, status: 'active' | 'sold' | 'deleted') => {
    toast.success('Listing status updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">
                {user?.full_name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.full_name}</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('listings')}
                className={`pb-4 px-1 ${
                  activeTab === 'listings'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="h-5 w-5 inline-block mr-2" />
                My Listings
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`pb-4 px-1 ${
                  activeTab === 'saved'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bookmark className="h-5 w-5 inline-block mr-2" />
                Saved
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`pb-4 px-1 ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-purple-500 text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="h-5 w-5 inline-block mr-2" />
                Settings
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto" />
              </div>
            ) : activeTab === 'listings' ? (
              <div className="space-y-4">
                {myListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    You haven't created any listings yet.
                  </div>
                ) : (
                  myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{listing.title}</h3>
                          <p className="text-sm text-gray-500">
                            ${listing.price.toFixed(2)} • {listing.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <select
                          value={listing.status}
                          onChange={(e) => updateListingStatus(listing.id, e.target.value as 'active' | 'sold' | 'deleted')}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="sold">Sold</option>
                          <option value="deleted">Delete</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'saved' ? (
              <div className="space-y-4">
                {savedListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    You haven't saved any listings yet.
                  </div>
                ) : (
                  savedListings.map(({ listing }) => (
                    <div
                      key={listing?.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => navigate(`/listings/${listing?.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={listing?.images[0]}
                          alt={listing?.title}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{listing?.title}</h3>
                          <p className="text-sm text-gray-500">
                            ${listing?.price.toFixed(2)} • {listing?.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="max-w-lg">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.full_name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}