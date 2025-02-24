'use client';

import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { getUserData, logout } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserProp } from '@/types';

export default function Home() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserProp | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading && !user) {
        router.push('/sign-in');
      }
      setUserData(await getUserData());
    };

    fetchData();
  }, [user, loading, router]);

  // console.log(userData?.city)

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
          <p>First Name: {userData?.firstName} </p>
          <p>Last Name: {userData?.lastName} </p>
          <p>Email: {userData?.email} </p>
          <p>City: {userData?.city} </p>  
          <p>Country: {userData?.country} </p>
          <p>Mobile: {userData?.mobile} </p>         
          <Button type="submit" onClick={handleLogout} className='m-5'>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
}