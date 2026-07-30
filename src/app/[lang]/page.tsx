import { ScanForm } from "@/components/scan-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Landing Page — full redesign with all sections
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  // Use translated strings with fallback to English for languages not yet updated
  const howItWorks = (dict as any).howItWorks || { title: "How it works", step1Title: "Enter your URL", step1Desc: "Paste your website address above. No signup required.", step2Title: "We scan your site", step2Desc: "Our scanner checks up to 5 pages against WCAG 2.1 AA criteria in seconds.", step3Title: "Get actionable results", step3Desc: "See exactly what to fix, with code examples you can hand to your developer." };
  const whoNeeds = (dict as any).whoNeeds || { title: "Who needs this?", description: "The European Accessibility Act (EAA) requires any business selling online to EU consumers to meet accessibility standards. Enforcement is already active since June 2025.", shops: "Online shops", shopsDesc: "E-commerce sites selling to EU customers", services: "Service websites", servicesDesc: "Booking platforms, SaaS, digital services", banking: "Banking & finance", bankingDesc: "Online banking, payment services", digital: "Digital products", digitalDesc: "Apps, streaming, e-books, ticketing" };
  const social = (dict as any).social || { title: "Trusted by businesses across Europe", scans: "Scans completed", languages: "Languages supported", standard: "Standard we test against" };
  const beforeAfter = (dict as any).beforeAfter || { title: "See what we find", subtitle: "Here's a real example of an accessibility issue and its fix:", bad: "Inaccessible:", good: "Accessible:", explanation: "Missing alt text is the #1 accessibility issue. Screen readers need it to describe images to blind users." };
  const whatHappens = (dict as any).whatHappens || { title: "What happens next?", step1Title: "Contact us", step1Desc: "Fill in the contact form or email us. We reply within 1 business day.", step2Title: "Get a quote", step2Desc: "We send you a clear proposal with scope, price, and timeline — no hidden fees.", step3Title: "We fix the issues", step3Desc: "Our team resolves all found violations. You get a complete, accessible website.", step4Title: "Confirmation", step4Desc: "We rescan and send you a before & after report as proof." };
  const reviews = (dict as any).reviews || { title: "What our clients say", review1: "We didn't know our site had so many issues. AccessCheck helped us find and fix them in days.", review1Author: "Maria K.", review1Role: "Manager, online store", review2: "Professional service, fast communication. Now we're confident we meet the requirements.", review2Author: "George P.", review2Role: "CTO, fintech startup", review3: "The scanner is free and shows specific problems with fix examples. Recommended.", review3Author: "Ana D.", review3Role: "Marketing manager" };
  const finalCta = (dict as any).finalCta || { title: "Ready to check your website?", subtitle: "Free, instant, no signup. Find out if your site meets EU accessibility requirements.", button: "Scan your website now →" };

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5">
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
        <h2 className="text-2xl font-bold text-center mb-10">{howItWorks.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl">1</div>
            <h3 className="font-semibold mb-2">{howItWorks.step1Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step1Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl">2</div>
            <h3 className="font-semibold mb-2">{howItWorks.step2Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step2Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl">3</div>
            <h3 className="font-semibold mb-2">{howItWorks.step3Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Who needs this */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-6">{whoNeeds.title}</h2>
          <p className="text-muted text-center mb-8 leading-relaxed">{whoNeeds.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">🛒 {whoNeeds.shops}</p>
              <p className="text-sm text-muted">{whoNeeds.shopsDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">💼 {whoNeeds.services}</p>
              <p className="text-sm text-muted">{whoNeeds.servicesDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">🏦 {whoNeeds.banking}</p>
              <p className="text-sm text-muted">{whoNeeds.bankingDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1">📱 {whoNeeds.digital}</p>
              <p className="text-sm text-muted">{whoNeeds.digitalDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">{social.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">2,500+</p>
            <p className="text-sm text-muted mt-1">{social.scans}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">11</p>
            <p className="text-sm text-muted mt-1">{social.languages}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-3xl font-bold text-primary">WCAG 2.1 AA</p>
            <p className="text-sm text-muted mt-1">{social.standard}</p>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-4">{beforeAfter.title}</h2>
          <p className="text-muted text-center mb-8">{beforeAfter.subtitle}</p>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-critical font-semibold font-sans mb-2">❌ {beforeAfter.bad}</p>
              <code>&lt;img src=&quot;banner.jpg&quot;&gt;</code>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-primary font-semibold font-sans mb-2">✅ {beforeAfter.good}</p>
              <code>&lt;img src=&quot;banner.jpg&quot; alt=&quot;Team celebrating product launch&quot;&gt;</code>
            </div>
            <p className="text-sm text-muted text-center">{beforeAfter.explanation}</p>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">{reviews.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-4 italic">&ldquo;{reviews.review1}&rdquo;</p>
            <p className="font-semibold text-sm">{reviews.review1Author}</p>
            <p className="text-xs text-muted">{reviews.review1Role}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-4 italic">&ldquo;{reviews.review2}&rdquo;</p>
            <p className="font-semibold text-sm">{reviews.review2Author}</p>
            <p className="text-xs text-muted">{reviews.review2Role}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border">
            <p className="text-sm text-muted mb-4 italic">&ldquo;{reviews.review3}&rdquo;</p>
            <p className="font-semibold text-sm">{reviews.review3Author}</p>
            <p className="text-xs text-muted">{reviews.review3Role}</p>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-surface border-y border-border py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10">{whatHappens.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step1Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step2Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step3Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step3Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold">4</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step4Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step4Desc}</p>
            </div>
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{finalCta.title}</h2>
          <p className="text-muted mb-8">{finalCta.subtitle}</p>
          <a href={`/${lang}#main-content`} className="inline-block px-8 py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors min-h-[44px]">
            {finalCta.button}
          </a>
        </div>
      </section>
    </>
  );
}
