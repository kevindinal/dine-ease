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

/**
This effect runs whenever the `user`, `loading`, or `router` state changes.
 * It checks if the `loading` state is `true`, and if so, it simply returns without doing anything. 
 * This is to prevent any actions before the user data has finished loading.
 * If the `user` is not available (i.e., the user is not signed in), it triggers an error toast message 
 * prompting the user to sign in. Afterward, it redirects the user to the sign-in page (`/sign-in`).
 * The `useEffect` hook ensures that any protected route or page will check for the user's authentication 
 * state and redirect to the sign-in page if the user is not signed in.
 */
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
