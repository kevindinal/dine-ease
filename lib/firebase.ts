// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { collection, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAA1TVHSfTzrK8f2WjFzNff2ipa3NgKRok",
  authDomain: "dineease-5d29a.firebaseapp.com",
  projectId: "dineease-5d29a",
  storageBucket: "dineease-5d29a.firebasestorage.app",
  messagingSenderId: "301500898334",
  appId: "1:301500898334:web:a85f896484899bd7d1620f",
  measurementId: "G-NQR3NKDH1E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);

export const getRestaurantDetails = async (restaurant_Id: string) => {
  try {
    const docRef = doc(db, "restaurants", restaurant_Id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      }
    } else {
      console.log("No such document!");
      return null;
    }

  } catch (error) {
    console.error("Error getting restaurant: ", error);
    return null;
    
  }
};
export const getMealsByRestaurant = async (restaurant_Id: string) => {
  try {
    //Query the meals collection for meals with the restaurant
    const mealsQuery = query(collection(db, "meals"), where("restaurant_id", "==", restaurant_Id));
    const mealsSnapshot = await getDocs(mealsQuery);
    
    //Concerting the snapshot to an array of objects
    return mealsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting meals: ", error);
    return [];
  }
};

export const getMealsByCategoryInRestaurant = async (restaurant_Id: string, category_Id: string) => {
  try {
    const mealsQuery = query(collection(db, "meals"), where("restaurant_id", "==", restaurant_Id), where("category", "==", category_Id));

    const mealsSnapshot = await getDocs(mealsQuery);

    return mealsSnapshot.docs.map((doc) => ({
      id: doc.id, 
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting meals: ", error);
    return [];
  }
};

export const getCategoriesByRestaurant = async (restaurant_Id: string) => {
  try {
    const categoryQuery = query(collection(db, "categories"), where("restaurant_id", "==", restaurant_Id));
    const categorySnapshot = await getDocs(categoryQuery);

    return categorySnapshot.docs.map((doc) => ({ 
      id: doc.id,
      ...doc.data
    }));
  } catch (error) {
    console.error("Error getting categories: ", error);
    return [];
  }
}