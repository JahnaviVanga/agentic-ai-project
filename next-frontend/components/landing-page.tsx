"use client"

import { ArrowRight, TrendingUp, PieChart, Target, Zap } from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative z-10 text-center max-w-4xl">
          <div className="mb-8 inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Smart Financial Management
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Take Control of Your Financial Future
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
            Track every rupee you spend, get AI-powered insights, and achieve your financial goals with our intelligent
            personal finance advisor.
          </p>

          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Let's Start <ArrowRight size={24} />
          </button>

          <p className="text-gray-600 mt-6 text-sm">No credit card required. Get started in seconds.</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Choose FinalyzeAI?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <PieChart size={32} className="text-blue-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Smart Expense Tracking</h3>
              <p className="text-gray-700 text-sm">
                Track expenses by category (groceries, utilities, entertainment, and more) with intelligent
                categorization.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
              <TrendingUp size={32} className="text-indigo-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-700 text-sm">
                Get personalized recommendations and real-time alerts powered by advanced AI analysis.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Target size={32} className="text-green-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Goal Setting & Tracking</h3>
              <p className="text-gray-700 text-sm">
                Set financial goals and watch your progress with visual dashboards and analytics.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <Zap size={32} className="text-purple-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Automatic Optimization</h3>
              <p className="text-gray-700 text-sm">
                Get actionable suggestions to optimize your budget and maximize savings automatically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <p className="text-blue-100">Active Users Tracking Their Finances</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">₹500Cr+</div>
            <p className="text-blue-100">Total Expenses Tracked & Optimized</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">85%</div>
            <p className="text-blue-100">Average Savings Rate Improvement</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Finances?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Join thousands of Indians who are taking control of their financial future with FinalyzeAI.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 mx-auto transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Now <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
