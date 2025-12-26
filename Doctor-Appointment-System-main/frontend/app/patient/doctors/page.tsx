"use client"

import { useEffect, useState } from "react"
import { doctorProfilesAPI, type DoctorProfile } from "@/lib/api"
import PatientDoctorsTableClient from "./doctors-table-client"

export default function PatientDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const fetchedDoctors = await doctorProfilesAPI.getAll()
        setDoctors(fetchedDoctors)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        setDoctors([])
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading doctors...</p>
      </div>
    )
  }

  return <PatientDoctorsTableClient initialData={doctors} />
}

