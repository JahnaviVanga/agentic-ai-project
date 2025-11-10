"use client"

import { BarChart3, TrendingUp, DollarSign, MessageSquare, Settings } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onSettingsClick?: () => void
}

export default function Navigation({ activeTab, setActiveTab, onSettingsClick }: NavigationProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "investments", label: "Investments", icon: TrendingUp },
    { id: "expenses", label: "Goals & Expenses", icon: DollarSign },
    { id: "advisor", label: "AI Advisor", icon: MessageSquare },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FA</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">FinanceAdvisor</h1>
          </div>

          <div className="flex items-center gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>

          <button onClick={onSettingsClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  )
}
