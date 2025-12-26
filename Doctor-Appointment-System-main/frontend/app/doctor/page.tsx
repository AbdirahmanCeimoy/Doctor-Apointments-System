"use client"

import { useEffect, useState } from "react"
import { appointmentsAPI, doctorProfilesAPI } from "@/lib/api"
import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import DoctorDashboardCharts from "./dashboard-charts"
import { getUser } from "@/lib/auth"

function CircularProgress({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 12
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-6 h-6">
      <svg className="transform -rotate-90 w-6 h-6">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e5e7eb"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-semibold text-gray-700">{percentage}%</span>
      </div>
    </div>
  )
}

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    activeAppointments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get current logged-in user
        const currentUser = getUser()
        if (!currentUser) {
          setLoading(false)
          return
        }

        // Get doctor profile for current user
        const doctorProfile = await doctorProfilesAPI.getByUserId(currentUser.id).catch(() => null)
        if (!doctorProfile) {
          setLoading(false)
          return
        }

        // Get appointments for this doctor
        const appointments = await appointmentsAPI.getByDoctor(doctorProfile.id).catch(() => [])

        const totalAppointments = appointments.length
        const pendingAppointments = appointments.filter(
          (a) => a.status === "PENDING"
        ).length
        const confirmedAppointments = appointments.filter(
          (a) => a.status === "CONFIRMED"
        ).length
        const completedAppointments = appointments.filter(
          (a) => a.status === "COMPLETED"
        ).length
        const activeAppointments = confirmedAppointments

        setStats({
          totalAppointments,
          pendingAppointments,
          confirmedAppointments,
          completedAppointments,
          activeAppointments,
        })
      } catch (error) {
        console.error("Error fetching doctor dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Use totalAppointments for percentage calculations
  const totalForPercentage = Math.max(stats.totalAppointments, 1)

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      description: "+12% vs last month",
      icon: Calendar,
      iconBg: "bg-blue-600",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.totalAppointments / Math.max(totalForPercentage, 1)) * 100),
    },
    {
      title: "Pending Appointments",
      value: stats.pendingAppointments,
      description: "+5% vs last month",
      icon: AlertCircle,
      iconBg: "bg-yellow-500",
      trend: "up",
      trendColor: "text-yellow-600",
      progress: Math.round((stats.pendingAppointments / totalForPercentage) * 100),
    },
    {
      title: "Active Appointments",
      value: stats.activeAppointments,
      description: "+8% vs last month",
      icon: Clock,
      iconBg: "bg-green-600",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.activeAppointments / totalForPercentage) * 100),
    },
    {
      title: "Completed Appointments",
      value: stats.completedAppointments,
      description: "+15% vs last month",
      icon: CheckCircle,
      iconBg: "bg-purple-600",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.completedAppointments / totalForPercentage) * 100),
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg p-4 relative overflow-hidden shadow-sm border border-gray-200"
          >
            {/* Circular Progress Indicator - Top Right */}
            <div className="absolute top-2 right-2">
              <CircularProgress percentage={stat.progress} />
            </div>

            {/* Icon - Top Left */}
            <div className={`${stat.iconBg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>

            {/* Main Value */}
            <div className="text-2xl font-bold text-gray-900 mb-0.5">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-gray-700 text-xs font-medium mb-2">
              {stat.title}
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-1">
              {stat.trend === "up" ? (
                <TrendingUp className={`h-3 w-3 ${stat.trendColor}`} />
              ) : (
                <TrendingDown className={`h-3 w-3 ${stat.trendColor}`} />
              )}
              <span className={`text-xs ${stat.trendColor}`}>
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <DoctorDashboardCharts stats={stats} />
    </div>
  )
}
