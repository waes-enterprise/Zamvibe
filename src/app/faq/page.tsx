'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Search } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
  category: string
}

const faqItems: FaqItem[] = [
  {
    category: 'Getting Started',
    question: 'What is ZamVibe?',
    answer: 'ZamVibe is Africa\'s premier entertainment news platform. We aggregate and curate the latest stories from over 50 trusted sources across the continent, bringing you music updates, celebrity gossip, movie reviews, fashion trends, comedy, and viral stories — all in one place.',
  },
  {
    category: 'Getting Started',
    question: 'What kind of content do you cover?',
    answer: 'We cover a wide range of entertainment content including African music (Afrobeats, Amapiano, ZedMusic, and more), celebrity gossip and scandals, movies and TV shows (Nollywood, Showmax, Netflix Africa), fashion and red carpet looks, comedy and skits, and viral internet trends across the continent.',
  },
  {
    category: 'Getting Started',
    question: 'Is ZamVibe free?',
    answer: 'Yes, ZamVibe is completely free to use! You can browse all stories, read articles, and explore trending content without paying anything. No account required — just visit and start exploring.',
  },
  {
    category: 'Getting Started',
    question: 'Do I need an account to use ZamVibe?',
    answer: 'No account is needed to read and browse content. Just visit ZamVibe and start exploring the latest entertainment news from across Africa.',
  },
  {
    category: 'Content',
    question: 'How often is content updated?',
    answer: 'Multiple times daily! We aggregate from over 50 sources to ensure you always have fresh content. Our system pulls new stories automatically, so you\'ll find the latest entertainment news every time you visit.',
  },
  {
    category: 'Content',
    question: 'Do you cover Zambian entertainment?',
    answer: 'Yes! We cover Zambian music, celebrity gossip, fashion, and cultural events extensively. As a Zambian-built platform, we take pride in highlighting the best of ZedMusic and Zambian entertainment alongside content from across Africa.',
  },
  {
    category: 'Content',
    question: 'What countries do you cover?',
    answer: 'We cover entertainment news from Zambia, Nigeria, South Africa, Ghana, Kenya, Tanzania, Uganda, DRC, Botswana, and more. Our sources span over 10 African countries, making ZamVibe your true pan-African entertainment destination.',
  },
  {
    category: 'Sharing',
    question: 'How can I share a story?',
    answer: 'Use the share button on any story to share it directly to social media platforms like WhatsApp, Twitter/X, Facebook, and more. You can also copy the link to share it anywhere.',
  },
  {
    category: 'Sharing',
    question: 'Can I suggest a news source?',
    answer: 'Absolutely! We\'re always looking to expand our coverage. Contact us through the Contact page and let us know which source you\'d like us to add. Our team will review it and add it if it meets our quality standards.',
  },
  {
    category: 'Account',
    question: 'How do I report incorrect information?',
    answer: 'If you spot incorrect information in any story, use the Contact form and select "Report Issue" as the subject. Include the story URL and describe the issue. Our team will review and correct it as soon as possible.',
  },
  {
    category: 'Account',
    question: 'How can I advertise on ZamVibe?',
    answer: 'We offer various advertising options including banner ads, sponsored content, and featured placements. Contact our partnerships team through the Contact page — select "Partnership" or "Advertising" as the subject, and we\'ll send you our media kit.',
  },
  {
    category: 'Account',
    question: 'Who built ZamVibe?',
    answer: 'ZamVibe is built by WAES — a Zambian tech company passionate about African innovation. We\'re based in Lusaka and dedicated to showcasing African entertainment to the world.',
  },
]

const categories = ['Getting Started', 'Content', 'Sharing', 'Account']

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <h1 className="text-[#aaaaaa] font-medium text-base">FAQ</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-[#aaaaaa] max-w-md mx-auto">
            Find answers to the most common questions about ZamVibe. Can&apos;t find what you&apos;re looking for? Contact us.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#666666]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for answers..."
            className="w-full h-12 pl-11 pr-4 text-sm rounded-xl border border-[#272727] bg-[#1a1a1a] text-white outline-none focus:border-[#ff4444] focus:ring-2 focus:ring-[#ff4444]/10 placeholder-[#666666]"
          />
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-center text-sm text-[#666666]">
            {filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'} found for &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {/* FAQ by Category */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = filteredItems.filter((item) => item.category === category)
            if (categoryItems.length === 0) return null

            return (
              <div key={category}>
                <h3 className="text-[#ff4444] font-semibold text-base mb-3">{category}</h3>
                <div className="space-y-3">
                  {categoryItems.map((item) => (
                    <details
                      key={item.question}
                      className="group bg-[#1a1a1a] rounded-2xl border border-[#272727] overflow-hidden hover:border-[#ff4444]/20 transition-colors"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-white hover:text-[#ff4444] transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="pr-4">{item.question}</span>
                        <span className="text-[#666666] group-open:rotate-180 transition-transform duration-200 shrink-0">
                          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                      </summary>
                      <div className="px-5 pb-5 text-sm text-[#aaaaaa] leading-relaxed border-t border-[#272727] pt-4">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* No results */}
        {filteredItems.length === 0 && searchQuery && (
          <div className="text-center py-10">
            <p className="text-[#666666] text-sm">No matching questions found. Try a different search term.</p>
          </div>
        )}

        {/* Still need help */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">Still have questions?</h3>
          <p className="text-sm text-[#aaaaaa] mb-5 max-w-md mx-auto">
            Couldn&apos;t find the answer you were looking for? Our team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-[#ff4444] hover:bg-[#cc0000] text-white text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#ff4444]/25 transition-all duration-200"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
