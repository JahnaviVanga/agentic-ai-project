"use client"

import { Save, X, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface UserProfile {
  name: string
  email: string
  age: number
  riskTolerance: "low" | "medium" | "high"
  investmentHorizon: number
  annualIncome: number
  preferredCurrency: string
  notifications: {
    budgetAlerts: boolean
    investmentUpdates: boolean
    goalReminders: boolean
    weeklyReports: boolean
  }
  theme: "light" | "dark"
}

interface ProfileSettingsProps {
  userData?: any
  onClose: () => void
  onUpdate: (data: any) => void
}

export default function ProfileSettings({ userData, onClose, onUpdate }: ProfileSettingsProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: userData?.name || "User",
    email: userData?.email || "user@example.com",
    age: userData?.age || 35,
    riskTolerance: userData?.riskTolerance || "medium",
    investmentHorizon: userData?.investmentHorizon || 20,
    annualIncome: userData?.income ? userData.income * 12 : 102000,
    preferredCurrency: userData?.preferredCurrency || "INR",
    notifications: {
      budgetAlerts: userData?.notifications?.budgetAlerts || true,
      investmentUpdates: userData?.notifications?.investmentUpdates || true,
      goalReminders: userData?.notifications?.goalReminders || true,
      weeklyReports: userData?.notifications?.weeklyReports || false,
    },
    theme: userData?.theme || "light",
  })

  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "notifications">("profile")
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleProfileChange = (field: keyof Omit<UserProfile, "notifications">, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleNotificationChange = (field: keyof UserProfile["notifications"]) => {
    setProfile((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: !prev.notifications[field],
      },
    }))
    setSaved(false)
  }

  const handleSave = () => {
    onUpdate({
      name: profile.name,
      email: profile.email,
      age: profile.age,
      riskTolerance: profile.riskTolerance,
      investmentHorizon: profile.investmentHorizon,
      income: profile.annualIncome / 12,
      expenses: userData?.expenses || 0,
      savings: userData?.savings || 0,
      goals: userData?.goals || "",
      preferredCurrency: profile.preferredCurrency,
      notifications: profile.notifications,
      theme: profile.theme,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900">⚙️ Update Details</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {["profile", "preferences", "notifications"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange("email", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => handleProfileChange("age", Number.parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Income (₹)</label>
                  <input
                    type="number"
                    value={profile.annualIncome}
                    onChange={(e) => handleProfileChange("annualIncome", Number.parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Risk Tolerance</label>
                  <select
                    value={profile.riskTolerance}
                    onChange={(e) => handleProfileChange("riskTolerance", e.target.value as any)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Investment Horizon (years)</label>
                  <input
                    type="number"
                    value={profile.investmentHorizon}
                    onChange={(e) => handleProfileChange("investmentHorizon", Number.parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Currency</label>
                <select
                  value={profile.preferredCurrency}
                  onChange={(e) => handleProfileChange("preferredCurrency", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <div className="flex gap-4">
                  {["light", "dark"].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={t}
                        checked={profile.theme === t}
                        onChange={(e) => handleProfileChange("theme", e.target.value as any)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{t} Mode</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">Tip:</span> Update your profile regularly for personalized
                  recommendations.
                </p>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleNotificationChange(key as any)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {key === "budgetAlerts" && "Budget Alerts"}
                        {key === "investmentUpdates" && "Investment Updates"}
                        {key === "goalReminders" && "Goal Reminders"}
                        {key === "weeklyReports" && "Weekly Reports"}
                      </p>
                      <p className="text-xs text-gray-600">
                        {key === "budgetAlerts" && "Get notified when spending exceeds budget"}
                        {key === "investmentUpdates" && "Receive market insights and recommendations"}
                        {key === "goalReminders" && "Regular reminders about your financial goals"}
                        {key === "weeklyReports" && "Weekly summary of your financial activity"}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-900">
                  <span className="font-semibold">Note:</span> You'll always receive critical security and account
                  alerts regardless of these settings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex items-center justify-between">
          {saved && <p className="text-sm text-green-600 font-medium">Changes saved successfully</p>}
          <div className="flex gap-3 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
