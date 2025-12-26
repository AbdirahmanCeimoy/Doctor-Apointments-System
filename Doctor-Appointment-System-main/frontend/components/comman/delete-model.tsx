"use client";
import { Trash2 } from "lucide-react";

export interface ConfirmDeleteModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

const ConfirmDeleteModal = ({ show, onClose, onConfirm, itemName }: ConfirmDeleteModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Trash icon */}
        <div className="flex justify-center mb-4 mt-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">
          Confirm Deletion
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to delete {itemName ? `this ${itemName}` : "this item"}? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;

