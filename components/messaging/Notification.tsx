// // Client-side notification handling component
// // This component requests notification permissions and listens for incoming messages
// // It also saves the FCM token to the user document in Firestore

// 'use client';

// import { useEffect } from 'react';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { app, messaging } from '@/lib/firebase';
// import { doc, setDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { getAuth } from "firebase/auth";

// const Notifications = () => {
//     const auth = getAuth();

//     useEffect(() => {
//         const requestNotificationPermission = async () => {
//             try {
//                 const permission = await Notification.requestPermission();
//                 if (permission === 'granted') {
//                     console.log('Notification permission granted.');
//                     const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
//                     if (currentToken) {
//                         console.log('FCM token:', currentToken);
//                         if(auth.currentUser){
//                             await setDoc(doc(db, "users", auth.currentUser.uid),{fcmToken: currentToken},{merge:true});
//                         }
//                     } else {
//                         console.log('No registration token available. Request permission to generate one.');
//                     }
//                 } else {
//                     console.log('Unable to get permission to notify.');
//                 }
//             } catch (error) {
//                 console.error('An error occurred while retrieving token. ', error);
//             }
//         };

//         requestNotificationPermission();

//         onMessage(messaging, (payload) => {
//             console.log('Message received. ', payload);
//             if (Notification.permission === 'granted') {
//                 new Notification(payload.notification?.title || "Notification", {
//                     body: payload.notification?.body || "A new message received.",
//                 });
//             }
//         });

//     }, [auth]);

//     return null;
// };

// export default Notifications;