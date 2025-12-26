"use client"

import { useEffect, useState } from "react"
import { usersAPI, type User } from "@/lib/api"
import AdminProfileClient from "./profile-client"
import { getUser } from "@/lib/auth"

export default function AdminProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminProfile() {
      try {
        const currentUser = getUser()
        if (!currentUser || currentUser.role !== "ADMIN") {
          setLoading(false)
          return
        }

        // Fetch full user data
        const userData = await usersAPI.getById(currentUser.id).catch(() => currentUser)
        setUser(userData || currentUser)
      } catch (error) {
        console.error("Error fetching admin profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminProfile()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">No profile found. Please ensure you are logged in as an admin.</p>
      </div>
    )
  }

  return <AdminProfileClient user={user} />
}

