"use client"

import { Send, Loader, Lightbulb } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  text: string
  sender: "user" | "advisor"
  timestamp: Date
}

interface AdvisorChatProps {
  userData?: any
}

export default function AdvisorChat({ userData }: AdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello! I'm your AI Financial Advisor. I can help you with investment decisions, portfolio optimization, budgeting advice, tax strategies, and retirement planning. Based on your profile, you have a monthly income of ₹${userData?.income?.toLocaleString("en-IN") || "N/A"} and savings of ₹${userData?.savings?.toLocaleString("en-IN") || "N/A"}. What would you like to discuss today?`,
      sender: "advisor",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInput("")
    setLoading(true)

    // Simulate AI response with contextual financial guidance in INR
    setTimeout(() => {
      const userInput = input.toLowerCase()
      let advisorResponse = ""
      const monthlyIncome = userData?.income || 50000
      const savings = userData?.savings || 100000

      if (userInput.includes("invest") || userInput.includes("portfolio")) {
        advisorResponse = `Based on your monthly income of ₹${monthlyIncome.toLocaleString("en-IN")}, I recommend allocating: 60% to stocks (₹${Math.round(savings * 0.6).toLocaleString("en-IN")}), 30% to bonds (₹${Math.round(savings * 0.3).toLocaleString("en-IN")}), and 10% alternative investments (₹${Math.round(savings * 0.1).toLocaleString("en-IN")}). This diversified approach minimizes risk while maximizing growth potential.`
      } else if (userInput.includes("budget") || userInput.includes("spend")) {
        const savings_per_month = Math.max(0, monthlyIncome * 0.2)
        advisorResponse = `Your income of ₹${monthlyIncome.toLocaleString("en-IN")} can support strong savings. I suggest the 50/30/20 rule: ₹${Math.round(monthlyIncome * 0.5).toLocaleString("en-IN")} for needs, ₹${Math.round(monthlyIncome * 0.3).toLocaleString("en-IN")} for wants, and ₹${Math.round(savings_per_month).toLocaleString("en-IN")} for savings/debt. You're in a strong position!`
      } else if (userInput.includes("goal") || userInput.includes("save")) {
        const goal_months = Math.ceil(500000 / (monthlyIncome * 0.2))
        advisorResponse = `With your monthly income of ₹${monthlyIncome.toLocaleString("en-IN")} and current savings of ₹${savings.toLocaleString("en-IN")}, if you save 20% monthly (₹${Math.round(monthlyIncome * 0.2).toLocaleString("en-IN")}), you can reach ₹5 lakhs in approximately ${goal_months} months. Start automating your savings now!`
      } else if (userInput.includes("retire") || userInput.includes("retirement")) {
        const years_to_retirement = 30
        const monthly_savings = monthlyIncome * 0.15
        const projected_retirement = savings + monthly_savings * 12 * years_to_retirement
        advisorResponse = `At ₹${monthlyIncome.toLocaleString("en-IN")} monthly income with current savings of ₹${savings.toLocaleString("en-IN")}, if you save ₹${Math.round(monthly_savings).toLocaleString("en-IN")} monthly for ${years_to_retirement} years, you could reach approximately ₹${Math.round(projected_retirement).toLocaleString("en-IN")} by retirement. Consider tax-advantaged accounts like NPS!`
      } else {
        const suggestions = [
          `Your financial situation with ₹${monthlyIncome.toLocaleString("en-IN")} monthly income is solid. Focus on maximizing your ₹${savings.toLocaleString("en-IN")} savings through strategic investments.`,
          `With your current profile, I recommend reviewing your emergency fund (should be ₹${Math.round(monthlyIncome * 6).toLocaleString("en-IN")}). Your savings of ₹${savings.toLocaleString("en-IN")} suggests you're building wealth wisely.`,
          `Your ₹${monthlyIncome.toLocaleString("en-IN")} income gives you ample opportunity to build wealth. Start with the fundamentals: emergency fund, then invest in diversified assets.`,
        ]
        advisorResponse = suggestions[Math.floor(Math.random() * suggestions.length)]
      }

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: advisorResponse,
          sender: "advisor",
          timestamp: new Date(),
        },
      ])
      setLoading(false)
    }, 1200)
  }

  const quickPrompts = [
    "How should I invest my ₹" + (userData?.savings || "100000") + "?",
    "Review my budget",
    "Retirement planning for ₹" + (userData?.income || "50000") + "/month",
    "Achieve my goals",
  ]

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4">
        <h2 className="text-lg font-bold">AI Financial Advisor</h2>
        <p className="text-sm text-blue-100 mt-1">Personalized guidance powered by Mistral-7B</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-blue-100" : "text-gray-600"}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Advisor is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 2 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Try asking:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => setInput(prompt)}
                className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-start gap-1"
              >
                <Lightbulb size={14} className="flex-shrink-0 mt-0.5" />
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about investments, budgets, goals, or retirement..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
