import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import { PaymentButton } from "@/components/payment-button";
import { CopyButton } from "@/components/copy-button";

/**
 * Paid Report Page (translated)
 * - Shows payment gate OR unlocked report content
 */

interface Props {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<{ tier?: string; paid?: string }>;
}

export default async function ReportPage({ params, searchParams }: Props) {
  const { lang, id } = await params;
  const { tier, paid } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const isFullTier = tier === "full";
  const price = isFullTier ? "€3" : "€1";
  const tierName = isFullTier ? dict.paidReport.fullName : dict.paidReport.detailedName;
  const isPaid = paid === "true";

  // If paid, show the unlocked report content
  if (isPaid) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
          <p className="text-green-800 font-medium">
            ✅ Payment confirmed — your {tierName} is unlocked below.
          </p>
        </div>

        <h1 className="text-2xl font-bold mb-6">{tierName}</h1>

        {/* TODO: Fetch and display full scan results from Supabase */}
        <div className="bg-surface rounded-xl border border-border p-8">
          <p className="text-muted text-center">
            Full report content will be displayed here once the detailed scan
            data is loaded from the database.
          </p>
        </div>
      </section>
    );
  }

  // Payment gate
  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{tierName}</h1>
      <div className="mb-8">
        <CopyButton text={id} label="Scan ID:" />
      </div>

      <div className="bg-surface rounded-xl border border-border p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{dict.paidReport.unlockTitle}</h2>
        <p className="text-muted mb-6">
          {dict.paidReport.unlockDesc.replace("{price}", price)}
        </p>

        <div className="mb-6 text-sm text-muted">
          {isFullTier ? (
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.violations}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.explanation}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.effort}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.selectors}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.pdf}
              </li>
            </ul>
          ) : (
            <ul className="text-left max-w-md mx-auto space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.violations}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.explanation}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.effort}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {dict.paidReport.features.grouped}
              </li>
            </ul>
          )}
        </div>

        <PaymentButton
          scanId={id}
          tier={tier || "detailed"}
          lang={lang}
          label={dict.paidReport.payButton.replace("{price}", price)}
        />

        <p className="text-xs text-muted mt-4">{dict.paidReport.stripeNote}</p>
      </div>
    </section>
  );
}
