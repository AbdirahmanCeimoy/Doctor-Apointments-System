"use client"

import { useState, useEffect } from "react"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type DoctorProfile, timeSlotsAPI, type TimeSlot } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { DoctorAvailabilityModal } from "@/components/patient/doctor-availability-modal"

interface PatientDoctorsTableClientProps {
  initialData: DoctorProfile[]
}

export default function PatientDoctorsTableClient({
  initialData,
}: PatientDoctorsTableClientProps) {
  const [doctors, setDoctors] = useState<DoctorProfile[]>(initialData)
  const [doctorTimeSlots, setDoctorTimeSlots] = useState<Record<string, TimeSlot[]>>({})
  const [allDoctorTimeSlots, setAllDoctorTimeSlots] = useState<Record<string, TimeSlot[]>>({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null)

  useEffect(() => {
    setDoctors(initialData)
    
    // Fetch time slots for all doctors
    async function fetchTimeSlots() {
      const timeSlotsMap: Record<string, TimeSlot[]> = {}
      const allTimeSlotsMap: Record<string, TimeSlot[]> = {}
      for (const doctor of initialData) {
        try {
          const slots = await timeSlotsAPI.getByDoctor(doctor.id)
          const availableSlots = slots.filter(slot => slot.isAvailable)
          timeSlotsMap[doctor.id] = availableSlots
          allTimeSlotsMap[doctor.id] = slots // Store all slots for modal
        } catch (error) {
          console.error(`Error fetching time slots for doctor ${doctor.id}:`, error)
          timeSlotsMap[doctor.id] = []
          allTimeSlotsMap[doctor.id] = []
        }
      }
      setDoctorTimeSlots(timeSlotsMap)
      setAllDoctorTimeSlots(allTimeSlotsMap)
    }

    if (initialData.length > 0) {
      fetchTimeSlots()
    }
  }, [initialData])

  const formatAvailability = (slots: TimeSlot[], doctor: DoctorProfile) => {
    if (!slots || slots.length === 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">No availability set</span>
        </div>
      )
    }

    // Get unique days
    const uniqueDays = [...new Set(slots.map(slot => slot.dayOfWeek))]
    const dayOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]
    const sortedDays = uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))

    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-1">
          {sortedDays.slice(0, 3).map(day => (
            <Badge key={day} variant="outline" className="text-xs">
              {day.charAt(0) + day.slice(1).toLowerCase()}
            </Badge>
          ))}
          {sortedDays.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{sortedDays.length - 3} more
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs"
          onClick={() => {
            setSelectedDoctor(doctor)
            setIsModalOpen(true)
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      </div>
    )
  }

  const columns: Column<DoctorProfile>[] = [
    {
      key: "user",
      label: "Doctor Name",
      render: (doctor) => (
        <span className="font-medium">
          {doctor.user?.fullName || "N/A"}
        </span>
      ),
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (doctor) => (
        <Badge variant="secondary">{doctor.specialization}</Badge>
      ),
    },
    {
      key: "experience",
      label: "Experience",
      render: (doctor) => `${doctor.experience} years`,
    },
    {
      key: "consultationFee",
      label: "Consultation Fee",
      render: (doctor) => `$${doctor.consultationFee.toFixed(2)}`,
    },
    {
      key: "availability",
      label: "Available Days",
      render: (doctor) => formatAvailability(doctorTimeSlots[doctor.id] || [], doctor),
    },
  ]

  return (
    <>
      <DataTable
        title="All Doctors"
        columns={columns}
        data={doctors}
        showAddButton={false}
        searchPlaceholder="Search doctors..."
      />
      <DoctorAvailabilityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        doctor={selectedDoctor}
        timeSlots={selectedDoctor ? (allDoctorTimeSlots[selectedDoctor.id] || []) : []}
      />
    </>
  )
}

