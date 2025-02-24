import { UserProp } from "@/types";
import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";



// Sign Up Function
/**
 * Signs up a new user with the provided details.
 *
 * @param email - The email address of the user.
 * @param password - The password for the user's account.
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param mobile - The mobile number of the user.
 * @param city - The city where the user resides.
 * @param country - The country where the user resides.
 * @returns A promise that resolves to the created user object.
 * @throws An error if the email already exists or if there is an issue during the sign-up process.
 */
export const signUp = async (email: string, password: string, firstName: string, lastName: string, mobile: string, city: string, country: string) => {
    
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  
  try {
        // Check if the email already exists
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            throw new Error("User with this email already exists!");
        }

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(email, password);
        const user = userCredential!.user;

        // Store additional user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            firstName,
            lastName,
            email,
            mobile,
            city,
            country,
            createdAt: new Date(),
        });

        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Sign In Function
export const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Google Sign-In
const provider = new GoogleAuthProvider();
export const signInWithGoogle = async (router: any) => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Save user to Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                firstName: user.displayName,
                lastName: "",
                email: user.email,
                mobile: "",
                city: "",
                country: "",
                // photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }

        // Navigate to dashboard
        router.push("/");

        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message);
    }
};


// Function to get user data
export const getUserData = async (): Promise<UserProp> => {
    try {
        // Get the currently signed-in user
        const user = auth.currentUser;

        console.log(user);

        if (!user) {
            throw new Error("No user is currently signed in.");
        }

        // Reference to the user's document in Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            throw new Error("User data not found.");
        }

        // Return the user data
        return userSnap.data() as UserProp;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Function to update user data
export const updateUserData = async (userData: Partial<UserProp>): Promise<void> => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error("No user is currently signed in.");
        }

        const userRef = doc(db, "users", user.uid);

        // Update the document with the provided userData
        await updateDoc(userRef, userData);

        console.log("User data updated successfully.");
    } catch (error: any) {
        throw new Error(`Failed to update user data: ${error.message}`);
    }
};