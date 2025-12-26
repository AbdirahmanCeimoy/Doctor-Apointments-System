"use client"

import { useEffect, useState, useCallback } from "react"
import { appointmentsAPI } from "@/lib/api"
import PatientAppointmentsTableClient from "./appointments-table-client"
import { getUser } from "@/lib/auth"

export default function PatientAppointmentsPage() {
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

      // Get appointments for this patient
      const patientAppointments = await appointmentsAPI.getByPatient(currentUser.id).catch(() => [])
      setAppointments(patientAppointments)
    } catch (error) {
      console.error("Error fetching patient appointments:", error)
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

  return <PatientAppointmentsTableClient initialData={appointments} onRefresh={fetchAppointments} />
}
