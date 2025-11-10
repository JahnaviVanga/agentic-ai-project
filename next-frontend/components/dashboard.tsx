"use client"

import { TrendingUp, Wallet } from "lucide-react"
import PortfolioChart from "./portfolio-chart"

interface DashboardProps {
  userData?: any
}

export default function Dashboard({ userData }: DashboardProps) {
  const portfolio = {
    totalValue: userData?.savings || 124850,
    monthlyGain: (userData?.savings || 0) * 0.02, // 2% monthly growth assumption
    gainPercentage: 2.67,
    accountsCount: 3,
  }

  const monthlyIncome = userData?.income || 8500
  const monthlyExpenses = userData?.expenses || 3500

  const assets = [
    { name: "Stocks", value: (userData?.savings || 0) * 0.52, percentage: 52, change: 2.5 },
    { name: "Bonds", value: (userData?.savings || 0) * 0.28, percentage: 28, change: 0.8 },
    { name: "Real Estate", value: (userData?.savings || 0) * 0.14, percentage: 14, change: 1.2 },
    { name: "Cash", value: (userData?.savings || 0) * 0.06, percentage: 6, change: 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Portfolio</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">₹{portfolio.totalValue.toLocaleString("en-IN")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Gain</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                +₹{Math.round(portfolio.monthlyGain).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Income</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">₹{monthlyIncome.toLocaleString("en-IN")}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Surplus</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{(monthlyIncome - monthlyExpenses).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Wallet className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Portfolio Performance</h2>
          <PortfolioChart />
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Asset Allocation</h2>
          <div className="space-y-4">
            {assets.map((asset) => (
              <div key={asset.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{asset.name}</span>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{Math.round(asset.value).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${asset.change >= 0 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${asset.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">{asset.percentage}%</span>
                  <span className={`text-xs font-medium ${asset.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
