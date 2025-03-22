import type { Metadata } from "next"
import ProfileDashboard from "../components/profile/profile-dashboard"

export const metadata: Metadata = {
  title: "My Profile | DineEase",
  description: "Manage your orders, reservations and account settings",
}

export default function ProfilePage() {
  return <ProfileDashboard />
}