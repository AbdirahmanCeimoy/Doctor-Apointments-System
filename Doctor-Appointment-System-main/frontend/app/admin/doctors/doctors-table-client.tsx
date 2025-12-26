"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type DoctorProfile, doctorProfilesAPI, timeSlotsAPI, type TimeSlot } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { AddDoctorModal } from "@/components/admin/add-doctor-modal"
import { EditDoctorModal } from "@/components/admin/edit-doctor-modal"
import ConfirmDeleteModal from "@/components/comman/delete-model"
import { DoctorAvailabilityModal } from "@/components/patient/doctor-availability-modal"

interface DoctorsTableClientProps {
  initialData: DoctorProfile[]
}

export default function DoctorsTableClient({
  initialData,
}: DoctorsTableClientProps) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<DoctorProfile[]>(initialData)
  const [doctorTimeSlots, setDoctorTimeSlots] = useState<Record<string, TimeSlot[]>>({})
  const [allDoctorTimeSlots, setAllDoctorTimeSlots] = useState<Record<string, TimeSlot[]>>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false)
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

  const handleSuccess = async () => {
    // Refresh the page to get updated data
    router.refresh()
  }

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
            setIsAvailabilityModalOpen(true)
          }}
        >
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      </div>
    )
  }

  const handleEdit = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const handleDelete = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedDoctor) return

    try {
      await doctorProfilesAPI.delete(selectedDoctor.id)
      handleSuccess()
      setIsDeleteModalOpen(false)
      setSelectedDoctor(null)
    } catch (error: any) {
      console.error("Error deleting doctor:", error)
      alert(error?.message || "Failed to delete doctor. Please try again.")
    }
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
      key: "licenseNumber",
      label: "License Number",
      render: (doctor) => (
        <span className="font-mono text-sm">{doctor.licenseNumber}</span>
      ),
    },
    {
      key: "availability",
      label: "Available Days",
      render: (doctor) => formatAvailability(doctorTimeSlots[doctor.id] || [], doctor),
    },
    {
      key: "actions",
      label: "Actions",
      render: (doctor) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/doctors/${doctor.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="All Doctors"
        columns={columns}
        data={doctors}
        onAddClick={() => setIsAddModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search doctors..."
      />
      <AddDoctorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleSuccess}
      />
      <EditDoctorModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        doctor={selectedDoctor}
      />
      <ConfirmDeleteModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedDoctor(null)
        }}
        onConfirm={confirmDelete}
        itemName="doctor"
      />
      <DoctorAvailabilityModal
        open={isAvailabilityModalOpen}
        onOpenChange={setIsAvailabilityModalOpen}
        doctor={selectedDoctor}
        timeSlots={selectedDoctor ? (allDoctorTimeSlots[selectedDoctor.id] || []) : []}
      />
    </>
  )
}
