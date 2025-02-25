'use client';

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Wallet, Calendar, User, Loader, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { UserProp } from "@/types";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData, logout, updateUserData } from "@/lib/auth";


const profileSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  mobile: z.string().min(10, "Invalid mobile number"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserProp | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading && !user) {
        router.push('/sign-in');
      }
      try {
        setUserData(await getUserData());
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [user, loading, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData, reset]);

  if (!userData) {
    return <div className="w-full h-screen flex justify-center items-center animate-spin overflow-hidden"> <Loader2 /> </div>;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      console.log("Updating profile:", data);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      await updateUserData(data);

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/sign-in");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const firstNameInitial = getValues("firstName")?.charAt(0) || "";

  return (
    <div className="min-h-screen bg-background">
      <div>
        <Button variant="ghost" onClick={() => router.push('/')} className="ml-1 mt-3">
          <IoIosArrowBack className="text-2xl"/>
          Back
        </Button>
      </div>
      <div className="mx-auto max-w-4xl space-y-8 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-primary/10">
              <AvatarFallback className="text-2xl bg-primary/5">
                {firstNameInitial}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          {/* Render an Alert Box */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">Sign Out</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will be signed out of your account. You can sign back in at
                  any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSignOut}>
                  Sign Out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="inline-flex h-12 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full sm:w-auto">
            <TabsTrigger
              value="details"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <User className="h-4 w-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Reservations
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-5 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="space-y-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        aria-invalid={!!errors.firstName}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-destructive">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        aria-invalid={!!errors.lastName}
                      />
                      {errors.lastName && (
                        <p className="text-sm text-destructive">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        aria-invalid={!!errors.email}
                        disabled
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        {...register("mobile")}
                        aria-invalid={!!errors.mobile}
                      />
                      {errors.mobile && (
                        <p className="text-sm text-destructive">
                          {errors.mobile.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        aria-invalid={!!errors.city}
                      />
                      {errors.city && (
                        <p className="text-sm text-destructive">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        aria-invalid={!!errors.country}
                      />
                      {errors.country && (
                        <p className="text-sm text-destructive">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    {/* Later Add a Dialog Box with password confirmation before saving changes */}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="reservations"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Reservations</CardTitle>
                <CardDescription>View and manage your bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Reservations</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't made any reservations yet
                  </p>
                  <Button className="mt-6" size="lg">
                    Make a Reservation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="wallet"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Wallet</CardTitle>
                <CardDescription>
                  Manage your payment methods and balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Wallet className="h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">Wallet Empty</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add a payment method to get started
                  </p>
                  <Button className="mt-6" size="lg">
                    Add Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;