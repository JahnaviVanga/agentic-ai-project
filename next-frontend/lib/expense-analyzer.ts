// Expense analyzer for budget tracking and financial insights

export interface Expense {
  id: number
  category: string
  amount: number
  date: string
  recurring: boolean
}

export interface BudgetAlert {
  category: string
  spent: number
  budget: number
  percentageOver: number
}

export interface CategoryStats {
  category: string
  totalSpent: number
  average: number
  transactions: number
  trend: "up" | "down" | "stable"
}

export function calculateBudgetAlerts(expenses: Expense[], budgets: Record<string, number>): BudgetAlert[] {
  const categoryTotals: Record<string, number> = {}

  // Calculate spending by category
  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  // Generate alerts for overspending
  const alerts: BudgetAlert[] = []
  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = categoryTotals[category] || 0
    if (spent > budget) {
      alerts.push({
        category,
        spent,
        budget,
        percentageOver: Math.round(((spent - budget) / budget) * 100),
      })
    }
  })

  return alerts.sort((a, b) => b.percentageOver - a.percentageOver)
}

export function getCategoryStats(expenses: Expense[]): CategoryStats[] {
  const categories: Record<string, Expense[]> = {}

  // Group expenses by category
  expenses.forEach((expense) => {
    if (!categories[expense.category]) {
      categories[expense.category] = []
    }
    categories[expense.category].push(expense)
  })

  // Calculate stats for each category
  const stats: CategoryStats[] = Object.entries(categories).map(([category, categoryExpenses]) => {
    const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const average = totalSpent / categoryExpenses.length

    // Simple trend detection (would be more sophisticated in production)
    const recentExpenses = categoryExpenses.slice(-5)
    const recentAverage = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) / recentExpenses.length
    const trend = recentAverage > average * 1.1 ? "up" : recentAverage < average * 0.9 ? "down" : ("stable" as const)

    return {
      category,
      totalSpent,
      average: Math.round(average * 100) / 100,
      transactions: categoryExpenses.length,
      trend,
    }
  })

  return stats.sort((a, b) => b.totalSpent - a.totalSpent)
}

export function suggestBudgetOptimizations(
  expenses: Expense[],
  monthlyIncome: number,
): { category: string; suggestion: string; potentialSavings: number }[] {
  const stats = getCategoryStats(expenses)
  const totalSpending = stats.reduce((sum, s) => sum + s.totalSpent, 0)
  const spendingPercentage = (totalSpending / monthlyIncome) * 100

  const suggestions: { category: string; suggestion: string; potentialSavings: number }[] = []

  // General recommendations
  if (spendingPercentage > 80) {
    suggestions.push({
      category: "Overall",
      suggestion: "Your spending is consuming over 80% of income. Consider cutting discretionary expenses.",
      potentialSavings: totalSpending - monthlyIncome * 0.7,
    })
  }

  // Category-specific recommendations
  stats.forEach((stat) => {
    if (stat.category === "Entertainment" && stat.totalSpent > monthlyIncome * 0.1) {
      suggestions.push({
        category: "Entertainment",
        suggestion: "Entertainment spending is above recommended 10% of income. Look for lower-cost alternatives.",
        potentialSavings: stat.totalSpent - monthlyIncome * 0.1,
      })
    }
    if (stat.trend === "up") {
      suggestions.push({
        category: stat.category,
        suggestion: `${stat.category} spending is trending upward. Consider setting stricter controls.`,
        potentialSavings: stat.average * 0.15,
      })
    }
  })

  return suggestions.slice(0, 3) // Return top 3 suggestions
}
