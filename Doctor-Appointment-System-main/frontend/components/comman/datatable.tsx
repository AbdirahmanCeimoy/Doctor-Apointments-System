"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Column<T = any> {
  key: string
  label: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T = any> {
  title: string
  columns: Column<T>[]
  data?: T[]
  onAddClick?: () => void
  showAddButton?: boolean
  searchPlaceholder?: string
}

export default function DataTable<T extends { id?: string; _id?: string }>({
  title,
  columns,
  data = [],
  onAddClick,
  showAddButton = true,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [filteredData, setFilteredData] = useState<T[]>(data)
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (Array.isArray(data)) {
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val || "").toLowerCase().includes(search.toLowerCase())
        )
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    } else {
      setFilteredData([])
    }
  }, [search, data])

  const startIdx = (currentPage - 1) * entriesPerPage
  const endIdx = startIdx + entriesPerPage
  const totalPages = Math.ceil(filteredData.length / entriesPerPage)
  const paginatedData = filteredData.slice(startIdx, endIdx)

  const getCellValue = (row: T, col: Column<T>) => {
    if (col.render) {
      return col.render(row)
    }

    const keys = col.key.split(".")
    let value: any = row
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined || value === null) break
    }

    if (value === undefined || value === null || value === "") {
      return "-"
    }

    if (React.isValidElement(value)) {
      return value
    }

    if (Array.isArray(value)) {
      return value.join(", ")
    }

    if (typeof value === "object") {
      return JSON.stringify(value)
    }

    return String(value)
  }

  return (
    <div className="p-4 bg-white text-gray-900 rounded-xl shadow-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {showAddButton && onAddClick && (
          <Button
            onClick={onAddClick}
            className="bg-[#03045E] hover:bg-[#03045E]/90 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">
            Show
          </label>
          <Select
            value={String(entriesPerPage)}
            onValueChange={(value) => setEntriesPerPage(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-8 border border-gray-300 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50, 100].map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            entries
          </span>
        </div>

        <Input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full sm:w-64 border border-gray-300 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#03045E] text-white">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key || i}
                  className="px-4 py-3 uppercase text-xs font-medium"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center text-gray-500 bg-gray-50"
                >
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={(row.id || row._id || idx).toString()}
                  className="bg-gray-50 text-gray-900 border-b border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  {columns.map((col, i) => (
                    <td key={col.key || i} className="px-4 py-3">
                      {getCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-sm text-gray-600">
        <span>
          {filteredData.length === 0
            ? "0 entries"
            : `${startIdx + 1}–${Math.min(
                endIdx,
                filteredData.length
              )} of ${filteredData.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-2">
            {currentPage} of {totalPages || 1}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 text-black disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
