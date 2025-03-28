export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller_id: string;
  status: 'active' | 'sold' | 'deleted';
  created_at: string;
  updated_at: string;
  seller?: Profile;
}

export interface SavedListing {
  user_id: string;
  listing_id: string;
  created_at: string;
  listing?: Listing;
}