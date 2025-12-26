"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type TimeSlot, timeSlotsAPI, doctorProfilesAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { AddTimeSlotModal } from "@/components/doctor/add-time-slot-modal"
import { EditTimeSlotModal } from "@/components/doctor/edit-time-slot-modal"
import ConfirmDeleteModal from "@/components/comman/delete-model"
import { getUser } from "@/lib/auth"

interface DoctorTimeSlotsTableClientProps {
  initialData: TimeSlot[]
  onRefresh?: () => void
}

export default function DoctorTimeSlotsTableClient({
  initialData,
  onRefresh,
}: DoctorTimeSlotsTableClientProps) {
  const router = useRouter()
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(initialData)
  const [doctorId, setDoctorId] = useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  useEffect(() => {
    setTimeSlots(initialData)
  }, [initialData])

  useEffect(() => {
    async function fetchDoctorId() {
      const currentUser = getUser()
      if (!currentUser || currentUser.role !== "DOCTOR") return

      try {
        const doctorProfile = await doctorProfilesAPI.getByUserId(currentUser.id).catch(() => null)
        if (doctorProfile && doctorProfile.id) {
          setDoctorId(doctorProfile.id)
        } else {
          console.warn("Doctor profile not found. Please create a doctor profile first.")
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error)
      }
    }
    fetchDoctorId()
  }, [])

  const handleEdit = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setIsEditModalOpen(true)
  }

  const handleDelete = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTimeSlot) return

    try {
      await timeSlotsAPI.delete(selectedTimeSlot.id)
      handleSuccess()
      setIsDeleteModalOpen(false)
      setSelectedTimeSlot(null)
    } catch (error: any) {
      console.error("Error deleting time slot:", error)
      alert(error?.message || "Failed to delete time slot. Please try again.")
    }
  }

  const handleSuccess = async () => {
    if (onRefresh) {
      await onRefresh()
    } else {
      router.refresh()
    }
  }

  const columns: Column<TimeSlot>[] = [
    {
      key: "dayOfWeek",
      label: "Day of Week",
      render: (slot) => (
        <Badge variant="outline">
          {slot.dayOfWeek.charAt(0) + slot.dayOfWeek.slice(1).toLowerCase()}
        </Badge>
      ),
    },
    {
      key: "startTime",
      label: "Start Time",
    },
    {
      key: "endTime",
      label: "End Time",
    },
    {
      key: "isAvailable",
      label: "Status",
      render: (slot) => (
        <Badge variant={slot.isAvailable ? "success" : "destructive"}>
          {slot.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (slot) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(slot)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(slot)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      {!doctorId && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Doctor profile not found. Please contact an administrator to create your doctor profile before adding time slots.
          </p>
        </div>
      )}
      <DataTable
        title="My Time Slots"
        columns={columns}
        data={timeSlots}
        onAddClick={() => {
          if (!doctorId) {
            alert("Doctor profile not found. Please contact an administrator to create your doctor profile.")
            return
          }
          setIsAddModalOpen(true)
        }}
        showAddButton={true}
        searchPlaceholder="Search time slots..."
      />
      {doctorId && (
        <AddTimeSlotModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSuccess={handleSuccess}
          doctorId={doctorId}
        />
      )}
      <EditTimeSlotModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        timeSlot={selectedTimeSlot}
      />
      <ConfirmDeleteModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTimeSlot(null)
        }}
        onConfirm={confirmDelete}
        itemName="time slot"
      />
    </>
  )
}

