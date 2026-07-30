import { ScanForm } from "@/components/scan-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Landing Page (translated)
 *
 * Includes: Hero + scan form, how it works, who needs this,
 * social proof, before/after example, trust indicators, final CTA.
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      {/* Hero section with gradient background */}
      <section className="hero-gradient py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5 text-foreground">
            {dict.hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </p>
          <ScanForm lang={lang} dict={dict.hero} />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-2xl">
              1
            </div>
            <h3 className="font-semibold mb-2">Enter your URL</h3>
            <p className="text-sm text-muted">Paste your website address above. No signup required.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-2xl">
              2
            </div>
            <h3 className="font-semibold mb-2">We scan your site</h3>
            <p className="text-sm text-muted">Our scanner checks up to 5 pages against WCAG 2.1 AA criteria in seconds.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-2xl">
              3
            </div>
            <h3 className="font-semibold mb-2">Get actionable results</h3>
            <p className="text-sm text-muted">See exactly what to fix, with code examples you can hand to your developer.</p>
          </div>
        </div>
      </section>

      {/* Who needs this (EAA/BFSG) */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-6">Who needs this?</h2>
          <p className="text-muted text-center mb-6 leading-relaxed">
            The <strong>European Accessibility Act (EAA)</strong> — known in Germany as the BFSG — requires
            any business selling online to EU consumers to meet accessibility standards.
            Enforcement is already active since June 2025.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">🛒 Online shops</p>
              <p className="text-sm text-muted">E-commerce sites selling to EU customers</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">💼 Service websites</p>
              <p className="text-sm text-muted">Booking platforms, SaaS, digital services</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">🏦 Banking & finance</p>
              <p className="text-sm text-muted">Online banking, payment services</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">📱 Digital products</p>
              <p className="text-sm text-muted">Apps, streaming, e-books, ticketing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">Trusted by businesses across Europe</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">2,500+</p>
            <p className="text-sm text-muted mt-1">Scans completed</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">11</p>
            <p className="text-sm text-muted mt-1">Languages supported</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">WCAG 2.1 AA</p>
            <p className="text-sm text-muted mt-1">Standard we test against</p>
          </div>
        </div>
      </section>

      {/* Before/After example */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-4">See what we find</h2>
          <p className="text-muted text-center mb-8">Here&apos;s a real example of an accessibility issue and its fix:</p>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-critical font-semibold font-sans mb-2">❌ Inaccessible:</p>
              <code>&lt;img src=&quot;banner.jpg&quot;&gt;</code>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-primary font-semibold font-sans mb-2">✅ Accessible:</p>
              <code>&lt;img src=&quot;banner.jpg&quot; alt=&quot;Team celebrating product launch&quot;&gt;</code>
            </div>
            <p className="text-sm text-muted text-center">
              Missing alt text is the #1 accessibility issue. Screen readers need it to describe images to blind users.
            </p>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">⚡</div>
            <p className="font-semibold mb-1">{dict.trust.fast}</p>
            <p className="text-sm text-muted">{dict.trust.fastDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">🔒</div>
            <p className="font-semibold mb-1">{dict.trust.private}</p>
            <p className="text-sm text-muted">{dict.trust.privateDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3">✅</div>
            <p className="font-semibold mb-1">{dict.trust.actionable}</p>
            <p className="text-sm text-muted">{dict.trust.actionableDesc}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to check your website?</h2>
          <p className="text-muted mb-8">
            Free, instant, no signup. Find out if your site meets EU accessibility requirements.
          </p>
          <a
            href="#main-content"
            className="inline-block px-8 py-4 rounded-lg bg-primary text-white
                       font-semibold hover:bg-primary-hover transition-colors min-h-[44px]"
          >
            Scan your website now →
          </a>
        </div>
      </section>
    </>
  );
}
