"use client"

import { useEffect, useState } from "react"
import { doctorProfilesAPI, usersAPI, type DoctorProfile, type User } from "@/lib/api"
import DoctorProfileClient from "./profile-client"
import { getUser } from "@/lib/auth"

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDoctorProfile() {
      try {
        const currentUser = getUser()
        if (!currentUser || currentUser.role !== "DOCTOR") {
          setLoading(false)
          return
        }

        // Get doctor profile by user ID
        const doctorProfile = await doctorProfilesAPI.getByUserId(currentUser.id)
        if (doctorProfile) {
          setProfile(doctorProfile)
          // User data is already available from auth, but we can also fetch it
          const userData = await usersAPI.getById(currentUser.id).catch(() => currentUser)
          setUser(userData || currentUser)
        } else {
          // If no profile exists, still show user info
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorProfile()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">No profile found. Please create a doctor profile.</p>
      </div>
    )
  }

  return <DoctorProfileClient profile={profile} user={user} />
}

