"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, AlertCircle, AlertTriangle } from "lucide-react"
import Chatbot from "@/components/chatbot"
import NotificationsPanel from "@/components/notifications-panel"

interface UserData {
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

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [advice, setAdvice] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [adviceLoading, setAdviceLoading] = useState(false)

  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem("userFinancialData")
        if (stored) {
          const data = JSON.parse(stored)
          setUserData({
            name: data.name,
            monthlyIncome: data.monthlyIncome,
            monthlySavingsGoal: data.monthlySavingsGoal,
            expenses: data.expenses,
          })

          // Check for loss condition and create notifications
          const totalExpenses = Object.values(data.expenses).reduce((a: number, b: number) => a + b, 0)
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")

          if (totalExpenses > data.monthlyIncome) {
            const lossAmount = totalExpenses - data.monthlyIncome
            const hasExistingCritical = notifications.some(
              (n: any) => n.type === "critical" && n.category === "expense",
            )

            if (!hasExistingCritical) {
              const newNotif = {
                id: Date.now().toString(),
                type: "critical",
                message: `You are at a loss! Your expenses (₹${totalExpenses.toLocaleString(
                  "en-IN",
                )}) exceed your income (₹${data.monthlyIncome.toLocaleString(
                  "en-IN",
                )}) by ₹${lossAmount.toLocaleString("en-IN")}. Immediate action required!`,
                category: "expense",
                timestamp: new Date().toLocaleString("en-IN"),
                read: false,
              }
              notifications.push(newNotif)
              localStorage.setItem("notifications", JSON.stringify(notifications))
            }
          } else if (totalExpenses > data.monthlyIncome * 0.7) {
            const hasExistingWarning = notifications.some((n: any) => n.type === "warning" && n.category === "expense")

            if (!hasExistingWarning) {
              const newNotif = {
                id: Date.now().toString(),
                type: "warning",
                message: `Your expenses (₹${totalExpenses.toLocaleString(
                  "en-IN",
                )}) are approaching 70% of your income! Please review and optimize your spending.`,
                category: "expense",
                timestamp: new Date().toLocaleString("en-IN"),
                read: false,
              }
              notifications.push(newNotif)
              localStorage.setItem("notifications", JSON.stringify(notifications))
            }
          }
        }
        setLoading(false)
      } catch (error) {
        console.error("Error loading user data:", error)
        setLoading(false)
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    if (userData) {
      generateLocalAdvice()
    }
  }, [userData])

  const generateLocalAdvice = () => {
    if (!userData) return

    setAdviceLoading(true)
    try {
      setTimeout(() => {
        const adviceText = generateAdviceText(userData)
        setAdvice(adviceText)
        setAdviceLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error generating advice:", error)
      setAdvice("Unable to generate advice at this moment.")
      setAdviceLoading(false)
    }
  }

  const generateAdviceText = (data: UserData): string => {
    const totalExpenses = Object.values(data.expenses).reduce((a, b) => a + b, 0)
    const savingsPercentage = (data.monthlySavingsGoal / data.monthlyIncome) * 100
    const expensePercentage = (totalExpenses / data.monthlyIncome) * 100
    const remainingAfterGoal = data.monthlyIncome - totalExpenses - data.monthlySavingsGoal

    let advice = `Financial Analysis for ${data.name}:\n\n`

    advice += `Income Status:\nYour monthly income is ₹${data.monthlyIncome.toLocaleString("en-IN")}. `
    advice += `Your total monthly expenses are ₹${totalExpenses.toLocaleString("en-IN")} (${expensePercentage.toFixed(1)}% of income).\n\n`

    if (savingsPercentage >= 20) {
      advice += `Savings Goal:\nYour savings goal of ₹${data.monthlySavingsGoal.toLocaleString("en-IN")} (${savingsPercentage.toFixed(1)}%) is excellent! You're prioritizing your future.\n\n`
    } else if (savingsPercentage >= 10) {
      advice += `Savings Goal:\nYour savings goal of ₹${data.monthlySavingsGoal.toLocaleString("en-IN")} (${savingsPercentage.toFixed(1)}%) is good, but consider increasing it to at least 20% of your income.\n\n`
    } else {
      advice += `Savings Goal:\nYour savings goal of ₹${data.monthlySavingsGoal.toLocaleString("en-IN")} (${savingsPercentage.toFixed(1)}%) is conservative. Try to aim for at least 20% of your income.\n\n`
    }

    if (remainingAfterGoal > 0) {
      advice += `Remaining Amount:\nAfter expenses and savings, you have ₹${remainingAfterGoal.toLocaleString("en-IN")} remaining. Consider investing this amount in:\n• Fixed Deposits for guaranteed returns\n• Mutual Funds for long-term wealth building\n• Emergency Fund (aim for 6 months of expenses)\n\n`
    } else if (remainingAfterGoal === 0) {
      advice += `Budget Balance:\nYour income perfectly matches your expenses and savings goal! Your budget is well-balanced.\n\n`
    } else {
      advice += `Budget Alert:\nYour expenses and savings goal exceed your income by ₹${Math.abs(remainingAfterGoal).toLocaleString("en-IN")}. Consider:\n• Reducing discretionary spending (entertainment, others)\n• Realigning your savings goal\n• Increasing your income\n\n`
    }

    if (data.expenses.groceries > data.monthlyIncome * 0.2) {
      advice += `Groceries:\nYour grocery spending is ₹${data.expenses.groceries.toLocaleString("en-IN")}. Try meal planning and bulk buying to reduce costs.\n`
    }

    if (data.expenses.entertainment > data.monthlyIncome * 0.1) {
      advice += `Entertainment:\nYour entertainment spending (₹${data.expenses.entertainment.toLocaleString("en-IN")}) is significant. Set a limit of 5-10% of income.\n`
    }

    advice += `\nGeneral Tips:\n• Track your expenses regularly\n• Set up automatic transfers for savings\n• Build an emergency fund\n• Invest wisely for long-term growth\n• Check out the Stock Recommendations page for investment ideas`

    return advice
  }

  if (loading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={40} />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const totalExpenses = Object.values(userData.expenses).reduce((a, b) => a + b, 0)
  const expenseData = [
    { name: "Groceries", value: userData.expenses.groceries },
    { name: "Entertainment", value: userData.expenses.entertainment },
    { name: "Utilities", value: userData.expenses.utilities },
    { name: "Transportation", value: userData.expenses.transportation },
    { name: "Others", value: userData.expenses.others },
  ].filter((item) => item.value > 0)

  const incomeData = [
    {
      name: "Category",
      Income: userData.monthlyIncome,
      Expenses: totalExpenses,
      "Savings Goal": userData.monthlySavingsGoal,
    },
  ]

  const savingsPercentage = (userData.monthlySavingsGoal / userData.monthlyIncome) * 100
  const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"]
  const isAtLoss = totalExpenses > userData.monthlyIncome

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome back, <span className="text-blue-600">{userData.name}</span>
            </h1>
            <p className="text-xl text-gray-600">Here's your financial overview</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/stocks"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View Stock Recommendations
            </Link>
          </div>
        </div>

        {/* Loss Alert Banner */}
        {isAtLoss && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg">
            <div className="flex gap-4">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={28} />
              <div>
                <h3 className="text-lg font-bold text-red-900 mb-2">Financial Alert: You're at a Loss!</h3>
                <p className="text-red-800">
                  Your expenses (₹{totalExpenses.toLocaleString("en-IN")}) exceed your income (₹
                  {userData.monthlyIncome.toLocaleString("en-IN")}) by ₹
                  {(totalExpenses - userData.monthlyIncome).toLocaleString("en-IN")}. Please take immediate action to
                  balance your finances.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Monthly Income</p>
                  <p className="text-3xl font-bold text-blue-600">₹{userData.monthlyIncome.toLocaleString("en-IN")}</p>
                </div>
                <TrendingUp className="text-blue-400" size={40} />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-br ${isAtLoss ? "from-red-50 to-red-100 border-red-200" : "from-red-50 to-red-100 border-red-200"}`}
          >
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Expenses</p>
                <p className={`text-3xl font-bold ${isAtLoss ? "text-red-700" : "text-red-600"}`}>
                  ₹{totalExpenses.toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Savings Goal</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{userData.monthlySavingsGoal.toLocaleString("en-IN")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Savings Rate</p>
                <p className="text-3xl font-bold text-purple-600">{savingsPercentage.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Expense Breakdown Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Your spending across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income vs Expenses Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Income, Expenses, and Savings Goal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
                  <Legend />
                  <Bar dataKey="Income" fill="#3b82f6" />
                  <Bar dataKey="Expenses" fill="#ef4444" />
                  <Bar dataKey="Savings Goal" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Expense Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
            <CardDescription>Detailed breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {((item.value / totalExpenses) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">₹{item.value.toLocaleString("en-IN")}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Insights */}
        {adviceLoading ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-amber-600" size={24} />
                Financial Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin text-amber-600" size={20} />
                <p className="text-gray-600">Generating AI insights...</p>
              </div>
            </CardContent>
          </Card>
        ) : advice ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 border-l-4 border-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="text-amber-600" size={24} />
                Financial Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{advice}</p>
            </CardContent>
          </Card>
        ) : null}

        {/* Chatbot and Notifications */}
        <Chatbot />
        <NotificationsPanel />
      </div>
    </div>
  )
}
