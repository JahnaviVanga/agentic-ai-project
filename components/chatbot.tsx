"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send, Loader2, X } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hi! I'm your FinAI advisor. I can answer any questions about finance, investing, budgeting, taxes, or any other topic. Ask me anything!",
      timestamp: new Date().toLocaleTimeString("en-IN"),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Financial questions
    if (lowerMessage.includes("savings") || lowerMessage.includes("save")) {
      const savingsResponses = [
        "To build savings, start by creating a budget and allocating at least 20% of your income. Consider using automatic transfers to a separate savings account.",
        "Great savings tip: Use the 50/30/20 rule - 50% for needs, 30% for wants, 20% for savings and investments.",
        "Build an emergency fund first with 3-6 months of expenses before investing. This gives you financial security.",
      ]
      return savingsResponses[Math.floor(Math.random() * savingsResponses.length)]
    }

    if (lowerMessage.includes("invest") || lowerMessage.includes("investment")) {
      const investResponses = [
        "Start with low-risk investments like Mutual Funds (SIPs), then gradually move to equities as your portfolio grows.",
        "Diversification is key: Allocate 60% to Equities, 30% to Debt, and 10% to Gold for balanced growth.",
        "Consider your risk tolerance and investment timeline. Beginners should start with index funds or diversified mutual funds.",
      ]
      return investResponses[Math.floor(Math.random() * investResponses.length)]
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("expenses")) {
      const budgetResponses = [
        "Track all expenses for a month to identify spending patterns. Then create categories and set limits for each.",
        "Use the zero-based budgeting method: allocate every rupee of income to a specific purpose before the month begins.",
        "Review your budget weekly and adjust as needed. Apps can help automate expense tracking and categorization.",
      ]
      return budgetResponses[Math.floor(Math.random() * budgetResponses.length)]
    }

    if (lowerMessage.includes("tax") || lowerMessage.includes("tax saving")) {
      const taxResponses = [
        "Max out your Section 80C investments (up to ₹1.5L) using LIC, PPF, ELSS, or fixed deposits for tax savings.",
        "Consider Section 80D for health insurance, 80E for education loans, and 80G for charitable donations.",
        "Keep all investment receipts and documents for tax filing. File your ITR on time to avoid penalties.",
      ]
      return taxResponses[Math.floor(Math.random() * taxResponses.length)]
    }

    if (lowerMessage.includes("retirement") || lowerMessage.includes("pension")) {
      const retirementResponses = [
        "Start retirement planning early. Aim to replace 70-80% of your current income through savings and investments.",
        "NPS (National Pension System) is a good retirement vehicle with tax benefits. Contribute consistently from today.",
        "Calculate your retirement corpus needed: (Annual Expenses × 25) using the 4% withdrawal rule.",
      ]
      return retirementResponses[Math.floor(Math.random() * retirementResponses.length)]
    }

    // General knowledge questions
    if (lowerMessage.includes("what is") || lowerMessage.includes("what's")) {
      return "Great question! I'm here to help. Could you be more specific about what you'd like to know? I can explain financial concepts, investment strategies, or help with personal finance management."
    }

    if (lowerMessage.includes("how") || lowerMessage.includes("how to")) {
      return "I can guide you through most financial processes. Please provide more details about what you're trying to accomplish, and I'll give you step-by-step guidance."
    }

    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "I'm here to help! I can assist with: budgeting, expense tracking, investment recommendations, tax planning, retirement planning, and general financial advice. What would you like help with?"
    }

    // Science and general knowledge
    if (lowerMessage.includes("physics") || lowerMessage.includes("science") || lowerMessage.includes("math")) {
      return "That's an interesting question! While I'm specialized in finance, I have general knowledge. Could you tell me more about what you'd like to know? I'll do my best to help!"
    }

    if (lowerMessage.includes("weather") || lowerMessage.includes("time")) {
      return "I don't have access to real-time data for that. But I can help you plan financially for seasonal changes or budgeting considerations. Is there a financial aspect I can help with?"
    }

    // Default comprehensive response
    const generalResponses = [
      "That's a good question! I can help you with financial planning, investment advice, budgeting tips, and personal finance management. What aspect would you like to explore?",
      "I'm designed to help you make smarter financial decisions. Share more details about your question and I'll provide personalized guidance.",
      "Great query! My expertise covers investing, savings, budgeting, taxes, and wealth building. I'm here to help you achieve your financial goals.",
      "I appreciate the question! While I specialize in finance, I'm equipped to answer a wide range of queries. Feel free to ask anything on your mind.",
    ]
    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString("en-IN"),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString("en-IN"),
      }
      setMessages((prev) => [...prev, aiMessage])
      setLoading(false)
    }, 800)
  }

  return (
    <div className="fixed bottom-8 left-8 z-50">
      {/* Chatbot Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition mb-4"
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-96 shadow-xl border-0 flex flex-col">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg flex flex-row justify-between items-center">
            <CardTitle>FinAI Advisor</CardTitle>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-green-800 rounded-full p-1">
              <X size={20} />
            </button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-600"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="animate-spin text-gray-600" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg">
              <Send size={18} />
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
