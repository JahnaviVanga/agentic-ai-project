"use client"

import { Plus, AlertCircle, TrendingUp, PieChart, Trash2 } from "lucide-react"
import { useState, useMemo } from "react"
import ExpenseForm from "./expense-form"
import {
  BarChart,
  Bar,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface Expense {
  id: string
  category: string
  amount: number
  date: string
  description: string
  recurring: boolean
}

interface UserData {
  income: number
  expenses: number
  savings: number
  goals: string
}

interface ExpenseTrackerProps {
  userData: UserData
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Groceries: "#3B82F6",
  Utilities: "#10B981",
  Entertainment: "#F59E0B",
  Transportation: "#EF4444",
  "Food & Dining": "#8B5CF6",
  Shopping: "#EC4899",
  "Health & Medical": "#06B6D4",
  Education: "#6366F1",
  Travel: "#14B8A6",
  Subscriptions: "#F97316",
  Insurance: "#6B7280",
  Other: "#9CA3AF",
}

export default function ExpenseTracker({ userData }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      category: "Groceries",
      amount: 450,
      date: "2024-01-15",
      description: "Weekly groceries",
      recurring: true,
    },
    {
      id: "2",
      category: "Utilities",
      amount: 120,
      date: "2024-01-10",
      description: "Electricity bill",
      recurring: true,
    },
    {
      id: "3",
      category: "Entertainment",
      amount: 85,
      date: "2024-01-18",
      description: "Movie tickets",
      recurring: false,
    },
    {
      id: "4",
      category: "Transportation",
      amount: 200,
      date: "2024-01-17",
      description: "Fuel",
      recurring: true,
    },
  ])

  const [showForm, setShowForm] = useState(false)

  const handleAddExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([newExpense, ...expenses])
    setShowForm(false)
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id))
  }

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0)
  }, [expenses])

  const categoryData = useMemo(() => {
    const grouped = expenses.reduce(
      (acc, exp) => {
        const existing = acc.find((item) => item.category === exp.category)
        if (existing) {
          existing.value += exp.amount
        } else {
          acc.push({ category: exp.category, value: exp.amount })
        }
        return acc
      },
      [] as { category: string; value: number }[],
    )
    return grouped.sort((a, b) => b.value - a.value)
  }, [expenses])

  const monthlyTrend = useMemo(() => {
    const grouped: { [key: string]: number } = {}
    expenses.forEach((exp) => {
      const month = new Date(exp.date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })
      grouped[month] = (grouped[month] || 0) + exp.amount
    })
    return Object.entries(grouped)
      .map(([month, amount]) => ({ month, amount }))
      .slice(-6)
  }, [expenses])

  const budgetAlerts = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount
    })

    const budgets: { [key: string]: number } = {
      Groceries: 500,
      Utilities: 150,
      Entertainment: 150,
      Transportation: 250,
    }

    return Object.entries(budgets)
      .filter(([cat, budget]) => (categoryTotals[cat] || 0) > budget)
      .map(([cat, budget]) => ({
        category: cat,
        spent: categoryTotals[cat],
        budget,
        percentageOver: Math.round((((categoryTotals[cat] - budget) / budget) * 100) / 10) * 10,
      }))
  }, [expenses])

  const savingsPercentage =
    userData.income > 0 ? Math.round(((userData.income - totalExpenses) / userData.income) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Total Spending</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalExpenses.toLocaleString("en-IN")}</p>
          <p className="text-xs text-gray-600 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Monthly Income</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{userData.income.toLocaleString("en-IN")}</p>
          <p className={`text-xs mt-2 ${savingsPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {savingsPercentage}% remaining
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Budget Alerts</p>
          <p className={`text-3xl font-bold mt-2 ${budgetAlerts.length > 0 ? "text-red-600" : "text-green-600"}`}>
            {budgetAlerts.length}
          </p>
          <p className="text-xs text-gray-600 mt-2">Categories over budget</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">Transactions</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{expenses.length}</p>
          <p className="text-xs text-gray-600 mt-2">This month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Breakdown */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart size={20} /> Spending by Category
          </h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChartComponent>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, value }) => `₹${(value / 1000).toFixed(1)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`cell-${entry.category}`} fill={CATEGORY_COLORS[entry.category] || "#999"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
              </PieChartComponent>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>

        {/* Bar Chart - Monthly Trend */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Monthly Spending Trend
          </h3>
          {monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
          )}
        </div>
      </div>

      {/* Add Expense Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Expenses</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors transform hover:scale-105"
          >
            <Plus size={20} /> Add Expense
          </button>
        </div>

        {showForm && <ExpenseForm onClose={() => setShowForm(false)} onSubmit={handleAddExpense} />}

        {/* Expenses Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{expense.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{expense.description || "-"}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ₹{expense.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            expense.recurring ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {expense.recurring ? "Recurring" : "One-time"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No expenses recorded yet. Start by adding your first expense!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-600" /> Budget Alerts
          </h2>
          {budgetAlerts.map((alert) => (
            <div
              key={alert.category}
              className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-semibold text-orange-900">{alert.category} Over Budget</p>
                <p className="text-sm text-orange-700 mt-1">
                  You've spent ₹{alert.spent.toLocaleString("en-IN")} against a budget of ₹
                  {alert.budget.toLocaleString("en-IN")} ({alert.percentageOver}% over).
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
