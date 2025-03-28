import type { Profile, Listing, SavedListing } from '../types';

export const mockUser: Profile = {
  id: '1',
  email: 'demo@queensu.ca',
  full_name: 'Demo User',
  created_at: new Date().toISOString()
};

export const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Computer Science Textbook',
    description: 'Introduction to Algorithms, 4th Edition. Like new condition.',
    price: 75.00,
    category: 'Textbooks',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1000'
    ],
    seller_id: '1',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller: mockUser
  },
  {
    id: '2',
    title: 'MacBook Pro 2022',
    description: 'M1 Pro, 16GB RAM, 512GB SSD. Includes charger and original box.',
    price: 1200.00,
    category: 'Electronics',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=1000'
    ],
    seller_id: '2',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    seller: {
      id: '2',
      email: 'seller@queensu.ca',
      full_name: 'Jane Doe',
      created_at: new Date().toISOString()
    }
  }
];

export const mockSavedListings: SavedListing[] = [
  {
    user_id: '1',
    listing_id: '2',
    created_at: new Date().toISOString(),
    listing: mockListings[1]
  }
];