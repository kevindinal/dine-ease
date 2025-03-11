'use client';

import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        if (loading) {
            return;
        }
        if (!user) {
            toast.error("Please sign in first");
            router.push('/sign-in');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center animate-spin overflow-hidden">
                <Loader2 />
            </div>
        );
    }

    return <>{children}</>;
};

export default Layout;
