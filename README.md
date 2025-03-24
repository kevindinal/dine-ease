# DineEase

DineEase is a modern restaurant booking and meal pre-ordering web application designed to streamline the dining experience. Built with **Next.js**, **Firebase Firestore**, and **ShadCN**, it enables users to reserve tables, pre-order meals, and receive real-time updates on their orders via **Firebase Cloud Messaging (FCM)**.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Restaurant Table Reservations** – Seamless table booking for users.
- **Meal Pre-Ordering** – Users can place orders before arriving at the restaurant.
- **Real-Time Order Status Tracking** – Live order updates using Firebase Firestore and FCM.
- **User Authentication & Authorization** – Secure login and user roles with Firebase Authentication.
- **Admin Dashboard** – Manage restaurant reservations and meal orders efficiently.
- **Push Notifications** – Stay updated with real-time notifications via Firebase Cloud Messaging.

## Tech Stack

### Frontend
- **Next.js** – Server-side rendering and static site generation.
- **ShadCN** – Modern UI components for an intuitive user experience.

### Backend & Database
- **Firebase Firestore** – Real-time NoSQL database.
- **Firebase Authentication** – Secure user authentication.

### Additional Services
- **Firebase Cloud Messaging (FCM)** – Real-time push notifications.
- **Vercel** – Deployment and hosting.

## Installation

### Prerequisites
Ensure you have the following installed:
- **Node.js** (>=16.x)
- **npm** or **yarn**
- **Firebase CLI** (for deployment)

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/kevindinal/dine-ease.git
   ```
2. Navigate to the project directory:
   ```sh
   cd dine-ease
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Configuration

### Firebase Setup
1. Create a **Firebase Project** at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Firestore Database**, **Authentication**, and **Cloud Messaging**.
3. Retrieve your Firebase configuration and add it to a `.env.local` file:
   ```ini
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### Running the Application
Start the development server:
```sh
npm run dev
```
Then open `http://localhost:3000` in your browser.

## Deployment

### Deploying to Vercel
```sh
vercel deploy
```

### Deploying to Firebase Hosting
```sh
firebase deploy
```

## Contributing

Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new feature branch:
   ```sh
   git checkout -b feature-branch
   ```
3. Implement your changes and commit:
   ```sh
   git commit -m "Add new feature"
   ```
4. Push the branch:
   ```sh
   git push origin feature-branch
   ```
5. Create a Pull Request (PR) for review.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## Contact
For any inquiries or collaboration opportunities, connect with [@kevindinal](https://github.com/kevindinal).

