import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Terms & Conditions Page
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Terms &amp; Conditions</h1>

      <div className="space-y-8 text-sm leading-relaxed text-muted">

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">1. Service Description</h2>
          <p className="mb-2">
            AccessCheck provides an automated web accessibility scanning service that checks websites
            against WCAG 2.1 Level AA and WCAG 2.2 criteria, as well as industry best practices.
            The service uses the open-source axe-core engine to identify potential accessibility violations.
          </p>
          <p>
            The scan covers publicly accessible HTML content only. It does not test content behind
            authentication, dynamically generated content that requires user interaction, PDF documents,
            native mobile applications, or third-party embedded content (e.g., iframes from external domains).
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">2. Scope and Limitations of Automated Testing</h2>
          <p className="mb-2">Our automated scanner checks for, but is not limited to:</p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Color contrast ratios (WCAG 2.1 SC 1.4.3, 1.4.6)</li>
            <li>Image alternative text (SC 1.1.1)</li>
            <li>Form input labels and associations (SC 1.3.1, 3.3.2)</li>
            <li>Keyboard accessibility indicators (SC 2.1.1, 2.4.7)</li>
            <li>ARIA attribute correctness (SC 4.1.2)</li>
            <li>Document structure and heading hierarchy (SC 1.3.1)</li>
            <li>Link and button accessible names (SC 2.4.4, 4.1.2)</li>
            <li>Language attributes (SC 3.1.1)</li>
            <li>Flashing content detection (SC 2.3.1)</li>
          </ul>
          <p className="mb-2"><strong>The following require manual expert review and are NOT covered by automated scanning:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Behavior at 200% browser zoom (SC 1.4.4)</li>
            <li>Real assistive technology compatibility (screen readers, switch devices)</li>
            <li>PDF and document accessibility</li>
            <li>Complex interactive widget behavior (modals, date pickers, carousels)</li>
            <li>Content clarity and plain language</li>
            <li>Accuracy and meaningfulness of alternative text</li>
            <li>Cognitive accessibility considerations</li>
            <li>Captions and audio descriptions for multimedia</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">3. No Legal Compliance Guarantee</h2>
          <p className="mb-2">
            <strong>The AccessCheck scan results do NOT constitute a legal compliance certification.</strong>{" "}
            A passing score does not guarantee compliance with the European Accessibility Act (EAA),
            EN 301 549, or any national implementation thereof.
          </p>
          <p className="mb-2">
            Automated tools typically detect 30-50% of all possible accessibility barriers.
            Full compliance requires a combination of automated testing, manual expert review,
            and testing with real assistive technology users.
          </p>
          <p>
            We recommend using our scan as a starting point and pursuing a professional manual
            audit for legal compliance assurance.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">4. Remediation Services</h2>
          <p className="mb-2">
            When you engage our remediation service ("fix my website"), the scope of work is defined
            in a separate written agreement (proposal/quote) before any work begins. This agreement specifies:
          </p>
          <ul className="list-disc pl-6 space-y-1 mb-3">
            <li>Exact scope of issues to be addressed</li>
            <li>Timeline for delivery</li>
            <li>Price and payment terms (advance payment required)</li>
            <li>What is explicitly excluded</li>
            <li>Acceptance criteria</li>
          </ul>
          <p>
            Work begins only after written confirmation and advance payment. The final deliverable is
            provided after full payment is received.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">5. Paid Reports</h2>
          <p>
            Paid reports (Detailed Report €1, Full Report + PDF €3) provide expanded information
            from the same automated scan. They do not include manual testing or human review.
            Payment is non-refundable once the report is generated and delivered.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">6. Data and Privacy</h2>
          <p className="mb-2">
            We scan only publicly accessible pages. We do not access content behind authentication,
            store passwords, or process personal data from the scanned website&apos;s visitors.
          </p>
          <p>
            Scan results are stored for 24 hours for caching purposes.
            Contact form submissions are stored as described in our{" "}
            <a href={`/${lang}/privacy`} className="text-primary underline">Privacy Policy</a>.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
          <p>
            AccessCheck and VV Labs EOOD shall not be liable for any direct, indirect, incidental,
            or consequential damages arising from the use of our scanning service, reliance on scan results,
            or any regulatory action taken against the user&apos;s website. Our service is provided &quot;as is&quot;
            without warranties of any kind, express or implied.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of the Republic of Bulgaria. Any disputes shall be
            resolved in the courts of Sofia, Bulgaria.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">9. Contact</h2>
          <p>
            VV Labs EOOD<br />
            Email: contact@accesscheck.eu<br />
            For questions about these terms, please use our{" "}
            <a href={`/${lang}/contact`} className="text-primary underline">contact form</a>.
          </p>
        </div>

        <p className="text-xs text-muted border-t border-border pt-4">
          Last updated: August 2026
        </p>
      </div>
    </section>
  );
}
