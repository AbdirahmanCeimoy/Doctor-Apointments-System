"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type Appointment } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { EditAppointmentModal } from "@/components/doctor/edit-appointment-modal"

interface DoctorAppointmentsTableClientProps {
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

export default function DoctorAppointmentsTableClient({
  initialData,
  onRefresh,
}: DoctorAppointmentsTableClientProps) {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>(initialData)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Update appointments when initialData changes
  useEffect(() => {
    setAppointments(initialData)
  }, [initialData])

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsEditModalOpen(true)
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
      key: "symptoms",
      label: "Symptoms",
      render: (appointment) => (
        <span className="text-sm text-gray-600">
          {appointment.symptoms || "N/A"}
        </span>
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
            <Link href={`/doctor/appointments/${appointment.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="My Appointments"
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
    </>
  )
}

