"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type TimeSlot, timeSlotsAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import ConfirmDeleteModal from "@/components/comman/delete-model"

interface TimeSlotsTableClientProps {
  initialData: TimeSlot[]
}

export default function TimeSlotsTableClient({
  initialData,
}: TimeSlotsTableClientProps) {
  const router = useRouter()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)

  const handleDelete = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTimeSlot) return

    try {
      await timeSlotsAPI.delete(selectedTimeSlot.id)
      router.refresh()
      setIsDeleteModalOpen(false)
      setSelectedTimeSlot(null)
    } catch (error: any) {
      console.error("Error deleting time slot:", error)
      alert(error?.message || "Failed to delete time slot. Please try again.")
    }
  }

  const columns: Column<TimeSlot>[] = [
    {
      key: "doctor",
      label: "Doctor",
      render: (slot) => (
        <span className="font-medium">
          {slot.doctor?.user?.fullName || "N/A"}
        </span>
      ),
    },
    {
      key: "dayOfWeek",
      label: "Day of Week",
      render: (slot) => <Badge variant="outline">{slot.dayOfWeek}</Badge>,
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              // TODO: Implement edit functionality for time slots
              alert("Edit functionality for time slots coming soon!")
            }}
          >
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
      <DataTable
        title="All Time Slots"
        columns={columns}
        data={initialData}
        onAddClick={() => router.push("/admin/time-slots/new")}
        showAddButton={true}
        searchPlaceholder="Search time slots..."
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
