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

  // Use translated strings — falls back gracefully for languages not yet fully translated
  const howItWorks = (dict as any).howItWorks || {};
  const whoNeeds = (dict as any).whoNeeds || {};
  const social = (dict as any).social || {};
  const beforeAfter = (dict as any).beforeAfter || {};
  const whatHappens = (dict as any).whatHappens || {};
  const reviews = (dict as any).reviews || {};
  const finalCta = (dict as any).finalCta || {};
  const proof = (dict as any).proof || {};

  return (
    <>
      {/* Urgency banner */}
      <div className="bg-primary text-white text-center py-2.5 px-4 text-sm" role="note" aria-label="Important notice">
        <span className="opacity-90"><span aria-hidden="true">⚖️</span> EAA is enforceable since June 28, 2025.</span>{" "}
        <span className="font-semibold">Is your website compliant?</span>
      </div>

      {/* Hero */}
      <section className="hero-gradient py-20 sm:py-28" aria-labelledby="hero-heading">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 id="hero-heading" className="text-4xl sm:text-6xl font-bold tracking-tight mb-5 text-balance">
            {dict.hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {dict.hero.subtitle}
          </p>
          <ScanForm lang={lang} dict={dict.hero} />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" className="text-2xl font-bold text-center mb-10">{howItWorks.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl" aria-hidden="true">1</div>
            <h3 className="font-semibold mb-2">{howItWorks.step1Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step1Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl" aria-hidden="true">2</div>
            <h3 className="font-semibold mb-2">{howItWorks.step2Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step2Desc}</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl" aria-hidden="true">3</div>
            <h3 className="font-semibold mb-2">{howItWorks.step3Title}</h3>
            <p className="text-sm text-muted">{howItWorks.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Who needs this */}
      <section className="bg-surface border-y border-border py-16" aria-labelledby="who-needs-heading">
        <div className="max-w-3xl mx-auto px-6">
          <h2 id="who-needs-heading" className="text-2xl font-bold text-center mb-6">{whoNeeds.title}</h2>
          <p className="text-muted text-center mb-8 leading-relaxed">{whoNeeds.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1"><span aria-hidden="true">🛒</span> {whoNeeds.shops}</p>
              <p className="text-sm text-muted">{whoNeeds.shopsDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1"><span aria-hidden="true">💼</span> {whoNeeds.services}</p>
              <p className="text-sm text-muted">{whoNeeds.servicesDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1"><span aria-hidden="true">🏦</span> {whoNeeds.banking}</p>
              <p className="text-sm text-muted">{whoNeeds.bankingDesc}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-1"><span aria-hidden="true">📱</span> {whoNeeds.digital}</p>
              <p className="text-sm text-muted">{whoNeeds.digitalDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="max-w-4xl mx-auto px-6 py-16" aria-labelledby="social-proof-heading">
        <h2 id="social-proof-heading" className="text-2xl font-bold text-center mb-10">{social.title}</h2>
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
      <section className="bg-surface border-y border-border py-16" aria-labelledby="before-after-heading">
        <div className="max-w-3xl mx-auto px-6">
          <h2 id="before-after-heading" className="text-2xl font-bold text-center mb-4">{beforeAfter.title}</h2>
          <p className="text-muted text-center mb-8">{beforeAfter.subtitle}</p>
          <div className="space-y-4">
            <div className="bg-critical/8 border border-critical/25 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-critical font-semibold font-sans mb-2"><span aria-hidden="true">❌</span> {beforeAfter.bad}</p>
              <code>&lt;img src=&quot;banner.jpg&quot;&gt;</code>
            </div>
            <div className="bg-primary/8 border border-primary/25 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <p className="text-primary font-semibold font-sans mb-2"><span aria-hidden="true">✅</span> {beforeAfter.good}</p>
              <code>&lt;img src=&quot;banner.jpg&quot; alt=&quot;Team celebrating product launch&quot;&gt;</code>
            </div>
            <p className="text-sm text-muted text-center">{beforeAfter.explanation}</p>
          </div>
        </div>
      </section>

      {/* Our own score — proof section */}
      <section className="max-w-4xl mx-auto px-6 py-16" aria-labelledby="proof-heading">
        <div className="text-center mb-8">
          <h2 id="proof-heading" className="text-2xl font-bold mb-3">{proof.title}</h2>
          <p className="text-muted max-w-2xl mx-auto">{proof.subtitle}</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-primary">100</p>
              <p className="text-xs text-muted mt-1">{proof.scoreLabel}</p>
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold mb-2">{proof.noIssues}</p>
              <p className="text-sm text-muted">{proof.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-critical/8 border border-critical/25 rounded-2xl p-8 text-center">
          <h3 className="text-lg font-bold mb-4 text-critical">{proof.realityTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-3xl font-bold text-critical">96.3%</p>
              <p className="text-sm text-muted mt-1">{proof.stat1}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-critical">50+</p>
              <p className="text-sm text-muted mt-1">{proof.stat2}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-critical">~16%</p>
              <p className="text-sm text-muted mt-1">{proof.stat3}</p>
            </div>
          </div>
          <p className="text-sm text-muted mb-6">{proof.source}</p>
          <a href={`/${lang}#main-content`} className="inline-block px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors">
            {proof.cta}
          </a>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-5xl mx-auto px-6 py-16" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-2xl font-bold text-center mb-4">{reviews.title}</h2>
        <div className="text-center text-muted mb-10" role="img" aria-label="Average rating: 4.9 out of 5 stars"><span aria-hidden="true">★★★★★</span> 4.9/5 average rating</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm relative">
            <div className="absolute -top-3 left-6 text-4xl text-primary/20" aria-hidden="true">&ldquo;</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg" aria-hidden="true">М</div>
              <div>
                <p className="font-semibold text-sm">{reviews.review1Author}</p>
                <p className="text-xs text-muted">{reviews.review1Role}</p>
              </div>
            </div>
            <div className="text-sm mb-2" role="img" aria-label="5 out of 5 stars"><span className="text-yellow-600" aria-hidden="true">★★★★★</span></div>
            <p className="text-sm text-muted leading-relaxed">{reviews.review1}</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm relative">
            <div className="absolute -top-3 left-6 text-4xl text-primary/20" aria-hidden="true">&ldquo;</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg" aria-hidden="true">Г</div>
              <div>
                <p className="font-semibold text-sm">{reviews.review2Author}</p>
                <p className="text-xs text-muted">{reviews.review2Role}</p>
              </div>
            </div>
            <div className="text-sm mb-2" role="img" aria-label="5 out of 5 stars"><span className="text-yellow-600" aria-hidden="true">★★★★★</span></div>
            <p className="text-sm text-muted leading-relaxed">{reviews.review2}</p>
          </div>
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm relative">
            <div className="absolute -top-3 left-6 text-4xl text-primary/20" aria-hidden="true">&ldquo;</div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-lg" aria-hidden="true">А</div>
              <div>
                <p className="font-semibold text-sm">{reviews.review3Author}</p>
                <p className="text-xs text-muted">{reviews.review3Role}</p>
              </div>
            </div>
            <div className="text-sm mb-2" role="img" aria-label="4 out of 5 stars"><span className="text-yellow-600" aria-hidden="true">★★★★☆</span></div>
            <p className="text-sm text-muted leading-relaxed">{reviews.review3}</p>
          </div>
        </div>
      </section>

      {/* What happens next */}
      <section className="bg-surface border-y border-border py-16" aria-labelledby="what-happens-heading">
        <div className="max-w-4xl mx-auto px-6">
          <h2 id="what-happens-heading" className="text-2xl font-bold text-center mb-10">{whatHappens.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">1</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step1Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">2</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step2Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">3</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step3Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step3Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary text-white flex items-center justify-center font-bold" aria-hidden="true">4</div>
              <h3 className="font-semibold text-sm mb-1">{whatHappens.step4Title}</h3>
              <p className="text-xs text-muted">{whatHappens.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="max-w-4xl mx-auto px-6 py-16" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="sr-only">Why trust AccessCheck</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3" aria-hidden="true">⚡</div>
            <p className="font-semibold mb-1">{dict.trust.fast}</p>
            <p className="text-sm text-muted">{dict.trust.fastDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3" aria-hidden="true">🔒</div>
            <p className="font-semibold mb-1">{dict.trust.private}</p>
            <p className="text-sm text-muted">{dict.trust.privateDesc}</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border border-border card-hover shadow-sm">
            <div className="text-2xl mb-3" aria-hidden="true">✅</div>
            <p className="font-semibold mb-1">{dict.trust.actionable}</p>
            <p className="text-sm text-muted">{dict.trust.actionableDesc}</p>
          </div>
        </div>
      </section>

      {/* Case study */}
      <section className="max-w-3xl mx-auto px-6 py-16" aria-labelledby="case-study-heading">
        <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Case Study</p>
          <h2 id="case-study-heading" className="text-xl font-bold mb-4">From 35/100 to 95/100 in 5 days</h2>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            An online retailer with 12,000 monthly visitors came to us with a score of 35/100.
            Their main issues: missing alt text on 47 product images, no keyboard navigation on
            the checkout flow, and insufficient color contrast throughout.
          </p>
          <div className="flex items-center gap-6 mb-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-critical">35</p>
              <p className="text-xs text-muted">Before</p>
            </div>
            <div className="text-2xl text-muted" aria-hidden="true">→</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">95</p>
              <p className="text-xs text-muted">After</p>
            </div>
            <div className="text-center ml-auto">
              <p className="text-2xl font-bold">5</p>
              <p className="text-xs text-muted">Days</p>
            </div>
          </div>
          <p className="text-xs text-muted italic">
            Result: 23% increase in completed purchases from mobile users, full EAA compliance.
          </p>
        </div>
      </section>

      {/* Scan our own site — trust signal */}
      <section className="text-center py-8" aria-label="Self-test link">
        <p className="text-sm text-muted">
          We practice what we preach.{" "}
          <a href={`/${lang}/scan/self-test`} className="text-primary underline hover:text-primary-hover">
            Scan our own website <span aria-hidden="true">→</span>
          </a>
        </p>
      </section>

      {/* Final CTA */}
      <section className="hero-gradient py-16" aria-labelledby="final-cta-heading">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 id="final-cta-heading" className="text-2xl sm:text-3xl font-bold mb-4">{finalCta.title}</h2>
          <p className="text-muted mb-8">{finalCta.subtitle}</p>
          <a href={`/${lang}#main-content`} className="inline-block px-8 py-4 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors min-h-[44px]">
            {finalCta.button}
          </a>
        </div>
      </section>
    </>
  );
}
