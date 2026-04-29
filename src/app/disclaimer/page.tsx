import Link from 'next/link'
import { Home } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Read the disclaimer for ZamVibe — Africa\'s #1 Entertainment Hub. Learn about content sourcing, accuracy, and limitations.',
}

export default function DisclaimerPage() {
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
        <h1 className="text-[#aaaaaa] font-medium text-base">Disclaimer</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Disclaimer</h2>
          <p className="text-sm text-[#666666] mb-8">Last updated: April 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">1. General Disclaimer</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                The information and entertainment news displayed on ZamVibe is sourced from publicly available RSS feeds and third-party publishers. While we strive to present accurate and up-to-date content, ZamVibe does not create, verify, or endorse the accuracy of any news articles, stories, or information displayed on our platform.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                All content is provided &ldquo;as is&rdquo; for informational and entertainment purposes only. Any reliance you place on such information is strictly at your own risk. This disclaimer is governed by the laws of the Republic of Zambia.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">2. News Aggregation</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe is a news aggregation platform. Stories are sourced from public RSS feeds and third-party news publishers. We do not employ journalists, fact-checkers, or editors to verify the accuracy of aggregated content. Headlines, summaries, and images are automatically fetched and displayed from their original sources.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                We always provide attribution and direct links to the original source articles. We encourage users to read the full story at the source publisher for the most complete and accurate information.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">3. Third-Party Content</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe may contain links to third-party websites, articles, and services. These links are provided for convenience and informational purposes only. We have no control over, and assume no responsibility for, the content, accuracy, or practices of any third-party websites or services.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                The inclusion of any link does not imply endorsement by ZamVibe. We strongly advise you to review the terms and privacy policies of any third-party websites you visit through our platform.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">4. Image Credits</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                All images displayed on ZamVibe are sourced from the original news articles and belong to their respective copyright holders. ZamVibe does not claim ownership of any images displayed on the platform.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                If you are a copyright holder and believe an image has been used improperly, please contact us at hello@zamvibe.com and we will address your concern promptly, including removal if necessary.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">5. Not Professional Advice</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                The content on ZamVibe is for entertainment and informational purposes only. Nothing on this platform should be construed as professional advice — whether financial, legal, medical, or otherwise. If you require professional advice on any matter, please consult a qualified professional.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">6. Limitation of Liability</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                To the maximum extent permitted by Zambian law, ZamVibe, its directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages arising from your access to or use of the platform, including reliance on any content displayed herein.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                This limitation applies regardless of the legal theory under which liability is asserted, whether based on warranty, contract, tort (including negligence), or any other legal theory.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">7. Changes to This Disclaimer</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe reserves the right to update or modify this Disclaimer at any time without prior notice. Changes will be effective immediately upon posting. Your continued use of the platform following any changes constitutes your acceptance of those changes.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">8. Contact Us</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                For any questions or concerns regarding this Disclaimer, please contact us at hello@zamvibe.com or through our Contact page. ZamVibe is committed to operating transparently and in compliance with all applicable laws of the Republic of Zambia.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
