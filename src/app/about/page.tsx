import Link from 'next/link'
import { Home, Music, Tv, Film, Sparkles, Newspaper, TrendingUp, Globe, Clock, ArrowRight } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: Newspaper, value: '36+', label: 'News Sources' },
    { icon: TrendingUp, value: '24/7', label: 'Auto Updates' },
    { icon: Globe, value: '8+', label: 'African Countries' },
    { icon: Clock, value: 'Every 2h', label: 'Refresh Cycle' },
  ]

  const coverTopics = [
    {
      icon: Music,
      title: 'Music',
      description: 'From Afrobeats and Amapiano to ZedMusic — stay on top of the latest releases, artist news, and music trends across Africa.',
    },
    {
      icon: Sparkles,
      title: 'Celebrity Gossip',
      description: 'The juiciest celebrity news, scandals, relationships, and behind-the-scenes drama from your favourite African stars.',
    },
    {
      icon: Tv,
      title: 'Movies & TV',
      description: 'Nollywood blockbusters, Showmax originals, Netflix Africa picks, and the hottest TV shows on the continent.',
    },
    {
      icon: Film,
      title: 'Fashion',
      description: 'African fashion trends, red carpet looks, designer spotlights, and style inspiration from across the continent.',
    },
    {
      icon: Sparkles,
      title: 'Comedy',
      description: 'Skits, stand-up specials, viral comedy clips, and the funniest moments from African entertainers.',
    },
    {
      icon: TrendingUp,
      title: 'Viral Trends',
      description: 'The hottest trending topics, viral challenges, memes, and cultural moments taking Africa by storm.',
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
        <h1 className="text-[#aaaaaa] font-medium text-base">About</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full space-y-10">
        {/* Hero Section */}
        <div className="text-center py-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Africa&apos;s #1<br />
            <span className="text-[#ff4444]">Entertainment Hub</span>
          </h2>
          <p className="text-[#aaaaaa] mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            ZamVibe brings you the latest African entertainment news, celebrity gossip, music updates, movie reviews, fashion trends, and viral stories — all in one place. Built in Zambia for Africa, we aggregate from 36+ trusted sources including Zambian favourites like Kalemba, Zed Corner, Mwebantu, and Tumfweko alongside top pan-African and global entertainment outlets.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-5 text-center"
            >
              <stat.icon className="size-7 text-[#ff4444] mx-auto mb-3" />
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#aaaaaa] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Mission */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-4">Our Mission</h3>
          <p className="text-[#aaaaaa] text-sm leading-relaxed">
            Our mission is to be the definitive destination for African entertainment. We aggregate stories from 36+ trusted sources across the continent — from Zambian favourites like Kalemba and Zed Corner to pan-African giants like BellaNaija and ZAlebs, all the way to global outlets like BET and TMZ. Our smart filtering ensures you only see entertainment content — no politics, no boring infrastructure news.
          </p>
          <p className="text-[#aaaaaa] text-sm leading-relaxed mt-3">
            We believe African entertainment deserves a world-class platform that celebrates the creativity, talent, and culture of the continent. ZamVibe is built for entertainment lovers who want to stay connected to the stories that matter.
          </p>
        </div>

        {/* What We Cover */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6 text-center">What We Cover</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coverTopics.map((topic) => (
              <div
                key={topic.title}
                className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-5 hover:border-[#ff4444]/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-[#ff4444]/10 flex items-center justify-center shrink-0">
                    <topic.icon className="size-5 text-[#ff4444]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-1">{topic.title}</h4>
                    <p className="text-[#aaaaaa] text-xs leading-relaxed">{topic.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white mb-4">Our Team</h3>
          <p className="text-[#aaaaaa] text-sm leading-relaxed">
            ZamVibe is built by <span className="text-white font-semibold">WAES</span> — a Zambian tech company pushing African innovation. We are a passionate team of developers, designers, and entertainment enthusiasts dedicated to bringing Africa&apos;s vibrant entertainment scene to your fingertips.
          </p>
          <p className="text-[#aaaaaa] text-sm leading-relaxed mt-3">
            Based in Lusaka, Zambia, we combine local knowledge with modern technology to deliver a platform that truly serves entertainment lovers across the African continent and beyond.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#ff4444] to-[#cc0000] rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-3">Start Exploring</h3>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">
            Dive into the latest African entertainment news, celebrity gossip, music, and viral trends.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-xl bg-white text-[#ff4444] font-semibold text-sm hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          >
            Start Exploring
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
