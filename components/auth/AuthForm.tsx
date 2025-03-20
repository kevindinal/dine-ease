"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { FaGoogle } from "react-icons/fa"

const AuthFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  mobile: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

interface AuthFormProps {
  type: "sign-in" | "sign-up"
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
      city: "",
      country: "",
    },
  })

  const handleAuth = async (data: z.infer<typeof AuthFormSchema>) => {
    setIsLoading(true)

    const { email, password, firstname, lastname, mobile, city, country } = data

    try {
      if (type === "sign-up") {
        // Sign up user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Store user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: firstname,
          lastName: lastname,
          email,
          mobile,
          city,
          country,
          createdAt: new Date(),
        })
      } else {
        // Sign in user
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        // Navigate to home with user data
        router.push(
          `/home-main?uid=${user.uid}&name=${userData?.firstName || user.displayName || "User"}&email=${user.email}`,
        )
        return // Early return to prevent the default redirect
      }

      // Default redirect for sign-up
      router.push("/")
    } catch (error: any) {
      console.error("Auth Error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsLoading(true)
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in Firestore, if not create a new document
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email,
          createdAt: new Date(),
        })
      }

      // Navigate to home with user data
      router.push(`/home-main?uid=${user.uid}&name=${user.displayName || "User"}&email=${user.email}`)
    } catch (error: any) {
      console.error("Google Sign In Error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  
}

