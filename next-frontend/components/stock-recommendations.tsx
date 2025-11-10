"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Star } from "lucide-react"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  riskLevel: "low" | "medium" | "high"
  recommendation: "buy" | "hold" | "sell"
  reasons: string[]
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
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3940,
    change: 2.1,
    riskLevel: "low",
    recommendation: "buy",
    reasons: ["IT sector leader", "Global presence", "Dividend payer"],
  },
  {
    symbol: "HDFC",
    name: "HDFC Bank",
    price: 1680,
    change: 3.8,
    riskLevel: "medium",
    recommendation: "buy",
    reasons: ["Strong financials", "Growth potential", "Sector leader"],
  },
  {
    symbol: "INFY",
    name: "Infosys",
    price: 1850,
    change: -1.5,
    riskLevel: "medium",
    recommendation: "hold",
    reasons: ["Wait for better entry", "Good fundamentals", "Consolidation phase"],
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    price: 520,
    change: 5.3,
    riskLevel: "medium",
    recommendation: "buy",
    reasons: ["Undervalued", "Recovery potential", "Strong balance sheet"],
  },
]

export default function StockRecommendations() {
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
    <div className="w-full">
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
          <CardTitle>Stock Investment Recommendations</CardTitle>
          <CardDescription className="text-purple-100">Curated stocks for your risk profile</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RECOMMENDED_STOCKS.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => setSelectedStock(stock)}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 cursor-pointer transition hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">{stock.name}</p>
                  </div>
                  <Star className="text-yellow-500" size={20} />
                </div>

                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">₹{stock.price}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stock.change > 0 ? (
                        <TrendingUp className="text-green-600" size={16} />
                      ) : (
                        <TrendingDown className="text-red-600" size={16} />
                      )}
                      <span className={stock.change > 0 ? "text-green-600" : "text-red-600"}>
                        {stock.change > 0 ? "+" : ""}
                        {stock.change}%
                      </span>
                    </div>
                  </div>
                  <Badge className={getRecommendationColor(stock.recommendation)}>
                    {stock.recommendation.toUpperCase()}
                  </Badge>
                </div>

                <Badge className={getBadgeColor(stock.riskLevel)}>{stock.riskLevel.toUpperCase()} RISK</Badge>
              </div>
            ))}
          </div>

          {/* Stock Details Modal */}
          {selectedStock && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-96 max-h-96 overflow-y-auto">
                <CardHeader className="bg-purple-600 text-white flex flex-row justify-between">
                  <div>
                    <CardTitle>{selectedStock.symbol}</CardTitle>
                    <CardDescription className="text-purple-100">{selectedStock.name}</CardDescription>
                  </div>
                  <button onClick={() => setSelectedStock(null)} className="text-white text-2xl">
                    ×
                  </button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Price</p>
                    <p className="text-3xl font-bold">₹{selectedStock.price}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Recommendation</p>
                    <Badge className={getRecommendationColor(selectedStock.recommendation)}>
                      {selectedStock.recommendation.toUpperCase()}
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Why Invest?</p>
                    <ul className="space-y-2">
                      {selectedStock.reasons.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="text-green-600">✓</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition">
                      Add to Portfolio
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
