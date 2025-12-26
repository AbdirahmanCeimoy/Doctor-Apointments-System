"use client"

import { useEffect, useState, useCallback } from "react"
import { appointmentsAPI, type Appointment } from "@/lib/api"
import AppointmentsTableClient from "./appointments-table-client"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await appointmentsAPI.getAll()
      setAppointments(data)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setAppointments([])
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

  return (
    <div className="space-y-8">
      <AppointmentsTableClient initialData={appointments} onRefresh={fetchAppointments} />
    </div>
  )
}
