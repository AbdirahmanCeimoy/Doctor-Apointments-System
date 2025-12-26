"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usersAPI, type UserRole, type User } from "@/lib/api"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user: User | null
}

export function EditUserModal({ open, onOpenChange, onSuccess, user }: EditUserModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    role: "PATIENT" as UserRole,
  })

  useEffect(() => {
    if (open && user) {
      setFormData({
        email: user.email || "",
        password: "", // Don't pre-fill password
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
        address: user.address || "",
        role: user.role || "PATIENT",
      })
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    try {
      const updateData: any = {
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      if (formData.dateOfBirth) {
        updateData.dateOfBirth = formData.dateOfBirth
      }

      if (formData.address) {
        updateData.address = formData.address
      }

      await usersAPI.update(user.id, updateData)
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating user:", error)
      const errorMessage = error?.message || "Failed to update user. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="grid gap-1.5">
              <Label htmlFor="fullName" className="text-xs">Full Name *</Label>
              <Input
                id="fullName"
                className="h-9 text-sm"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-xs">Email *</Label>
              <Input
                id="email"
                type="email"
                className="h-9 text-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password" className="text-xs">Password (leave blank to keep current)</Label>
              <Input
                id="password"
                type="password"
                className="h-9 text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phoneNumber" className="text-xs">Phone Number *</Label>
              <Input
                id="phoneNumber"
                className="h-9 text-sm"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="role" className="text-xs">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value as UserRole })
                }
                required
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">admin</SelectItem>
                  <SelectItem value="DOCTOR">doctor</SelectItem>
                  <SelectItem value="PATIENT">patient</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="dateOfBirth" className="text-xs">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                className="h-9 text-sm"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5 col-span-2">
              <Label htmlFor="address" className="text-xs">Address</Label>
              <Input
                id="address"
                className="h-9 text-sm"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

