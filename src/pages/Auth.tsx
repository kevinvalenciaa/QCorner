import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email.endsWith('@queensu.ca')) {
      toast.error('Please use your Queen\'s University email');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(form.email, form.password, form.fullName);
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        await signIn(form.email, form.password);
        toast.success('Welcome back!');
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(isSignUp ? 'Failed to create account' : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <ShoppingBag className="h-12 w-12 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="text-gray-500 mt-2">
          {isSignUp
            ? 'Join the Queen\'s University marketplace'
            : 'Sign in to access the marketplace'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required={isSignUp}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Queen's Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              pattern=".*@queensu\.ca$"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
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
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'Don\'t have an account? Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}