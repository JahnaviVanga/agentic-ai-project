"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Info, Bell, X, AlertTriangle } from "lucide-react"
import { Loader2 } from "lucide-react"

interface Notification {
  id: string
  type: "warning" | "critical" | "info" | "success"
  message: string
  category: "expense" | "savings" | "stock" | "general"
  timestamp: string
  read: boolean
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem("notifications")
        const notifs = stored ? JSON.parse(stored) : []
        setNotifications(notifs)
      } catch (err) {
        console.error("Error loading notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const dismissNotification = (id: string) => {
    try {
      const updated = notifications.filter((n) => n.id !== id)
      setNotifications(updated)
      localStorage.setItem("notifications", JSON.stringify(updated))
    } catch (err) {
      console.error("Error dismissing notification:", err)
    }
  }

  const clearAllNotifications = () => {
    try {
      setNotifications([])
      localStorage.setItem("notifications", JSON.stringify([]))
    } catch (err) {
      console.error("Error clearing notifications:", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="text-yellow-600" size={20} />
      case "critical":
        return <AlertTriangle className="text-red-600" size={20} />
      case "success":
        return <CheckCircle className="text-green-600" size={20} />
      default:
        return <Info className="text-blue-600" size={20} />
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Floating Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition mb-4"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <Card className="w-96 max-h-screen overflow-y-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg sticky top-0 z-10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription className="text-blue-100">
                  {loading ? "Loading..." : unreadCount > 0 ? `${unreadCount} new` : "All caught up"}
                </CardDescription>
              </div>
              {notifications.length > 0 && (
                <button onClick={clearAllNotifications} className="text-sm text-blue-100 hover:text-white transition">
                  Clear All
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 pb-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-blue-600" size={24} />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No notifications yet</p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 rounded-lg border-l-4 ${
                    notif.type === "critical"
                      ? "bg-red-50 border-red-500"
                      : notif.type === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : notif.type === "success"
                          ? "bg-green-50 border-green-500"
                          : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
