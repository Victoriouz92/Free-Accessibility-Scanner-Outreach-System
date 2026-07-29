import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Paid Report Page (translated)
 */

interface Props {
  params: Promise<{ lang: string; id: string }>;
  searchParams: Promise<{ tier?: string }>;
}

export default async function ReportPage({ params, searchParams }: Props) {
  const { lang, id } = await params;
  const { tier } = await searchParams;
  const dict = await getDictionary(lang as Locale);

  const isFullTier = tier === "full";
  const price = isFullTier ? "€3" : "€1";
  const tierName = isFullTier ? dict.paidReport.fullName : dict.paidReport.detailedName;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{tierName}</h1>
      <p className="text-muted mb-8">Scan ID: {id}</p>

      {/* Payment gate placeholder */}
      <div className="bg-surface rounded-xl border border-border p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">{dict.paidReport.unlockTitle}</h2>
        <p className="text-muted mb-6">
          {dict.paidReport.unlockDesc.replace("{price}", price)}
        </p>

        <div className="mb-4 text-sm text-muted">
          {isFullTier ? (
            <ul className="text-left max-w-md mx-auto space-y-1">
              <li>✓ {dict.paidReport.features.violations}</li>
              <li>✓ {dict.paidReport.features.explanation}</li>
              <li>✓ {dict.paidReport.features.effort}</li>
              <li>✓ {dict.paidReport.features.selectors}</li>
              <li>✓ {dict.paidReport.features.pdf}</li>
            </ul>
          ) : (
            <ul className="text-left max-w-md mx-auto space-y-1">
              <li>✓ {dict.paidReport.features.violations}</li>
              <li>✓ {dict.paidReport.features.explanation}</li>
              <li>✓ {dict.paidReport.features.effort}</li>
              <li>✓ {dict.paidReport.features.grouped}</li>
            </ul>
          )}
        </div>

        {/* TODO: Replace with Stripe Checkout button */}
        <button
          className="px-8 py-3 rounded-lg bg-primary text-white font-semibold
                     hover:bg-primary-hover transition-colors min-h-[44px]"
        >
          {dict.paidReport.payButton.replace("{price}", price)}
        </button>

        <p className="text-xs text-muted mt-4">{dict.paidReport.stripeNote}</p>
      </div>
    </section>
  );
}
