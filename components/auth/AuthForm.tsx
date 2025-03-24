"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { FaGoogle } from "react-icons/fa"

const provider = new GoogleAuthProvider()
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

        // Save user data to localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            name: userData?.firstName || user.displayName || "User",
            email: user.email,
            ...userData,
          }),
        )

        // Navigate to home with user data
        router.push(
          `/home-main`,
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

      // Get the user data (either existing or newly created)
      const userData = userDoc.exists()
        ? userDoc.data()
        : {
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ")[1] || "",
          }

      // Save user data to localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          name: userData.firstName || user.displayName || "User",
          email: user.email,
          ...userData,
        }),
      )

      // Navigate to home with user data
      router.push(`/home-main?uid=${user.uid}&name=${user.displayName || "User"}&email=${user.email}`)
    } catch (error: any) {
      console.error("Google Sign In Error:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "sign-in" ? "Login" : "Register"}</CardTitle>
        <CardDescription>
          {type === "sign-in" ? "Enter your email and password to login" : "Enter your details to create an account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-4">
            {type === "sign-up" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading ? "Loading..." : type === "sign-in" ? "Login" : "Register"}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
          <FaGoogle />
          {isLoading ? "Processing..." : "Login with Google"}
        </Button>
      </CardContent>
      <div className="text-center text-sm pb-8">
        {type === 'sign-in' ? "Don't have an account? " : 'Already have an account? '}
        <a href={type === 'sign-in' ? '/sign-up' : 'sign-in'} className="underline underline-offset-4">
          {type === 'sign-in' ? 'Create an account' : 'Sign in'}
        </a>
      </div>
    </Card>
  )
}

