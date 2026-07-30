/**
 * Blog Data
 *
 * WHAT IT IS: Static blog content stored as data (title, slug, date, excerpt, body).
 * WHY IT EXISTS: Provides SEO-friendly educational content about accessibility.
 * REAL WORLD ANALOGY: A filing cabinet of articles, each in its own folder.
 */

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-the-european-accessibility-act",
    title: "What is the European Accessibility Act (EAA)?",
    date: "2025-06-15",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=400&fit=crop",
    imageAlt: "EU parliament building representing European legislation",
    excerpt:
      "The EAA is EU-wide legislation requiring digital products and services to be accessible. Here's what businesses need to know about deadlines, consequences, and compliance.",
    content: `
The European Accessibility Act (EAA) is an EU directive that requires products and services — including websites, apps, and e-commerce platforms — to meet specific accessibility standards. In Germany, it's implemented as the Barrierefreiheitsstärkungsgesetz (BFSG).

## Who does the EAA affect?

The EAA applies to any business that sells products or services to consumers (B2C) within the EU. This includes:

- **Online shops** selling physical or digital goods
- **Service platforms** like booking systems, banking, and streaming
- **Digital products** such as e-books, apps, and ticketing systems

Micro-enterprises (fewer than 10 employees and under €2M annual revenue) may be exempt in some member states, but this varies.

## What's the deadline?

The EAA enforcement date was **June 28, 2025**. National authorities are now able to enforce compliance, issue warnings, and impose fines. Businesses that started compliance efforts early are in the best position.

## What standard do I need to meet?

The EAA references the technical standard EN 301 549, which points to **WCAG 2.1 Level AA** for web content. In practice, this means your site needs:

- Proper alternative text for images
- Sufficient color contrast (at least 4.5:1 ratio)
- Keyboard navigation support
- Labeled form inputs
- Logical heading structure

## What happens if I don't comply?

Enforcement varies by country. In Germany, authorities can issue formal warnings, require corrections within a set timeframe, and impose fines for continued non-compliance. Beyond legal risk, inaccessible sites also exclude millions of potential customers with disabilities.

## What should I do now?

1. **Scan your website** to identify current accessibility issues
2. **Prioritize critical issues** — missing alt text, broken keyboard navigation, and low contrast are the most common
3. **Fix and retest** — accessibility is an ongoing process, not a one-time project
4. **Document your efforts** — showing good faith compliance effort matters

The sooner you start, the less overwhelming it feels. Our free scanner can give you a starting point in under 30 seconds.
    `.trim(),
  },
  {
    slug: "5-most-common-accessibility-issues",
    title: "5 Most Common Accessibility Issues and How to Fix Them",
    date: "2025-06-10",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    imageAlt: "Developer fixing code on a laptop screen",
    excerpt:
      "Most websites fail on the same 5 issues. Missing alt text, low contrast, unlabeled forms, keyboard traps, and heading structure. Here's how to fix each one.",
    content: `
After scanning thousands of websites, we see the same problems over and over. The good news: these are all fixable, and most are straightforward once you know what to look for.

## 1. Missing image alt text

**The problem:** Images without alt attributes are invisible to screen reader users. They miss important context, navigation cues, or content.

**The fix:** Add descriptive alt text to every meaningful image. For decorative images, use an empty alt attribute (\`alt=""\`).

\`\`\`html
<!-- Bad -->
<img src="team.jpg">

<!-- Good -->
<img src="team.jpg" alt="Our support team at the Berlin office">
\`\`\`

## 2. Insufficient color contrast

**The problem:** Text that doesn't have enough contrast against its background is hard to read for people with low vision — and even for everyone in bright sunlight.

**The fix:** Ensure at least a 4.5:1 contrast ratio for normal text and 3:1 for large text. Tools like the WebAIM contrast checker can help you verify.

## 3. Unlabeled form inputs

**The problem:** Form fields without associated labels leave screen reader users guessing what information to enter.

**The fix:** Always pair \`<input>\` elements with \`<label>\` elements using matching \`for\` and \`id\` attributes.

\`\`\`html
<!-- Bad -->
<input type="email" placeholder="Email">

<!-- Good -->
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com">
\`\`\`

## 4. Keyboard navigation issues

**The problem:** Many users can't use a mouse — they rely on keyboard navigation (Tab, Enter, Escape). Sites with keyboard traps or non-focusable interactive elements exclude these users.

**The fix:** Ensure all interactive elements (links, buttons, form fields) are reachable via Tab. Use semantic HTML elements which have built-in keyboard support. Test by navigating your site using only the keyboard.

## 5. Missing or incorrect heading structure

**The problem:** Screen readers use headings to navigate pages. When headings skip levels (h1 → h3) or don't exist, users lose orientation.

**The fix:** Use headings in logical order. Every page should have exactly one h1 (the page title), followed by h2 for sections, h3 for subsections, and so on.

## Start with the basics

These five issues account for the majority of accessibility failures. Fix them, and you'll dramatically improve your site's usability for everyone.
    `.trim(),
  },
  {
    slug: "how-to-check-if-your-website-is-accessible",
    title: "How to Check if Your Website is Accessible",
    date: "2025-06-05",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    imageAlt: "Person checking accessibility results on a dashboard",
    excerpt:
      "An introduction to automated vs manual accessibility testing. Learn what tools can catch, what requires human review, and when to hire professional help.",
    content: `
Checking your website's accessibility might seem complex, but there's a practical approach that works for businesses of any size. Here's how to get started.

## Automated testing: the first step

Automated scanners (like AccessCheck) can instantly identify many common issues:

- Missing alt text on images
- Insufficient color contrast
- Unlabeled form inputs
- Missing document language
- Empty links and buttons

Automated tools typically catch **30-50% of all accessibility issues**. They're excellent for identifying low-hanging fruit and establishing a baseline.

## What automation can't catch

Some issues require human judgment:

- **Is the alt text actually meaningful?** A tool can tell you alt text exists, but not whether it accurately describes the image.
- **Does the tab order make sense?** Keyboard navigation might technically work but follow a confusing sequence.
- **Is the content understandable?** Plain language and clear structure are accessibility requirements that tools can't fully evaluate.
- **Do custom components work with assistive technology?** Complex widgets like date pickers or modal dialogs need manual testing.

## Manual testing basics

Even without expertise, you can catch issues by:

1. **Navigating with keyboard only** — Can you reach everything using Tab, Enter, and Escape? Can you see where focus is?
2. **Zooming to 200%** — Does content still work without horizontal scrolling?
3. **Testing with a screen reader** — VoiceOver (Mac) or NVDA (Windows) are free. Listen to how your page sounds.
4. **Checking on mobile** — Tap targets should be at least 44×44 pixels.

## When to hire professional help

Consider a professional accessibility audit when:

- Your business is legally required to comply (most EU B2C businesses)
- You handle sensitive transactions (banking, healthcare, government)
- Your site has complex interactive components
- You've fixed automated findings and want to go deeper
- You need documentation for legal compliance

## A practical approach

1. **Start with an automated scan** — identify the most common issues in seconds
2. **Fix the critical issues first** — missing alt text, keyboard traps, form labels
3. **Do basic manual testing** — keyboard navigation and zoom
4. **Get professional help for complex cases** — custom widgets, legal documentation

Accessibility isn't all-or-nothing. Every improvement helps real people use your website. Start where you are and improve iteratively.
    `.trim(),
  },
];

/** Get all blog posts sorted by date (newest first) */
export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Get a single blog post by slug */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
