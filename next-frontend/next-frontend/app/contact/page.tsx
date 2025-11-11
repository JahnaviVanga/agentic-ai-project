"use client"

import type React from "react"

import Link from "next/link"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Finance Advisor
          </Link>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition">
              Home
            </Link>
            <Link href="/dashboard?userId=user1" className="text-gray-600 hover:text-gray-900 transition">
              Dashboard
            </Link>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition font-semibold text-blue-600">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-600">
            We're here to help you achieve your financial goals. Have questions? We're ready to assist you with any
            inquiries about our services.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-16">
          {/* Email Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Mail className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-4">Reach out via email for inquiries and support</p>
                <a href="mailto:support@financeadvisor.com" className="text-blue-600 font-semibold hover:text-blue-700">
                  support@financeadvisor.com
                </a>
                <a href="mailto:info@financeadvisor.com" className="text-blue-600 font-semibold hover:text-blue-700">
                  info@financeadvisor.com
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <Phone className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-4">Available Monday to Friday, 9 AM to 6 PM IST</p>
                <a href="tel:+919876543210" className="text-green-600 font-semibold hover:text-green-700">
                  +91 9876 543 210
                </a>
                <a href="tel:+919123456789" className="text-green-600 font-semibold hover:text-green-700">
                  +91 9123 456 789
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <MapPin className="text-purple-600" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600 mb-4">Our office location and working hours</p>
                <p className="text-gray-800 font-semibold">Finance Advisor HQ</p>
                <p className="text-gray-600">Mumbai, Maharashtra 400001</p>
                <p className="text-gray-600">India</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Form and Description */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Description */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We're Ready to Help</h2>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                At Finance Advisor, we believe that everyone deserves access to intelligent financial guidance. Whether
                you have questions about our platform, need assistance with your financial planning, or want to explore
                investment opportunities, our dedicated team is here for you.
              </p>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Our mission is to empower individuals to make informed financial decisions and build lasting wealth. We
                provide personalized support to help you navigate your financial journey with confidence.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <MessageCircle className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quick Response</h4>
                    <p className="text-gray-600">We typically respond to inquiries within 24 hours</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Send className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Expert Support</h4>
                    <p className="text-gray-600">Our financial experts are ready to assist you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                  >
                    {submitted ? "Message Sent!" : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
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
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard?userId=user1" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/stocks" className="hover:text-white transition">
                    Stocks
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="mailto:support@financeadvisor.com" className="hover:text-white transition">
                    Email Support
                  </a>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms of Service
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
