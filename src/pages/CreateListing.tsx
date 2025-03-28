import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Sports Equipment',
  'Other'
];

const conditions = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
];

export default function CreateListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: ''
  });

  if (!user) {
    navigate('/auth');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      // Upload images
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileName = `${Date.now()}-${image.name}`;
          const { data, error } = await supabase.storage
            .from('listing-images')
            .upload(fileName, image);
          
          if (error) throw error;
          
          const { data: { publicUrl } } = supabase.storage
            .from('listing-images')
            .getPublicUrl(fileName);
          
          return publicUrl;
        })
      );

      // Create listing
      const { error } = await supabase
        .from('listings')
        .insert([{
          title: form.title,
          description: form.description,
          price: parseFloat(form.price),
          category: form.category,
          condition: form.condition,
          images: imageUrls,
          seller_id: user.id
        }]);

      if (error) throw error;

      toast.success('Listing created successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }
    setImages([...images, ...files]);
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Listing</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (up to 4)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-w-1 aspect-h-1">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="aspect-w-1 aspect-h-1 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 cursor-pointer flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="h-6 w-6 text-gray-400" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              id="condition"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select condition</option>
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Creating Listing...
              </>
            ) : (
              'Create Listing'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}