"use client"

import Link from "next/link"
import { ArrowRight, TrendingUp, Brain, Target } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">Finance Advisor</div>
          <div className="hidden md:flex gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition">
              Home
            </a>
            <Link href="/dashboard?userId=user1" className="text-gray-600 hover:text-gray-900 transition">
              Dashboard
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Welcome to <span className="text-blue-600">Finance Advisor</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your intelligent financial partner to help you plan, spend, and grow smarter. Take control of your
                finances with AI-powered insights and personalized recommendations.
              </p>
              <Link
                href="/setup"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105"
              >
                Let's Get Started <ArrowRight size={20} />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl blur-3xl opacity-20"></div>
                <div className="relative bg-white/80 backdrop-blur rounded-2xl p-8 shadow-2xl h-96 flex items-center justify-center overflow-hidden">
                  <img
                    src="/professional-financial-advisor-in-modern-office-he.jpg"
                    alt="Financial Advisor"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose Finance Advisor?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Expenses Automatically</h3>
              <p className="text-gray-600">
                Categorize and monitor your daily expenses in real-time with an intelligent breakdown of your spending
                habits across groceries, entertainment, utilities, transportation, and more.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="bg-green-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Brain className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI-Driven Insights</h3>
              <p className="text-gray-600">
                Get AI-powered analysis of your spending patterns, personalized recommendations to optimize your budget,
                and smart alerts when you're overspending in any category.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition border border-gray-100">
              <div className="bg-purple-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Target className="text-purple-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Savings & Investment Tips</h3>
              <p className="text-gray-600">
                Receive smart saving and investment suggestions tailored to your income, goals, and risk profile. Build
                wealth with confidence through data-driven advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Start Your Financial Journey Today</h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of users who are taking control of their finances with our intelligent advisor
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold transition"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Finance Advisor</h3>
              <p className="text-sm">Your intelligent financial partner for smarter money management.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/dashboard?userId=user1" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/stocks" className="hover:text-white transition">
                    Stock Recommendations
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>Built by Finance Advisor AI | Copyright 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
