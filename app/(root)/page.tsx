'use client';

import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <h1>Welcome!</h1>
      {user && (
        <div>
          <p>Current User: {user.email}</p>
          <p>{user.phoneNumber}</p>
          <Button type="submit" onClick={handleLogout} className='m-5'>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}