import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Contact Page (translated)
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  return (
    <section className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">{dict.contact.title}</h1>
      <p className="text-muted mb-8">{dict.contact.subtitle}</p>

      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm lang={lang} dict={dict.contact} />
      </Suspense>
    </section>
  );
}
