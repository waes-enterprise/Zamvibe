'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Mail, MessageCircle, Clock, Loader2 } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'hello@zamvibe.com',
      subtext: 'We reply within 24 hours',
    },
    {
      icon: MessageCircle,
      title: 'Social Media',
      details: '@ZamVibe',
      subtext: 'Facebook, Twitter/X, Instagram, TikTok, YouTube',
    },
    {
      icon: Clock,
      title: 'Response Time',
      details: '24 hours',
      subtext: 'Mon–Sun, we\'re always online',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Header */}
      <div className="bg-[#0f0f0f] border-b border-[#272727] px-4 py-3 flex items-center gap-3">
        <Link
          href="/"
          className="h-8 w-8 rounded-full bg-white/5 border border-[#272727] flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Home className="size-4 text-white" />
        </Link>
        <Link href="/" className="text-white font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
          Zam<span className="text-[#ff4444]">Vibe</span>
        </Link>
        <span className="text-[#272727] mx-1">|</span>
        <h1 className="text-[#aaaaaa] font-medium text-base">Contact Us</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full space-y-8">
        {/* Intro */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
          <p className="text-sm text-[#aaaaaa] max-w-md mx-auto">
            Have a question, story tip, or partnership idea? We&apos;d love to hear from you. Reach out through the form or any of our channels below.
          </p>
        </div>

        {/* Two column: Form + Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Form */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6">
            <h3 className="text-lg font-semibold text-white mb-5">Send us a Message</h3>

            {success && (
              <div className="bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff6666] text-sm px-4 py-3 rounded-xl mb-4">
                Thank you! Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
              </div>
            )}

            {error && (
              <div className="bg-[#ff4444]/10 border border-[#ff4444]/30 text-[#ff6666] text-sm px-4 py-3 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full h-11 pl-4 pr-4 text-sm rounded-xl border border-[#272727] bg-[#0f0f0f] text-white outline-none focus:border-[#ff4444] focus:ring-2 focus:ring-[#ff4444]/10 placeholder-[#666666]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-11 pl-4 pr-4 text-sm rounded-xl border border-[#272727] bg-[#0f0f0f] text-white outline-none focus:border-[#ff4444] focus:ring-2 focus:ring-[#ff4444]/10 placeholder-[#666666]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-1.5">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full h-11 pl-4 pr-4 text-sm rounded-xl border border-[#272727] bg-[#0f0f0f] text-white outline-none focus:border-[#ff4444] focus:ring-2 focus:ring-[#ff4444]/10"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General</option>
                  <option value="story-tip">Story Tip</option>
                  <option value="partnership">Partnership</option>
                  <option value="advertising">Advertising</option>
                  <option value="feedback">Feedback</option>
                  <option value="report">Report Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={4}
                  className="w-full pl-4 pr-4 pt-3 pb-3 text-sm rounded-xl border border-[#272727] bg-[#0f0f0f] text-white outline-none focus:border-[#ff4444] focus:ring-2 focus:ring-[#ff4444]/10 resize-none placeholder-[#666666]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#ff4444] hover:bg-[#cc0000] text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4444]/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Cards */}
          <div className="space-y-3">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-4 flex items-start gap-4 hover:border-[#ff4444]/30 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-[#ff4444]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <info.icon className="size-5 text-[#ff4444]" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{info.title}</h4>
                  <p className="text-[#3ea6ff] text-sm font-medium mt-0.5">{info.details}</p>
                  <p className="text-[#666666] text-xs mt-0.5">{info.subtext}</p>
                </div>
              </div>
            ))}

            {/* FAQ mini */}
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Quick FAQ</h3>
              <div className="space-y-3">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm text-[#aaaaaa] hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                    How do I submit a story?
                    <span className="text-[#666666] group-open:rotate-180 transition-transform duration-200">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-xs text-[#aaaaaa] leading-relaxed">
                    Use the form above and select &ldquo;Story Tip&rdquo; as the subject. Include the source link and a brief description.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm text-[#aaaaaa] hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                    How often is content updated?
                    <span className="text-[#666666] group-open:rotate-180 transition-transform duration-200">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-xs text-[#aaaaaa] leading-relaxed">
                    Multiple times daily! We pull from 50+ sources to keep you updated on the latest entertainment news.
                  </div>
                </details>
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-sm text-[#aaaaaa] hover:text-white transition-colors [&::-webkit-details-marker]:hidden">
                    Can I advertise on ZamVibe?
                    <span className="text-[#666666] group-open:rotate-180 transition-transform duration-200">
                      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </summary>
                  <div className="mt-2 text-xs text-[#aaaaaa] leading-relaxed">
                    Absolutely! Select &ldquo;Partnership&rdquo; or &ldquo;Advertising&rdquo; in the form above and our team will get back to you.
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
