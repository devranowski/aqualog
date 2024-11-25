'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash;
        if (!hashFragment) {
          throw new Error('No hash fragment found in URL');
        }

        // Parse the hash fragment
        const params = new URLSearchParams(hashFragment.substring(1)); // Remove the '#' character
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        // Set the session with the tokens
        const { data: { session }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });
        
        if (error) {
          throw error;
        }
        
        if (session) {
          // Redirect to dashboard after successful login
          router.push('/dashboard');
        } else {
          throw new Error('No session found after setting tokens');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        // Redirect to login page on error
        router.push('/');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
