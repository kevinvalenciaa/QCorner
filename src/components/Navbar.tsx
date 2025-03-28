import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-gray-900">QCorner</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/listings/new"
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span>Sell</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}