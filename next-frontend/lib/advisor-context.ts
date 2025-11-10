// Context builder for financial advisor AI

export interface UserFinancialContext {
  totalPortfolio: number
  monthlyIncome: number
  monthlyExpenses: number
  savingsRate: number
  riskTolerance: "low" | "medium" | "high"
  financialGoals: string[]
  age: number
}

export function buildAdvisorContext(userContext: UserFinancialContext): string {
  const savingsPercentage = (userContext.savingsRate * 100).toFixed(1)
  const disposableIncome = userContext.monthlyIncome - userContext.monthlyExpenses

  return `You are an expert financial advisor helping a client with their personal finance. Here's their financial profile:

Portfolio Value: ₹${userContext.totalPortfolio.toLocaleString("en-IN")}
Monthly Income: ₹${userContext.monthlyIncome.toLocaleString("en-IN")}
Monthly Expenses: ₹${userContext.monthlyExpenses.toLocaleString("en-IN")}
Disposable Income: ₹${disposableIncome.toLocaleString("en-IN")}
Savings Rate: ${savingsPercentage}%
Risk Tolerance: ${userContext.riskTolerance}
Age: ${userContext.age}
Financial Goals: ${userContext.financialGoals.join(", ")}

Provide personalized, actionable financial advice based on their profile. Be specific with numbers and percentages. Explain the reasoning behind your recommendations. Keep responses concise but informative.`
}

export const advisorPrompts = {
  investment: "What investment changes should I consider to optimize my portfolio?",
  budgeting: "How can I improve my budgeting and reduce expenses?",
  goals: "What's the best strategy to achieve my financial goals?",
  retirement: "How should I plan for retirement?",
  savings: "How can I increase my savings rate?",
  risk: "Is my current risk tolerance aligned with my age?",
}
