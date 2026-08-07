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
  const isBg = lang === "bg";

  if (isBg) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8">Общи условия</h1>

        <div className="space-y-8 text-sm leading-relaxed text-muted">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">1. Описание на услугата</h2>
            <p className="mb-2">
              AccessCheck предоставя автоматизирана услуга за сканиране на уеб достъпност, която проверява
              уебсайтове спрямо WCAG 2.1 Ниво AA и WCAG 2.2, както и добри практики в бранша.
              Услугата използва двигателя с отворен код axe-core за откриване на потенциални нарушения на достъпността.
            </p>
            <p>
              Сканирането покрива само публично достъпно HTML съдържание. То не тества съдържание зад
              удостоверяване, динамично генерирано съдържание, изискващо потребителско взаимодействие, PDF документи,
              нативни мобилни приложения или вградено съдържание от трети страни (напр. iframe елементи от външни домейни).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">2. Обхват и ограничения на автоматизираното тестване</h2>
            <p className="mb-2">Нашият автоматизиран скенер проверява, но не само за:</p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Съотношения на цветовия контраст (WCAG 2.1 SC 1.4.3, 1.4.6)</li>
              <li>Алтернативен текст за изображения (SC 1.1.1)</li>
              <li>Етикети и връзки на полета във формуляри (SC 1.3.1, 3.3.2)</li>
              <li>Индикатори за клавиатурна достъпност (SC 2.1.1, 2.4.7)</li>
              <li>Коректност на ARIA атрибути (SC 4.1.2)</li>
              <li>Структура на документа и йерархия на заглавията (SC 1.3.1)</li>
              <li>Достъпни имена на връзки и бутони (SC 2.4.4, 4.1.2)</li>
              <li>Езикови атрибути (SC 3.1.1)</li>
              <li>Откриване на мигащо съдържание (SC 2.3.1)</li>
            </ul>
            <p className="mb-2"><strong>Следните изискват ръчен преглед от експерт и НЕ се покриват от автоматизираното сканиране:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Поведение при 200% увеличение на браузъра (SC 1.4.4)</li>
              <li>Съвместимост с реални помощни технологии (екранни четци, превключвателни устройства)</li>
              <li>Достъпност на PDF и документи</li>
              <li>Поведение на сложни интерактивни елементи (модални прозорци, избор на дата, карусели)</li>
              <li>Яснота на съдържанието и разбираем език</li>
              <li>Точност и смисленост на алтернативния текст</li>
              <li>Съображения за когнитивна достъпност</li>
              <li>Субтитри и аудио описания за мултимедия</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">3. Без гаранция за правно съответствие</h2>
            <p className="mb-2">
              <strong>Резултатите от сканирането на AccessCheck НЕ представляват правен сертификат за съответствие.</strong>{" "}
              Положителен резултат не гарантира съответствие с Европейския акт за достъпност (EAA),
              EN 301 549 или национално прилагане на тези изисквания.
            </p>
            <p className="mb-2">
              Автоматизираните инструменти обикновено откриват 30-50% от всички възможни бариери за достъпност.
              Пълното съответствие изисква комбинация от автоматизирано тестване, ръчен преглед от експерт
              и тестване с реални потребители на помощни технологии.
            </p>
            <p>
              Препоръчваме да използвате нашето сканиране като отправна точка и да потърсите професионален
              ръчен одит за гарантиране на правно съответствие.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">4. Услуги по отстраняване на проблеми</h2>
            <p className="mb-2">
              Когато ползвате нашата услуга по отстраняване („поправете сайта ми“), обхватът на работа се определя
              в отделно писмено споразумение (предложение/оферта) преди началото на работа. Това споразумение уточнява:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-3">
              <li>Точния обхват на проблемите, които ще бъдат адресирани</li>
              <li>Срок за изпълнение</li>
              <li>Цена и условия за плащане (изисква се авансово плащане)</li>
              <li>Какво изрично е изключено</li>
              <li>Критерии за приемане</li>
            </ul>
            <p>
              Работата започва само след писмено потвърждение и авансово плащане. Крайният резултат се
              предоставя след получаване на пълното плащане.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">5. Платени доклади</h2>
            <p>
              Платените доклади (Подробен доклад €1, Пълен доклад + PDF €3) предоставят разширена информация
              от същото автоматизирано сканиране. Те не включват ръчно тестване или човешки преглед.
              Плащането не подлежи на възстановяване след генериране и доставяне на доклада.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">6. Данни и поверителност</h2>
            <p className="mb-2">
              Сканираме само публично достъпни страници. Не осъществяваме достъп до съдържание зад удостоверяване,
              не съхраняваме пароли и не обработваме лични данни на посетителите на сканирания уебсайт.
            </p>
            <p>
              Резултатите от сканирането се съхраняват за 24 часа с цел кеширане.
              Изпратените съобщения през контактната форма се съхраняват съгласно нашата{" "}
              <a href={`/${lang}/privacy`} className="text-primary underline">Политика за поверителност</a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">7. Ограничение на отговорността</h2>
            <p>
              AccessCheck и VV Labs не носят отговорност за преки, косвени, инцидентни или последващи щети,
              произтичащи от използването на нашата услуга за сканиране, разчитане на резултатите от сканирането,
              или каквото и да е регулаторно действие срещу уебсайта на потребителя. Услугата ни се предоставя „както е“,
              без каквито и да е гаранции, изрични или подразбиращи се.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">8. Приложимо право</h2>
            <p>
              Настоящите условия се уреждат от законите на Република България. Всички спорове ще се
              решават от съответните съдилища в София, България.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">9. Контакт</h2>
            <p>
              VV Labs<br />
              Имейл: vvlabseood@gmail.com<br />
              За въпроси относно тези условия, моля използвайте нашата{" "}
              <a href={`/${lang}/contact`} className="text-primary underline">контактна форма</a>.
            </p>
          </div>

          <p className="text-xs text-muted border-t border-border pt-4">
            Последна актуализация: август 2026
          </p>
        </div>
      </section>
    );
  }

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
            AccessCheck and VV Labs shall not be liable for any direct, indirect, incidental,
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
            VV Labs<br />
            Email: vvlabseood@gmail.com<br />
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
