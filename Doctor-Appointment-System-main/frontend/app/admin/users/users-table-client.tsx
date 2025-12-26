"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type User, usersAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { AddUserModal } from "@/components/admin/add-user-modal"
import { EditUserModal } from "@/components/admin/edit-user-modal"
import ConfirmDeleteModal from "@/components/comman/delete-model"

interface UsersTableClientProps {
  initialData: User[]
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default"
    case "DOCTOR":
      return "secondary"
    case "PATIENT":
      return "outline"
    default:
      return "outline"
  }
}

export default function UsersTableClient({
  initialData,
}: UsersTableClientProps) {
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleSuccess = () => {
    router.refresh()
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDelete = (user: User) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      await usersAPI.delete(selectedUser.id)
      handleSuccess()
      setIsDeleteModalOpen(false)
      setSelectedUser(null)
    } catch (error: any) {
      console.error("Error deleting user:", error)
      alert(error?.message || "Failed to delete user. Please try again.")
    }
  }

  const columns: Column<User>[] = [
    {
      key: "fullName",
      label: "Name",
      render: (user) => <span className="font-medium">{user.fullName}</span>,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phoneNumber",
      label: "Phone",
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      render: (user) =>
        user.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString()
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(user)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(user)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="All Users"
        columns={columns}
        data={initialData}
        onAddClick={() => setIsAddModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search users..."
      />
      <AddUserModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleSuccess}
      />
      <EditUserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        user={selectedUser}
      />
      <ConfirmDeleteModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        onConfirm={confirmDelete}
        itemName="user"
      />
    </>
  )
}
