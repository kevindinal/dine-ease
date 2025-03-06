'use client';

import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';


type LayoutProps = {
    children: ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    interface User {
      // Define the structure of your user data here
      uid: string;
      email: string;
      // Add other fields as necessary
    }
    
    return (
        <>  
            {children}
        </>
    );
};

export default Layout;