"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Star, ArrowLeft } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  riskLevel: "low" | "medium" | "high"
  recommendation: "buy" | "hold" | "sell"
  reasons: string[]
  prediction: string
  percentageIncrease: number
}

const RECOMMENDED_STOCKS: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    price: 2850,
    change: 4.2,
    riskLevel: "low",
    recommendation: "buy",
    reasons: ["Strong fundamentals", "Consistent dividends", "Large-cap stability"],
    prediction: "Based on market trends and technical analysis, RELIANCE is expected to show steady growth.",
    percentageIncrease: 8.5,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3940,
    change: 2.1,
    riskLevel: "low",
    recommendation: "buy",
    reasons: ["IT sector leader", "Global presence", "Dividend payer"],
    prediction: "TCS shows strong momentum with positive market sentiment.",
    percentageIncrease: 6.2,
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank",
    price: 1680,
    change: 3.8,
    riskLevel: "medium",
    recommendation: "buy",
    reasons: ["Strong financials", "Growth potential", "Sector leader"],
    prediction: "Banking sector recovery expected to drive HDFC growth.",
    percentageIncrease: 12.3,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1850,
    change: -1.5,
    riskLevel: "medium",
    recommendation: "hold",
    reasons: ["Wait for better entry", "Good fundamentals", "Consolidation phase"],
    prediction: "Currently in consolidation phase. Wait for clarity before investing.",
    percentageIncrease: 4.8,
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    price: 520,
    change: 5.3,
    riskLevel: "medium",
    recommendation: "buy",
    reasons: ["Undervalued", "Recovery potential", "Strong balance sheet"],
    prediction: "Recovery play with good upside potential in next 10 days.",
    percentageIncrease: 14.5,
  },
  {
    symbol: "BAJAJ-AUTO",
    name: "Bajaj Auto",
    price: 1150,
    change: 3.2,
    riskLevel: "low",
    recommendation: "buy",
    reasons: ["Strong demand", "Quality products", "Market leadership"],
    prediction: "Auto sector showing signs of recovery with increased demand.",
    percentageIncrease: 7.9,
  },
]

export default function StocksPage() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)

  const getBadgeColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "buy":
        return "bg-green-100 text-green-800"
      case "sell":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Stock Investment Recommendations</h1>
          <p className="text-xl text-gray-600">
            Curated stock picks with 10-day price predictions tailored to your risk profile
          </p>
        </div>

        {/* Stocks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOMMENDED_STOCKS.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => setSelectedStock(stock)}
              className="cursor-pointer transform transition hover:scale-105"
            >
              <Card className="h-full border-2 border-gray-200 hover:border-purple-500 hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-lg">{stock.symbol}</CardTitle>
                      <CardDescription className="text-xs">{stock.name}</CardDescription>
                    </div>
                    <Star className="text-yellow-500" size={20} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">₹{stock.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stock.change > 0 ? (
                          <TrendingUp className="text-green-600" size={16} />
                        ) : (
                          <TrendingDown className="text-red-600" size={16} />
                        )}
                        <span
                          className={
                            stock.change > 0
                              ? "text-green-600 text-sm font-semibold"
                              : "text-red-600 text-sm font-semibold"
                          }
                        >
                          {stock.change > 0 ? "+" : ""}
                          {stock.change}%
                        </span>
                      </div>
                    </div>
                    <Badge className={getRecommendationColor(stock.recommendation)}>
                      {stock.recommendation.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t">
                    <Badge className={getBadgeColor(stock.riskLevel)} variant="outline">
                      {stock.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  {/* 10-day prediction */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">10-Day Prediction</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-purple-600">+{stock.percentageIncrease}%</span>
                      <span className="text-xs text-gray-600">expected increase</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedStock(stock)}
                    variant="outline"
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Stock Details Modal */}
        {selectedStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedStock.symbol}</CardTitle>
                  <CardDescription className="text-purple-100">{selectedStock.name}</CardDescription>
                </div>
                <button
                  onClick={() => setSelectedStock(null)}
                  className="text-white hover:bg-purple-800 rounded-full p-2 transition"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-blue-600">₹{selectedStock.price}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Current Change</p>
                    <p className={`text-3xl font-bold ${selectedStock.change > 0 ? "text-green-600" : "text-red-600"}`}>
                      {selectedStock.change > 0 ? "+" : ""}
                      {selectedStock.change}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Recommendation</p>
                  <Badge className={`text-lg px-4 py-2 ${getRecommendationColor(selectedStock.recommendation)}`}>
                    {selectedStock.recommendation.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">10-Day Prediction</p>
                  <p className="text-2xl font-bold text-purple-600 mb-2">
                    +{selectedStock.percentageIncrease}% Expected Increase
                  </p>
                  <p className="text-sm text-gray-700">
                    If you invest ₹10,000 today, it could grow to approximately ₹
                    {(10000 * (1 + selectedStock.percentageIncrease / 100)).toLocaleString("en-IN")} in 10 days.
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-3 font-semibold">Why Invest?</p>
                  <ul className="space-y-2">
                    {selectedStock.reasons.map((reason, idx) => (
                      <li key={idx} className="flex gap-3 text-sm">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Market Analysis</p>
                  <p className="text-sm text-gray-700">{selectedStock.prediction}</p>
                </div>

                <div className="pt-4 border-t flex gap-3">
                  <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg">
                    Add to Portfolio
                  </Button>
                  <Button onClick={() => setSelectedStock(null)} variant="outline" className="flex-1">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
