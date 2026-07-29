import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Privacy Policy Page (placeholder - translated header)
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">{dict.nav.privacy}</h1>

      <div className="text-sm text-muted space-y-4">
        <p>[Placeholder — replace with real privacy policy before launch.]</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>What data is collected via the scan (URL, scan results)</li>
          <li>What data is collected via the contact form (name, email, company, message)</li>
          <li>Payment processing via Stripe (we never store card details directly)</li>
          <li>How long data is retained</li>
          <li>Legal basis for processing</li>
          <li>Right to access, rectify, delete personal data (GDPR rights)</li>
          <li>Contact information for data protection inquiries</li>
        </ul>
      </div>
    </section>
  );
}
