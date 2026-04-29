import Link from 'next/link'
import { Home } from 'lucide-react'

export default function PrivacyPage() {
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
        <h1 className="text-[#aaaaaa] font-medium text-base">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full">
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#272727] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-1">Privacy Policy</h2>
          <p className="text-sm text-[#666666] mb-8">Last updated: April 2026</p>

          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">1. Information We Collect</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe is a news aggregation platform. We do not require user accounts to browse content. The information we collect is minimal and limited to basic analytics data: IP address (anonymised), browser type, device type, pages visited, and general geographic location.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                When you use our contact form, we collect the information you voluntarily provide: your name, email address, and message content. This data is used solely to respond to your enquiry and is not shared with third parties.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                We do not collect National Registration Card numbers, financial information, or any other sensitive personal data. ZamVibe does not use social login services or third-party authentication.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">2. How We Use Your Information</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                Analytics data is used to understand how visitors interact with our platform, identify popular content, and improve the overall user experience. This data is aggregated and anonymised — we cannot identify individual users from analytics data alone.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Contact form submissions are used solely to respond to your enquiry. We do not add you to marketing lists, send promotional emails, or share your information with advertisers.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">3. News Content and Sources</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe aggregates entertainment news content from publicly available RSS feeds and news sources. All stories displayed on our platform are sourced from their original publishers, and we always provide attribution and links back to the source article.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Images displayed on ZamVibe are sourced from the original articles and belong to their respective copyright holders. We do not claim ownership of any news content, images, or media displayed on our platform.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">4. Cookies and Tracking</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                ZamVibe uses essential cookies for basic site functionality. We may use analytics cookies to understand usage patterns and improve our platform. We do not use advertising cookies or sell data to ad networks.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                You can control cookie preferences through your browser settings. Disabling cookies may affect some functionality of the platform.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">5. Third-Party Services</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                We may use third-party analytics services (such as Vercel Analytics) to monitor platform performance and usage. These services may collect anonymised data as described in their own privacy policies.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Links to external news sources and social media platforms on ZamVibe are governed by the privacy policies of those respective services. We encourage you to review their terms before sharing personal information.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">6. Data Security</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                We implement appropriate technical and organisational measures to protect the limited data we collect. Our platform uses SSL/TLS encryption, and all data is processed on secure infrastructure.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                Given that we collect minimal personal data, the risk associated with data breaches is inherently low. However, we take all reasonable precautions to safeguard any information stored on our systems.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">7. Your Rights</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                Under the Data Protection Act of Zambia, you have the right to access, correct, or request deletion of any personal data we hold about you. You can exercise these rights by contacting our Data Protection Officer at privacy@zamvibe.com.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                If you believe your personal information has been processed in violation of your rights, you may lodge a complaint with the Office of the Data Protection Commissioner in Zambia.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">8. Data Retention</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                Contact form submissions are retained for up to 12 months after the enquiry has been resolved, after which they are permanently deleted. Analytics data is retained in anonymised form for up to 26 months for trend analysis.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                You may request immediate deletion of your contact form data at any time by emailing privacy@zamvibe.com.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h3 className="text-[#ff4444] font-semibold text-lg mb-3">9. Contact Us</h3>
              <p className="text-[#aaaaaa] text-sm leading-relaxed">
                For any privacy-related questions, concerns, or requests, please contact our Data Protection Officer at privacy@zamvibe.com. We aim to respond to all privacy-related enquiries within 15 business days.
              </p>
              <p className="text-[#aaaaaa] text-sm leading-relaxed mt-2">
                You can also reach us through our Contact page. ZamVibe is committed to operating transparently and in compliance with the Data Protection Act of Zambia.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
