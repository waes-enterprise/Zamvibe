import Link from 'next/link'
import { Home } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-[#aaaaaa] font-medium text-base">Terms of Service</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Terms of Service</h2>
          <p className="text-sm text-[#666666] mb-8">Last updated: April 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">1. Acceptance of Terms</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                By accessing or using ZamVibe, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our platform. Your continued use of the website following the posting of changes constitutes your acceptance of those changes.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                These terms apply to all visitors and users who access or use ZamVibe. We reserve the right to update or modify these terms at any time without prior notice.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">2. Nature of Service</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe is an entertainment news aggregation platform. We curate and display news articles, stories, and content sourced from publicly available RSS feeds and third-party publishers. ZamVibe does not create original news content — we aggregate and organise it for your convenience.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                All content displayed on ZamVibe is attributed to its original source. We provide direct links to the original articles and encourage users to visit the source publishers for the full story.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">3. User-Generated Content</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                If you submit content to ZamVibe (such as story tips through our contact form), you grant us a non-exclusive, royalty-free licence to use that content for the purpose of reviewing and potentially publishing it on our platform. You retain ownership of your original content.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                You must not submit content that is unlawful, defamatory, harassing, or infringes upon the rights of others. ZamVibe reserves the right to remove any user-submitted content at our discretion.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">4. Content Sharing and Attribution</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                All news content displayed on ZamVibe is sourced from and belongs to its respective original publishers. We display headlines, summaries, and thumbnail images for informational purposes, always linking back to the original source.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Images used on ZamVibe are sourced from original articles and belong to their respective copyright holders. If you are a copyright holder and believe your content has been used improperly, please contact us and we will address your concern promptly.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">5. Intellectual Property</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                The ZamVibe platform, including its name, logo, design, code, and branding, is the exclusive property of ZamVibe and is protected by intellectual property laws. The aggregated news content and images displayed on the platform belong to their respective original publishers and copyright holders.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                You may not reproduce, distribute, or create derivative works from the ZamVibe platform itself without prior written consent. Sharing individual news stories via the provided share buttons is encouraged and permitted.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">6. Prohibited Use</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                You may not use ZamVibe for any unlawful purpose, attempt to gain unauthorised access to our systems, scrape or crawl the platform beyond what is permitted by our robots.txt file, or interfere with the proper functioning of the platform.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Automated access to our platform for the purpose of republishing or redistributing aggregated content without permission is strictly prohibited.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">7. Limitation of Liability</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe provides aggregated content &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of any news content displayed on our platform, as all content is sourced from third-party publishers.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                To the fullest extent permitted by Zambian law, ZamVibe shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or reliance on any content displayed herein.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">8. Changes to Terms</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe reserves the right to revise and update these Terms of Service at any time. Changes will be effective immediately upon posting to the platform. Your continued use after any such changes constitutes your acceptance of the new Terms.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                For questions about these Terms, please contact us at hello@zamvibe.com or through our Contact page. These terms are governed by and construed in accordance with the laws of the Republic of Zambia.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
