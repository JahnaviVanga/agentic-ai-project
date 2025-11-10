"use client"

import type React from "react"

import { X, Loader2 } from "lucide-react"
import { useState } from "react"

interface ExpenseFormProps {
  onClose: () => void
  onSubmit: (expense: Expense) => void
}

interface Expense {
  category: string
  amount: number
  date: string
  description: string
  recurring: boolean
}

const EXPENSE_CATEGORIES = [
  { label: "Groceries", icon: "🛒" },
  { label: "Utilities", icon: "💡" },
  { label: "Entertainment", icon: "🎬" },
  { label: "Transportation", icon: "🚗" },
  { label: "Food & Dining", icon: "🍽️" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Health & Medical", icon: "⚕️" },
  { label: "Education", icon: "📚" },
  { label: "Travel", icon: "✈️" },
  { label: "Subscriptions", icon: "📱" },
  { label: "Insurance", icon: "🛡️" },
  { label: "Other", icon: "📌" },
]

export default function ExpenseForm({ onClose, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState<Expense>({
    category: "Groceries",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount || formData.amount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate processing
    onSubmit(formData)
    setIsLoading(false)
    setFormData({
      category: "Groceries",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      description: "",
      recurring: false,
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Add New Expense</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">Select Category</label>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.label })}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  formData.category === cat.label
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium text-gray-700 line-clamp-2">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-600 font-semibold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })}
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g., Weekly groceries, Monthly subscription..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Recurring Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.recurring}
            onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-700">This is a recurring expense</span>
        </label>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={18} className="animate-spin" />}
            Add Expense
          </button>
        </div>
      </form>
    </div>
  )
}
