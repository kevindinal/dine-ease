'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authformSchema } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaGoogle } from 'react-icons/fa';
import { auth, db } from '@/lib/firebase'; // Import Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithGoogle } from '@/lib/auth';

const provider = new GoogleAuthProvider();

const AuthForm = ({ type, className, ...props }: { type: string; className?: string; [key: string]: any }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstname') as string;
    const lastName = formData.get('lastname') as string;
    const mobile = formData.get('mobile') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;

    try {
      if (type === 'sign-up') {
        // Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName,
          lastName,
          email,
          mobile,
          city,
          country,
          createdAt: new Date(),
        });

      } else {
        // Sign in user
        await signInWithEmailAndPassword(auth, email, password);
      }

      router.push('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error('Auth Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleAuth}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">{type === 'sign-in' ? 'Sign in to your account' : 'Create an account'}</h1>
        <p className="text-balance text-sm text-muted-foreground">
          {type === 'sign-in' ? 'Enter your email and password to sign in to your account' : 'Fill details to create your account'}
        </p>
      </div>

      <div className="grid gap-6">
        {type === 'sign-up' && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="firstname">First Name</Label>
              <Input id="firstname" name="firstname" type="text" placeholder="Your first name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" name="lastname" type="text" placeholder="Your last name" required />
            </div>
            <div className="flex gap-2">
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" name="mobile" type="tel" placeholder="123-456-7890" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" type="text" placeholder="Your city" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" type="text" placeholder="Your country" required />
            </div>
          </>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {type === 'sign-in' && (
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            )}
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Processing...' : type === 'sign-in' ? 'Log in' : 'Create account'}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
        
        <Button
            variant="outline"
            className="w-full"
            onClick={() => signInWithGoogle(router)}
        >
            <FaGoogle />
            {isLoading ? 'Processing...' : 'Login with Google'}
        </Button>
        
      </div>
      <div className="text-center text-sm">
        {type === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
        <a href={type === 'sign-in' ? '/sign-up' : 'sign-in'} className="underline underline-offset-4">
          {type === 'sign-in' ? 'Create an account' : 'Sign in'}
        </a>
      </div>
    </form>
  );
};

export default AuthForm;
