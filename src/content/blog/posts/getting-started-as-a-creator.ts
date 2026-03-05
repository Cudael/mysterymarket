import { BlogPostWithContent } from "../index";

export const post: BlogPostWithContent = {
  slug: "getting-started-as-a-creator",
  title: "Getting Started as a Creator on MysteryMarket",
  description:
    "A complete step-by-step guide to setting up your creator profile, connecting payments, writing your first idea, and getting your first unlock.",
  excerpt:
    "Everything you need to go from a blank account to a published idea in one afternoon &mdash; no tech skills required, just expertise worth sharing.",
  category: "guides",
  author: { name: "MysteryMarket Team", role: "Platform" },
  publishedAt: "2026-01-30",
  readingTime: "9 min read",
  tags: ["creators", "getting-started", "onboarding"],
  featured: false,
  content: `
<h2>Before You Begin: What MysteryMarket Is (and Isn&apos;t)</h2>
<p>MysteryMarket is a marketplace for selling <em>specific, experience-based knowledge</em>. It&apos;s not a course platform, a blog, or a social network. You don&apos;t need a large following. You don&apos;t need to build an audience first. You just need expertise that someone else would benefit from &mdash; packaged as a concrete, actionable idea.</p>
<p>If you&apos;ve ever solved a hard problem in your professional life, made a decision that others in your field struggle with, or developed a process that consistently gets results, you have something worth selling here. This guide will show you exactly how to set it up.</p>

<h2>Step 1: Create Your Account</h2>
<p>Getting started is straightforward. Visit MysteryMarket and click &ldquo;Start Creating.&rdquo; You&apos;ll sign up with email, Google, or GitHub &mdash; whichever you prefer. Your initial account is a standard buyer account.</p>
<p>Once logged in, navigate to your dashboard. You&apos;ll see an option to &ldquo;Become a Creator.&rdquo; Click it. This initiates the creator application, which is currently open to all professionals. There&apos;s no waitlist, no approval process &mdash; you can start immediately.</p>

<h2>Step 2: Complete Your Creator Profile</h2>
<p>Your creator profile is your trust signal. Buyers look at it before unlocking. A strong profile dramatically improves conversion rates. Here&apos;s what to include:</p>
<ul>
  <li><strong>Professional photo:</strong> Use a clear, professional headshot. Avatars reduce credibility.</li>
  <li><strong>Concise bio:</strong> One to two sentences that establish your expertise. Focus on outcomes you&apos;ve created, not job titles. &ldquo;I&apos;ve helped 40+ B2B SaaS companies reduce churn below 3%&rdquo; is stronger than &ldquo;Growth consultant with 7 years of experience.&rdquo;</li>
  <li><strong>Relevant credentials:</strong> If you have notable past companies, clients, or outcomes, mention them. Specificity builds trust.</li>
</ul>
<p>You can always update your profile later, but starting with a complete one will help your first idea gain traction faster.</p>

<h2>Step 3: Connect Stripe for Payouts</h2>
<p>To receive earnings, you need to connect a Stripe account. From your creator dashboard, navigate to &ldquo;Payouts&rdquo; and click &ldquo;Connect with Stripe.&rdquo; This will take you through Stripe&apos;s Express onboarding flow.</p>
<p>You&apos;ll need:</p>
<ul>
  <li>A valid email address</li>
  <li>Your business or personal tax information (depending on your country)</li>
  <li>A bank account for payout deposits</li>
</ul>
<p>Stripe onboarding typically takes 5&ndash;10 minutes. Once complete, you&apos;ll see a &ldquo;Connected&rdquo; status in your dashboard, and your earnings will be available for withdrawal.</p>

<h2>Step 4: Write Your First Idea</h2>
<p>This is where most creators either shine or stall. The good news: your first idea doesn&apos;t need to be your best one. It just needs to be real and specific.</p>
<p>From your creator dashboard, click &ldquo;New Idea.&rdquo; You&apos;ll see a structured form with the following fields:</p>
<ul>
  <li><strong>Title:</strong> Descriptive and specific. &ldquo;How I Generate 20 Qualified B2B Leads Per Week Without Paid Ads&rdquo; is better than &ldquo;My Lead Generation Strategy.&rdquo;</li>
  <li><strong>Teaser Text:</strong> This is your sales copy &mdash; the only thing buyers see before purchasing. Write 2&ndash;4 sentences that (a) hint at a specific, valuable insight without revealing it, (b) establish your credibility to deliver that insight, and (c) give buyers a sense of what they&apos;ll be able to <em>do</em> after unlocking. This field is the most important one on the form.</li>
  <li><strong>Hidden Content:</strong> This is the full idea. Write clearly and actionably. Use headers, bullet points, and numbered steps where appropriate. Be specific &mdash; include numbers, examples, and context. Aim for 300&ndash;1,000 words depending on complexity.</li>
  <li><strong>Category:</strong> Choose the most relevant category for your idea. This helps buyers browsing by category find you.</li>
  <li><strong>Tags:</strong> Add 3&ndash;5 relevant tags. These are used for search and discovery.</li>
</ul>

<h2>Step 5: Set Your Price and Unlock Type</h2>
<p>Choose between MULTI unlock (anyone can purchase, good for lower-priced ideas with high volume potential) and EXCLUSIVE unlock (one buyer gets access, ideal for premium, highly specific insights). For your first idea, MULTI is usually the better choice &mdash; it removes friction and lets you build initial social proof through multiple purchases.</p>
<p>For pricing, start somewhere between $15 and $49 for your first idea. You can always raise it later if demand is strong. Starting too high with no reviews or purchase history makes conversion harder.</p>

<h2>Step 6: Add a Cover Image (Optional but Recommended)</h2>
<p>A compelling cover image increases click-through rates from the listing page. It doesn&apos;t need to be complex &mdash; a simple, branded graphic with the idea&apos;s key promise works well. Use Canva, Figma, or any design tool you prefer. Recommended size: 1200x630 pixels.</p>

<h2>Step 7: Publish and Promote</h2>
<p>Once you&apos;re satisfied with the content, hit &ldquo;Publish.&rdquo; Your idea is now live on the marketplace. But don&apos;t just wait for organic discovery &mdash; actively share it.</p>
<p>Effective channels for driving initial traffic:</p>
<ul>
  <li><strong>LinkedIn:</strong> Post about the problem your idea solves. End with a link to your MysteryMarket profile (not the specific idea &mdash; this feels less spammy and lets people browse your full catalog).</li>
  <li><strong>Twitter/X:</strong> Share the teaser text as a thread opener. The mystery element works naturally on Twitter &mdash; it encourages replies and retweets from curious followers.</li>
  <li><strong>Communities:</strong> Niche Slack groups, Discord servers, and forums related to your topic can be excellent traffic sources if you&apos;re already an active member.</li>
  <li><strong>Direct outreach:</strong> Message 5&ndash;10 colleagues or connections who you know face the problem your idea solves. A personal recommendation from someone they trust is worth a hundred impressions.</li>
</ul>

<h2>What to Expect in the First 30 Days</h2>
<p>Most creators get their first unlock within the first week, assuming they actively promote. Don&apos;t be discouraged if the first 48 hours are quiet &mdash; organic discovery takes time, and most early sales come from direct promotion.</p>
<p>After your first unlock, ask for a review. Positive reviews significantly increase conversion for future buyers. A simple message saying &ldquo;I hope the idea was useful! If you found it helpful, a quick review would mean a lot&rdquo; is all it takes.</p>
<p>Aim to publish 3&ndash;5 ideas in your first month. More ideas means more entry points into your creator profile, more chances of showing up in category and tag searches, and a stronger sense of your content direction.</p>

<h2>You&apos;re Ready</h2>
<p>That&apos;s the full path from zero to published creator. The hardest part is deciding what to write &mdash; and the answer is almost always simpler than people expect. What&apos;s the most useful professional thing you&apos;ve learned in the last year? Write that. Start there. The rest follows.</p>
  `,
};
