'use client';

import { auth, db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast, Toaster } from 'sonner';


type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
      
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("details");
  
    const [user, loading] = useAuthState(auth);
  
    useEffect(() => {
    const fetchData = async () => {
        if (!loading && !user) {
            // Toast to notify user to sign in first
            toast.error("Please sign in first");

            router.push('/sign-in');
        }
    };

    fetchData();
    }, [user, loading, router]);
    
    return (
        <>  
            {children}
        </>
    );
};

export default Layout;