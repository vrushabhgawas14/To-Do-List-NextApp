"use client";

import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-purple-950 border border-gray-400 p-6 rounded-2xl shadow-sm shadow-black max-w-sm w-full sm:w-[90%]">
        <p className="text-center text-gray-200 font-semibold">{message}</p>

        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
