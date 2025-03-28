import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetails from './pages/ListingDetails';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/listings/new" element={<CreateListing />} />
              <Route path="/listings/:id" element={<ListingDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users/:id" element={<UserProfile />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App