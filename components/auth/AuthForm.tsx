'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useAuthState } from 'react-firebase-hooks/auth';

const provider = new GoogleAuthProvider();

const authFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  mobile: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

type AuthFormSchema = z.infer<typeof authFormSchema>;

const AuthForm = ({ type, className, ...props }: { type: string; className?: string; [key: string]: any }) => {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormSchema>({
    resolver: zodResolver(authFormSchema),
  });

  const handleAuth = async (data: AuthFormSchema) => {
    setIsLoading(true);

    const { email, password, firstname, lastname, mobile, city, country } = data;

    try {
      if (type === 'sign-up') {
        // Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: firstname,
          lastName: lastname,
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

      router.push('/'); // Redirect to dashboard
    } catch (error: any) {
      console.error('Auth Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props} onSubmit={handleSubmit(handleAuth)}>
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
              <Input id="firstname" {...register('firstname')} type="text" placeholder="Your first name" />
              {errors.firstname && <p className="text-red-500">{errors.firstname.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">Last Name</Label>
              <Input id="lastname" {...register('lastname')} type="text" placeholder="Your last name" />
              {errors.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
            </div>
            <div className="flex gap-2">
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input id="mobile" {...register('mobile')} type="tel" placeholder="123-456-7890" />
                {errors.mobile && <p className="text-red-500">{errors.mobile.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} type="text" placeholder="Your city" />
                {errors.city && <p className="text-red-500">{errors.city.message}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register('country')} type="text" placeholder="Your country" />
              {errors.country && <p className="text-red-500">{errors.country.message}</p>}
            </div>
          </>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} type="email" placeholder="m@example.com" required />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
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
          <Input id="password" {...register('password')} type="password" required />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
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