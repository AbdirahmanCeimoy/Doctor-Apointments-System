"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type Appointment, appointmentsAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { EditAppointmentModal } from "@/components/admin/edit-appointment-modal"
import ConfirmDeleteModal from "@/components/comman/delete-model"

interface AppointmentsTableClientProps {
  initialData: Appointment[]
  onRefresh?: () => void
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "success"
    case "PENDING":
      return "warning"
    case "COMPLETED":
      return "default"
    case "CANCELLED":
      return "destructive"
    default:
      return "outline"
  }
}

export default function AppointmentsTableClient({
  initialData,
  onRefresh,
}: AppointmentsTableClientProps) {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>(initialData)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Update appointments when initialData changes
  useEffect(() => {
    setAppointments(initialData)
  }, [initialData])

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditModalOpen(true)
  }

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedAppointment) return

    try {
      await appointmentsAPI.delete(selectedAppointment.id)
      handleSuccess()
      setIsDeleteModalOpen(false)
      setSelectedAppointment(null)
    } catch (error: any) {
      console.error("Error deleting appointment:", error)
      alert(error?.message || "Failed to delete appointment. Please try again.")
    }
  }

  const handleSuccess = async () => {
    if (onRefresh) {
      await onRefresh()
    } else {
      router.refresh()
    }
  }

  const columns: Column<Appointment>[] = [
    {
      key: "patient",
      label: "Patient",
      render: (appointment) => (
        <span className="font-medium">
          {appointment.patient?.fullName || "N/A"}
        </span>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (appointment) =>
        appointment.doctor?.user?.fullName || "N/A",
    },
    {
      key: "appointmentDate",
      label: "Date",
      render: (appointment) =>
        format(new Date(appointment.appointmentDate), "MMM dd, yyyy"),
    },
    {
      key: "time",
      label: "Time",
      render: (appointment) =>
        `${appointment.startTime} - ${appointment.endTime}`,
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <Badge variant={getStatusBadgeVariant(appointment.status)}>
          {appointment.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (appointment) => (
        <div className="flex justify-end gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleEdit(appointment)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/appointments/${appointment.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="All Appointments"
        columns={columns}
        data={appointments}
        showAddButton={false}
        searchPlaceholder="Search appointments..."
      />
      <EditAppointmentModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        appointment={selectedAppointment}
      />
      <ConfirmDeleteModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedAppointment(null)
        }}
        onConfirm={confirmDelete}
        itemName="appointment"
      />
    </>
  )
}
