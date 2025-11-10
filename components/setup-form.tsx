"use client"

import type React from "react"

import { useState } from "react"
import { TrendingUp, ArrowRight } from "lucide-react"

interface SetupFormProps {
  onComplete: (data: any) => void
}

export default function SetupForm({ onComplete }: SetupFormProps) {
  const [formData, setFormData] = useState({
    income: "",
    expenses: "",
    savings: "",
    goals: "",
  })
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (stepNum === 1) {
      if (!formData.income || Number(formData.income) <= 0) {
        newErrors.income = "Please enter a valid monthly income"
      }
    } else if (stepNum === 2) {
      if (!formData.expenses || Number(formData.expenses) < 0) {
        newErrors.expenses = "Please enter valid monthly expenses"
      }
    } else if (stepNum === 3) {
      if (!formData.savings || Number(formData.savings) < 0) {
        newErrors.savings = "Please enter a valid savings amount"
      }
    } else if (stepNum === 4) {
      if (!formData.goals.trim()) {
        newErrors.goals = "Please tell us about your financial goals"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    if (validateStep(step)) {
      onComplete({
        income: Number(formData.income),
        expenses: Number(formData.expenses),
        savings: Number(formData.savings),
        goals: formData.goals,
      })
    }
  }

  const totalSavings = Math.max(0, Number(formData.income) - Number(formData.expenses))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FinanceAdvisor</h1>
          <p className="text-gray-600 mt-2">Let's set up your financial profile</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-2 flex-1 rounded-full ${s <= step ? "bg-blue-600" : "bg-gray-200"}`} />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">Step {step} of 4</p>
        </div>

        {/* Step 1: Income */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What's your monthly income?</h2>
            <p className="text-sm text-gray-600">This helps us provide personalized recommendations</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₹</span>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="50,000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.income && <p className="text-red-600 text-sm mt-1">{errors.income}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Expenses */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What are your monthly expenses?</h2>
            <p className="text-sm text-gray-600">Include rent, utilities, food, etc.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₹</span>
                <input
                  type="number"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleChange}
                  placeholder="30,000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.expenses && <p className="text-red-600 text-sm mt-1">{errors.expenses}</p>}
              {totalSavings > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  You can save ₹{totalSavings.toLocaleString("en-IN")} monthly
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Savings */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">How much do you have in savings?</h2>
            <p className="text-sm text-gray-600">Your current emergency fund or savings</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Savings (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-lg">₹</span>
                <input
                  type="number"
                  name="savings"
                  value={formData.savings}
                  onChange={handleChange}
                  placeholder="1,00,000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {errors.savings && <p className="text-red-600 text-sm mt-1">{errors.savings}</p>}
            </div>
          </div>
        )}

        {/* Step 4: Goals */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">What are your financial goals?</h2>
            <p className="text-sm text-gray-600">E.g., buy a house, retirement, travel, emergency fund</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Financial Goals</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="I want to save ₹50 lakhs for a down payment on a house in 5 years..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {errors.goals && <p className="text-red-600 text-sm mt-1">{errors.goals}</p>}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handlePrevious}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
          )}
          <button
            onClick={step === 4 ? handleSubmit : handleNext}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            {step === 4 ? "Get Started" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
