"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { supabase } from '../lib/supabase';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const router = useRouter(); // Initialize the router

  // Handle email/password sign-in
  const handleSignIn = async () => {
    setIsLoading(true); // Start loading
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message); // Set error message if login fails
    } else {
      setError(null);
      console.log('Redirecting to /dashboard...'); // Add a log to verify redirection
      router.push('/dashboard'); // Redirect to the dashboard on successful login
    }
    setIsLoading(false); // Stop loading
  };

  // Handle GitHub OAuth sign-in
  const handleSignInWithGitHub = async () => {
    setIsLoading(true); // Start loading
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) {
      setError(error.message); // Set error message if OAuth login fails
    } else {
      console.log('Redirecting to /dashboard...'); // Add a log to verify redirection
      router.push('/dashboard'); // Redirect to the dashboard on successful OAuth login
    }
    setIsLoading(false); // Stop loading
  };

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>

      {/* Email/Password Sign-In */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleSignIn}
        disabled={isLoading} // Disable button while loading
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      {/* GitHub OAuth Sign-In */}
      <button
        onClick={handleSignInWithGitHub}
        disabled={isLoading} // Disable button while loading
        className="w-full p-2 bg-gray-800 text-white rounded hover:bg-gray-900 mt-4 disabled:bg-gray-400"
      >
        {isLoading ? 'Redirecting...' : 'Sign In with GitHub'}
      </button>

      {/* Error Message */}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}