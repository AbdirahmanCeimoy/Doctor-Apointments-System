"use client"

import { useEffect, useState, useCallback } from "react"
import { appointmentsAPI, doctorProfilesAPI } from "@/lib/api"
import DoctorAppointmentsTableClient from "./appointments-table-client"
import { getUser } from "@/lib/auth"

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      // Get current logged-in user
      const currentUser = getUser()
      if (!currentUser) {
        setLoading(false)
        return
      }

      // Get doctor profile for current user
      const doctorProfile = await doctorProfilesAPI.getByUserId(currentUser.id).catch(() => null)
      if (!doctorProfile) {
        setLoading(false)
        return
      }

      // Get appointments for this doctor
      const doctorAppointments = await appointmentsAPI.getByDoctor(doctorProfile.id).catch(() => [])
      setAppointments(doctorAppointments)
    } catch (error) {
      console.error("Error fetching doctor appointments:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return <DoctorAppointmentsTableClient initialData={appointments} onRefresh={fetchAppointments} />
}
