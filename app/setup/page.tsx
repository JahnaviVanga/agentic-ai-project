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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Let's understand your finances</h1>
          <p className="text-xl text-gray-600">
            Share your financial details and we'll create a personalized dashboard with insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <CardTitle>Personal Information</CardTitle>
              <CardDescription className="text-blue-100">Your basic details</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income (₹)</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome || ""}
                    onChange={handleInputChange}
                    placeholder="50000"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Savings Goal (₹)</label>
                  <input
                    type="number"
                    name="monthlySavingsGoal"
                    value={formData.monthlySavingsGoal || ""}
                    onChange={handleInputChange}
                    placeholder="10000"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expense Breakdown Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle>Monthly Expense Breakdown</CardTitle>
              <CardDescription className="text-green-100">Categorize your spending</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Groceries */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Groceries & Food</label>
                    <span className="text-sm font-semibold text-green-600">
                      ₹{formData.expenses.groceries.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={formData.monthlyIncome}
                    value={formData.expenses.groceries}
                    onChange={(e) => handleExpenseChange("groceries", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <input
                    type="number"
                    value={formData.expenses.groceries || ""}
                    onChange={(e) => handleExpenseChange("groceries", Number.parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none transition"
                  />
                </div>

                {/* Entertainment */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Entertainment</label>
                    <span className="text-sm font-semibold text-blue-600">
                      ₹{formData.expenses.entertainment.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={formData.monthlyIncome}
                    value={formData.expenses.entertainment}
                    onChange={(e) => handleExpenseChange("entertainment", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <input
                    type="number"
                    value={formData.expenses.entertainment || ""}
                    onChange={(e) => handleExpenseChange("entertainment", Number.parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Utilities */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Utilities (Electricity, Water, etc.)</label>
                    <span className="text-sm font-semibold text-purple-600">
                      ₹{formData.expenses.utilities.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={formData.monthlyIncome}
                    value={formData.expenses.utilities}
                    onChange={(e) => handleExpenseChange("utilities", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <input
                    type="number"
                    value={formData.expenses.utilities || ""}
                    onChange={(e) => handleExpenseChange("utilities", Number.parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition"
                  />
                </div>

                {/* Transportation */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Transportation</label>
                    <span className="text-sm font-semibold text-orange-600">
                      ₹{formData.expenses.transportation.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={formData.monthlyIncome}
                    value={formData.expenses.transportation}
                    onChange={(e) => handleExpenseChange("transportation", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <input
                    type="number"
                    value={formData.expenses.transportation || ""}
                    onChange={(e) => handleExpenseChange("transportation", Number.parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition"
                  />
                </div>

                {/* Others */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-semibold text-gray-700">Other Expenses</label>
                    <span className="text-sm font-semibold text-red-600">
                      ₹{formData.expenses.others.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={formData.monthlyIncome}
                    value={formData.expenses.others}
                    onChange={(e) => handleExpenseChange("others", Number.parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                  <input
                    type="number"
                    value={formData.expenses.others || ""}
                    onChange={(e) => handleExpenseChange("others", Number.parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 mt-2 rounded-lg border-2 border-gray-200 focus:border-red-500 focus:outline-none transition"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-green-50">
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                  <div className="text-sm text-gray-600 mb-1">Monthly Income</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{formData.monthlyIncome.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-red-200">
                  <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
                  <div className="text-2xl font-bold text-red-600">₹{totalExpenses.toLocaleString("en-IN")}</div>
                </div>
                <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Savings Goal</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{formData.monthlySavingsGoal.toLocaleString("en-IN")}
                  </div>
                </div>
                <div
                  className={`bg-white p-4 rounded-lg border-2 ${remainingIncome >= 0 ? "border-blue-200" : "border-red-200"}`}
                >
                  <div className="text-sm text-gray-600 mb-1">Remaining</div>
                  <div className={`text-2xl font-bold ${remainingIncome >= 0 ? "text-blue-600" : "text-red-600"}`}>
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
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                <>
                  Submit Details
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
