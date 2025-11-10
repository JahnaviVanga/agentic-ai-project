"use client"

import { ArrowRight, Star, TrendingUp } from "lucide-react"
import { useState, useMemo } from "react"
import { generateRecommendations } from "@/lib/recommendation-engine"

interface Investment {
  id: number
  name: string
  description: string
  riskLevel: string
  expectedReturn: string
  suggestedAmount: string
  score: number
  reason: string
  tickerSymbol?: string
}

export default function InvestmentRecommendations() {
  const [userProfile] = useState({
    age: 35,
    riskTolerance: "high" as const,
    investmentHorizon: 25,
    currentPortfolioValue: 124850,
    monthlyIncome: 8500,
    existingAssets: {
      stocks: 65000,
      bonds: 35000,
      realEstate: 18000,
      cash: 6850,
    },
  })

  const recommendations = useMemo(() => {
    return generateRecommendations(userProfile) as Investment[]
  }, [userProfile])

  const [investedItems, setInvestedItems] = useState<number[]>([])

  const handleInvest = (id: number) => {
    if (!investedItems.includes(id)) {
      setInvestedItems([...investedItems, id])
      // Show success message (could use toast)
      setTimeout(() => {
        setInvestedItems(investedItems.filter((item) => item !== id))
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Investment Recommendations</h1>
            <p className="text-blue-100">AI-powered suggestions based on your profile and market analysis</p>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {recommendations.length} recommendations
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Age</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{userProfile.age}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Risk Tolerance</p>
          <p className="text-2xl font-bold text-gray-900 mt-2 capitalize">{userProfile.riskTolerance}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Horizon</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{userProfile.investmentHorizon} yrs</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 uppercase tracking-wider">Portfolio Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ₹{(userProfile.currentPortfolioValue / 100000).toFixed(0)} Lakh
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`bg-white rounded-lg p-6 border transition-all ${
                investedItems.includes(rec.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:shadow-lg hover:border-blue-300"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{rec.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  {rec.tickerSymbol && <p className="text-xs text-gray-500 mt-2">Ticker: {rec.tickerSymbol}</p>}
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg ml-4">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-yellow-700">{rec.score}/5</span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                {rec.reason}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Risk Level</p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      rec.riskLevel === "High"
                        ? "text-red-600"
                        : rec.riskLevel === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                    }`}
                  >
                    {rec.riskLevel}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Expected Return</p>
                  <p className="text-sm font-bold text-green-600 mt-1">{rec.expectedReturn}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider">Suggested Amount</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{rec.suggestedAmount}</p>
                </div>
                <div className="md:col-span-2 flex items-end">
                  <button
                    onClick={() => handleInvest(rec.id)}
                    disabled={investedItems.includes(rec.id)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                      investedItems.includes(rec.id)
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {investedItems.includes(rec.id) ? (
                      <>
                        <TrendingUp size={16} /> Invested
                      </>
                    ) : (
                      <>
                        Invest <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
            <p className="text-gray-600">No recommendations available. Please update your profile.</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Recommendations are based on your age, risk tolerance, and
          investment horizon. Review your profile settings to get personalized suggestions.
        </p>
      </div>
    </div>
  )
}
