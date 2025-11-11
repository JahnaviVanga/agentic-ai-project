"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2 } from "lucide-react"

interface FormData {
  name: string
  monthlyIncome: number
  monthlySavingsGoal: number
  expenses: {
    groceries: number
    entertainment: number
    utilities: number
    transportation: number
    others: number
  }
}

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    monthlyIncome: 0,
    monthlySavingsGoal: 0,
    expenses: {
      groceries: 0,
      entertainment: 0,
      utilities: 0,
      transportation: 0,
      others: 0,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number.parseFloat(value) || 0,
    }))
  }

  const handleExpenseChange = (category: keyof typeof formData.expenses, value: number) => {
    setFormData((prev) => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const financialData = {
        ...formData,
        totalExpenses: Object.values(formData.expenses).reduce((a, b) => a + b, 0),
      }

      // ✅ Save locally and redirect
      localStorage.setItem("userFinancialData", JSON.stringify(financialData))
      router.push("/dashboard?userId=user1")
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("Error saving your data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const totalExpenses = Object.values(formData.expenses).reduce((a, b) => a + b, 0)
  const remainingIncome = formData.monthlyIncome - totalExpenses - formData.monthlySavingsGoal

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-5">
            Let’s Understand Your Finances
          </h1>
          <p className="text-2xl text-gray-700">
            Share your financial details, and we'll create a personalized dashboard with insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Personal Info Card */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Your basic details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-3">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Monthly Income (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome || ""}
                    onChange={handleInputChange}
                    placeholder="50000"
                    className="w-full px-5 py-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Monthly Savings Goal (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlySavingsGoal"
                    value={formData.monthlySavingsGoal || ""}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className="w-full px-5 py-4 rounded-lg border-2 border-gray-200 text-lg focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold">Monthly Expense Breakdown</CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Categorize your spending
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 space-y-8">
              {Object.entries(formData.expenses).map(([key, value]) => {
                const categoryNames: Record<string, string> = {
                  groceries: "Groceries & Food",
                  entertainment: "Entertainment",
                  utilities: "Utilities (Electricity, Water, etc.)",
                  transportation: "Transportation",
                  others: "Other Expenses",
                }

                const colorClasses: Record<string, string> = {
                  groceries: "green",
                  entertainment: "blue",
                  utilities: "purple",
                  transportation: "orange",
                  others: "red",
                }

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-lg font-semibold text-gray-800">
                        {categoryNames[key]}
                      </label>
                      <span className={`text-lg font-bold text-${colorClasses[key]}-600`}>
                        ₹{value.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={formData.monthlyIncome}
                      value={value}
                      onChange={(e) =>
                        handleExpenseChange(
                          key as keyof typeof formData.expenses,
                          Number.parseFloat(e.target.value)
                        )
                      }
                      className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-${colorClasses[key]}-600`}
                    />
                    <input
                      type="number"
                      value={value || ""}
                      onChange={(e) =>
                        handleExpenseChange(
                          key as keyof typeof formData.expenses,
                          Number.parseFloat(e.target.value) || 0
                        )
                      }
                      className={`w-full px-4 py-3 mt-3 rounded-lg border-2 border-gray-200 text-lg focus:border-${colorClasses[key]}-500 focus:outline-none transition`}
                    />
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-lg border-2 border-blue-200">
                  <div className="text-base text-gray-600 mb-1">Monthly Income</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ₹{formData.monthlyIncome.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-lg border-2 border-red-200">
                  <div className="text-base text-gray-600 mb-1">Total Expenses</div>
                  <div className="text-3xl font-bold text-red-600">
                    ₹{totalExpenses.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-white p-5 rounded-lg border-2 border-green-200">
                  <div className="text-base text-gray-600 mb-1">Savings Goal</div>
                  <div className="text-3xl font-bold text-green-600">
                    ₹{formData.monthlySavingsGoal.toLocaleString("en-IN")}
                  </div>
                </div>
                <div
                  className={`bg-white p-5 rounded-lg border-2 ${
                    remainingIncome >= 0 ? "border-blue-200" : "border-red-200"
                  }`}
                >
                  <div className="text-base text-gray-600 mb-1">Remaining</div>
                  <div
                    className={`text-3xl font-bold ${
                      remainingIncome >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    ₹{remainingIncome.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-7 text-xl font-semibold rounded-xl transition flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Processing...
                </>
              ) : (
                <>
                  Submit Details
                  <ArrowRight size={22} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
