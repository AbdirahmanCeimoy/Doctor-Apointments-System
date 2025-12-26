"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { usersAPI, type UserRole } from "@/lib/api"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    role: "" as UserRole, // Must select admin or doctor
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.role) {
        alert("Please select a role")
        setLoading(false)
        return
      }

      await usersAPI.create({
        ...formData,
        dateOfBirth: formData.dateOfBirth || undefined,
        address: formData.address || undefined,
      })
      onSuccess()
      onOpenChange(false)
      // Reset form
      setFormData({
        email: "",
        password: "",
        fullName: "",
        phoneNumber: "",
        dateOfBirth: "",
        address: "",
        role: "" as UserRole, // Reset to empty
      })
    } catch (error: any) {
      console.error("Error creating user:", error)
      const errorMessage = error?.message || "Failed to create user. Please try again."
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Create a new admin or doctor account. Patients must sign up themselves.
          </DialogDescription>
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
              <Label htmlFor="password" className="text-xs">Password *</Label>
              <Input
                id="password"
                type="password"
                className="h-9 text-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
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
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Patients must sign up themselves.
              </p>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

