// Recommendation engine that generates personalized investment suggestions
// based on user profile and market analysis

export interface UserProfile {
  age: number
  riskTolerance: "low" | "medium" | "high"
  investmentHorizon: number // in years
  currentPortfolioValue: number
  monthlyIncome: number
  existingAssets?: {
    stocks: number
    bonds: number
    realEstate: number
    cash: number
  }
}

export interface Investment {
  id: number
  name: string
  description: string
  category: "growth" | "income" | "balanced" | "conservative"
  riskLevel: "Low" | "Medium" | "High"
  expectedReturn: string
  suggestedAmount: string
  score: number
  reason: string
  tickerSymbol?: string
}

export function generateRecommendations(userProfile: UserProfile): Investment[] {
  const recommendations: Investment[] = []

  // Risk-based recommendations
  if (userProfile.riskTolerance === "high" && userProfile.investmentHorizon >= 10) {
    recommendations.push(
      {
        id: 1,
        name: "Tech Growth Fund",
        description: "High-growth technology sector ETF with exposure to innovation",
        category: "growth",
        riskLevel: "High",
        expectedReturn: "8.5%",
        suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.1).toLocaleString("en-IN")}`,
        score: 4.8,
        reason: "Matches your high-risk tolerance and long investment horizon",
        tickerSymbol: "QQQ",
      },
      {
        id: 2,
        name: "Emerging Markets Fund",
        description: "Diversified exposure to high-growth emerging markets",
        category: "growth",
        riskLevel: "High",
        expectedReturn: "7.8%",
        suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.08).toLocaleString("en-IN")}`,
        score: 4.5,
        reason: "Provides international diversification with strong growth potential",
        tickerSymbol: "EEM",
      },
    )
  }

  if (userProfile.riskTolerance === "medium" || userProfile.riskTolerance === "high") {
    recommendations.push({
      id: 3,
      name: "International Index Fund",
      description: "Global market diversification across developed and emerging markets",
      category: "balanced",
      riskLevel: "Medium",
      expectedReturn: "5.8%",
      suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.12).toLocaleString("en-IN")}`,
      score: 4.6,
      reason: "Reduces concentration risk and increases geographic diversification",
      tickerSymbol: "VXUS",
    })
  }

  // Income-focused recommendations
  if (userProfile.age >= 50 || userProfile.riskTolerance === "low") {
    recommendations.push({
      id: 4,
      name: "Dividend Aristocrats",
      description: "Stable dividend-paying stocks with 25+ years of dividend growth",
      category: "income",
      riskLevel: "Low",
      expectedReturn: "3.2%",
      suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.15).toLocaleString("en-IN")}`,
      score: 4.7,
      reason: "Provides stable income stream with minimal volatility for your portfolio",
      tickerSymbol: "NOBL",
    })
  }

  // Conservative recommendations
  if (userProfile.riskTolerance === "low") {
    recommendations.push(
      {
        id: 5,
        name: "Corporate Bonds Fund",
        description: "Investment-grade corporate bonds with stable returns",
        category: "conservative",
        riskLevel: "Low",
        expectedReturn: "4.1%",
        suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.2).toLocaleString("en-IN")}`,
        score: 4.3,
        reason: "Conservative fixed-income allocation suitable for risk-averse investors",
        tickerSymbol: "LQD",
      },
      {
        id: 6,
        name: "Treasury Bond Fund",
        description: "US Treasury bonds providing ultimate safety and stability",
        category: "conservative",
        riskLevel: "Low",
        expectedReturn: "3.5%",
        suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.15).toLocaleString("en-IN")}`,
        score: 4.1,
        reason: "Highest-safety asset class with government backing",
        tickerSymbol: "SHV",
      },
    )
  }

  // Age-based recommendations
  if (userProfile.age < 35) {
    recommendations.push({
      id: 7,
      name: "Small Cap Growth Fund",
      description: "Small-cap stocks with high growth potential for long-term investors",
      category: "growth",
      riskLevel: "High",
      expectedReturn: "9.2%",
      suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.08).toLocaleString("en-IN")}`,
      score: 4.4,
      reason: "Your young age allows for aggressive growth positions with recovery time",
      tickerSymbol: "VBR",
    })
  }

  // Rebalancing suggestions
  if (userProfile.existingAssets) {
    const totalAssets = Object.values(userProfile.existingAssets).reduce((a, b) => a + b, 0)
    const stockPercentage = (userProfile.existingAssets.stocks / totalAssets) * 100

    if (stockPercentage < 50 && userProfile.riskTolerance !== "low") {
      recommendations.push({
        id: 8,
        name: "S&P 500 Index Fund",
        description: "Core holding tracking 500 large-cap US companies",
        category: "balanced",
        riskLevel: "Medium",
        expectedReturn: "6.5%",
        suggestedAmount: `₹${Math.round(userProfile.currentPortfolioValue * 0.12).toLocaleString("en-IN")}`,
        score: 4.9,
        reason: "Increase stock allocation to match your risk profile and boost returns",
        tickerSymbol: "VOO",
      })
    }
  }

  // Sort by score and return top 5
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 5)
}

export function calculateAllocationScore(investmentAmount: number, portfolioValue: number, category: string): number {
  const percentage = (investmentAmount / portfolioValue) * 100

  // Optimal allocation percentages
  const optimalAllocations: Record<string, { min: number; max: number }> = {
    growth: { min: 10, max: 30 },
    income: { min: 10, max: 25 },
    balanced: { min: 15, max: 35 },
    conservative: { min: 20, max: 50 },
  }

  const optimal = optimalAllocations[category] || { min: 10, max: 25 }

  if (percentage >= optimal.min && percentage <= optimal.max) {
    return 5
  } else if (percentage >= optimal.min - 5 && percentage <= optimal.max + 5) {
    return 4
  }
  return 3
}
