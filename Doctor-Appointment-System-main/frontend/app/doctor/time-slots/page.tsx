"use client"

import { useEffect, useState, useCallback } from "react"
import { timeSlotsAPI, doctorProfilesAPI, type TimeSlot } from "@/lib/api"
import DoctorTimeSlotsTableClient from "./time-slots-table-client"
import { getUser } from "@/lib/auth"

export default function DoctorTimeSlotsPage() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTimeSlots = useCallback(async () => {
    setLoading(true)
    try {
      const currentUser = getUser()
      if (!currentUser || currentUser.role !== "DOCTOR") {
        setTimeSlots([])
        return
      }

      const doctorProfile = await doctorProfilesAPI.getByUserId(currentUser.id).catch(() => null)
      if (!doctorProfile) {
        setTimeSlots([])
        return
      }

      const fetchedTimeSlots = await timeSlotsAPI.getByDoctor(doctorProfile.id)
      setTimeSlots(fetchedTimeSlots)
    } catch (error) {
      console.error("Error fetching doctor time slots:", error)
      setTimeSlots([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchTimeSlots])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading time slots...</p>
      </div>
    )
  }

  return <DoctorTimeSlotsTableClient initialData={timeSlots} onRefresh={fetchTimeSlots} />
}

