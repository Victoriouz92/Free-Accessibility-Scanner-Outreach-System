import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

/**
 * Privacy Policy Page
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const isBg = lang === "bg";

  if (isBg) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12" aria-labelledby="privacy-heading">
        <h1 id="privacy-heading" className="text-2xl font-bold mb-6">{dict.nav.privacy}</h1>

        <div className="text-sm text-muted space-y-6">
          <p>Последна актуализация: 7 август 2026 г.</p>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Кои сме ние</h2>
            <p>
              AccessCheck е разработен от VV Labs, независим софтуерен проект, изграждащ практични
              AI инструменти за бизнеса, базиран на ул. „Казбек“ 30, София 1618, България
              („ние“). Тази политика обяснява какви данни събираме чрез този уебсайт, защо, и какви
              права имате съгласно Общия регламент за защита на данните на ЕС (ОРЗД/GDPR). За
              пълните ни данни вижте страницата{" "}
              <a href={`/${lang}/imprint`} className="text-primary underline">Импресум</a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Данни, които събираме</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Сканиране на уебсайтове:</strong> когато въведете URL адрес за сканиране, ние
                изпращаме този адрес към нашия доставчик за рендиране (Browserless.io), за да извлечем
                HTML кода на страницата, след което го анализираме локално за проблеми с достъпността.
                Съхраняваме сканирания URL адрес, получения резултат, брой проблеми, няколко примерни
                нарушения и продължителността на сканирането. Не изискваме регистрация и не събираме
                съзнателно лични данни за вас чрез самото сканиране.
              </li>
              <li>
                <strong>Контактна форма:</strong> ако ни пишете или поискате доклад по имейл, събираме
                вашето име, имейл адрес, незадължително име на фирма, незадължително съобщение,
                сканирането, за което се отнася (ако има такова), и записан с времеви печат запис на
                съгласието, което сте дали.
              </li>
              <li>
                <strong>Плащания за доклади:</strong> ако закупите подробен (€1) или пълен (€3) доклад,
                плащането се обработва изцяло от Stripe. Никога не виждаме и не съхраняваме данните
                на картата ви. Съхраняваме статуса на плащането, сумата, валутата, идентификаторите
                на сесията/транзакцията от Stripe, и имейл адреса, предоставен ни от Stripe след
                плащането, свързани със съответното сканиране.
              </li>
              <li>
                <strong>Локални предпочитания:</strong> съхраняваме избора ви на тъмен/светъл режим в
                локалното хранилище на браузъра ви. Това остава на вашето устройство и никога не се
                изпраща към нас.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Бисквитки и проследяване</h2>
            <p>
              Този уебсайт не използва бисквитки и не изпълнява никакви анализи, реклами или скриптове
              за проследяване. Предпочитаният от вас език се определя от хедъра Accept-Language на
              браузъра ви при всяка заявка и не се съхранява от нас.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Трети страни, които използваме (обработващи данни)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase</strong> — хоства нашата база данни (резултати от сканиране, съобщения от контактната форма, записи за плащания).</li>
              <li><strong>Browserless.io</strong> — рендира страниците, които ни молите да сканираме.</li>
              <li><strong>Stripe</strong> — обработва плащанията за доклади и ни предоставя имейл адреса на купувача след плащане.</li>
              <li><strong>Vercel</strong> — хоства този уебсайт и, както всеки уеб хостинг, може да записва IP адреси в сървърни/CDN логове за целите на сигурност и надеждност.</li>
            </ul>
            <p className="mt-2">
              Имаме сключени споразумения за обработка на данни с нашите обработващи данни, където
              това се изисква от ОРЗД. Никой от тези доставчици не използва вашите данни за собствени
              маркетингови цели.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Правно основание за обработка</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Изпълнение на заявено от вас сканиране: легитимен интерес за предоставяне на услугата, която сте поискали.</li>
              <li>Контактна форма и заявки за доклади: съгласие, дадено изрично чрез отметката при подаване.</li>
              <li>Плащания: изпълнение на договор (доставяне на доклада, за който сте платили).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Колко дълго съхраняваме данните</h2>
            <p>
              Резултатите от сканирането се съхраняват, за да можем да предоставяме кеширани резултати
              при повторни сканирания и да изпълняваме заявки за платени доклади.
            </p>
            <p className="mt-2">
              Съобщения от контактната форма: съхраняваме личните данни, подадени чрез контактната
              форма, само за времето, необходимо за отговор на запитването и управление на
              произтичащата бизнес връзка, а след това — не по-дълго от изискваното от приложимите
              законови задължения.
            </p>
            <p className="mt-2">
              Записите за плащания се съхраняват за периода, изискван от приложимите счетоводни и
              данъчни задължения. Ще изтрием или анонимизираме данните по-рано при поискване, когато
              не сме законово задължени да ги пазим.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Вашите права</h2>
            <p>Съгласно ОРЗД имате право на:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Достъп до личните данни, които съхраняваме за вас</li>
              <li>Искане за коригиране на неточни данни</li>
              <li>Искане за изтриване на вашите данни („право да бъдете забравени“)</li>
              <li>Оттегляне на съгласието по всяко време, без да се засяга обработката, извършена преди оттеглянето</li>
              <li>Възражение срещу или искане за ограничаване на обработката</li>
              <li>Искане за копие на вашите данни в преносим формат</li>
              <li>Подаване на жалба до националния орган за защита на данните</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">8. Свържете се с нас</h2>
            <p>
              За въпроси, свързани с поверителността, или за упражняване на правата ви, свържете се с
              нас на{" "}
              <a href="mailto:vvlabseood@gmail.com" className="text-primary underline">
                vvlabseood@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-12" aria-labelledby="privacy-heading">
      <h1 id="privacy-heading" className="text-2xl font-bold mb-6">{dict.nav.privacy}</h1>

      <div className="text-sm text-muted space-y-6">
        <p>Last updated: August 7, 2026</p>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Who we are</h2>
          <p>
            AccessCheck is built by VV Labs, an independent software project building practical
            AI-powered tools for businesses, based at Kazbek 30 Str., Sofia 1618, Bulgaria
            (&ldquo;we&rdquo;, &ldquo;us&rdquo;). This policy explains what data we collect through
            this website, why, and what rights you have under the EU General Data Protection
            Regulation (GDPR). For our full details see the{" "}
            <a href={`/${lang}/imprint`} className="text-primary underline">Imprint</a> page.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Data we collect</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Website scans:</strong> when you enter a URL to scan, we submit that URL to
              our rendering provider (Browserless.io) to fetch the page&apos;s HTML, then analyze
              it locally for accessibility issues. We store the scanned URL, the resulting score,
              issue counts, a few example violations, and scan duration. We do not require an
              account and do not knowingly collect personal data about you through the scan itself.
            </li>
            <li>
              <strong>Contact form:</strong> if you contact us or request a report by email, we
              collect your name, email address, optional company name, optional message, the scan
              this relates to (if any), and a timestamped record of the consent you gave.
            </li>
            <li>
              <strong>Report payments:</strong> if you purchase a detailed (€1) or full (€3)
              report, payment is handled entirely by Stripe. We never see or store your card
              details. We store the payment status, amount, currency, Stripe&apos;s session/
              transaction IDs, and the email address Stripe provides us after checkout, linked to
              the relevant scan.
            </li>
            <li>
              <strong>Local preferences:</strong> we store your dark/light mode choice in your
              browser&apos;s local storage. This stays on your device and is never sent to us.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Cookies &amp; tracking</h2>
          <p>
            This website does not use cookies and does not run any analytics, advertising, or
            tracking scripts. Your preferred language is detected from your browser&apos;s
            Accept-Language header on each request and is not stored by us.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Third parties we use (processors)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Supabase</strong> — hosts our database (scan results, contact submissions, payment records).</li>
            <li><strong>Browserless.io</strong> — renders the pages you ask us to scan.</li>
            <li><strong>Stripe</strong> — processes report payments and provides us the buyer&apos;s email after checkout.</li>
            <li><strong>Vercel</strong> — hosts this website and, like any web host, may log IP addresses in server/CDN logs for security and reliability purposes.</li>
          </ul>
          <p className="mt-2">
            We have data processing agreements in place with our processors where required by
            GDPR. None of these providers use your data for their own marketing purposes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Legal basis for processing</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Running a scan you requested: legitimate interest in providing the service you asked for.</li>
            <li>Contact form and report requests: consent, given explicitly via the checkbox at submission.</li>
            <li>Payments: performance of a contract (delivering the report you paid for).</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. How long we keep data</h2>
          <p>
            Scan results are kept to allow us to serve cached results for repeat scans and to
            fulfil paid report requests.
          </p>
          <p className="mt-2">
            Contact form submissions: we retain personal data submitted through the contact form
            only for as long as necessary to respond to the inquiry and manage the resulting
            business relationship, and thereafter for no longer than required by applicable legal
            obligations.
          </p>
          <p className="mt-2">
            Payment records are kept for as long as required by applicable accounting and tax
            obligations. We will delete or anonymize data sooner on request where we are not
            legally required to keep it.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Your rights</h2>
          <p>Under the GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Withdraw consent at any time, without affecting processing carried out before withdrawal</li>
            <li>Object to or request restriction of processing</li>
            <li>Request a copy of your data in a portable format</li>
            <li>Lodge a complaint with your national data protection authority</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Contact us</h2>
          <p>
            For any privacy question or to exercise your rights, contact us at{" "}
            <a href="mailto:vvlabseood@gmail.com" className="text-primary underline">
              vvlabseood@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
