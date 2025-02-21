import { auth, db } from "./firebase"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

// Sign Up Function
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
