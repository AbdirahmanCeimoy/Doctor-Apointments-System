"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type Appointment } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { AddAppointmentModal } from "@/components/patient/add-appointment-modal"

interface PatientAppointmentsTableClientProps {
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

export default function PatientAppointmentsTableClient({
  initialData,
  onRefresh,
}: PatientAppointmentsTableClientProps) {
  const router = useRouter()
  const [appointments, setAppointments] = useState<Appointment[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Update appointments when initialData changes
  useEffect(() => {
    setAppointments(initialData)
  }, [initialData])

  const handleSuccess = async () => {
    if (onRefresh) {
      await onRefresh()
    } else {
      router.refresh()
    }
  }

  const columns: Column<Appointment>[] = [
    {
      key: "doctor",
      label: "Doctor",
      render: (appointment) => (
        <span className="font-medium">
          {appointment.doctor?.user?.fullName || "N/A"}
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
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/patient/appointments/${appointment.id}`}>
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
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search appointments..."
      />
      <AddAppointmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}

