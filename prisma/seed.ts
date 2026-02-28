import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create demo creator user
  const creator = await prisma.user.upsert({
    where: { email: 'demo-creator@mysteryidea.com' },
    update: {},
    create: {
      clerkId: 'demo_clerk_creator_001',
      email: 'demo-creator@mysteryidea.com',
      name: 'Demo Creator',
      bio: 'I share innovative ideas across tech, business, and creative domains.',
      role: 'CREATOR',
      stripeOnboarded: true,
      stripeAccountId: 'acct_demo_001',
    },
  });

  // Create demo buyer user
  const buyer = await prisma.user.upsert({
    where: { email: 'demo-buyer@mysteryidea.com' },
    update: {},
    create: {
      clerkId: 'demo_clerk_buyer_001',
      email: 'demo-buyer@mysteryidea.com',
      name: 'Demo Buyer',
      role: 'USER',
    },
  });

  // Create sample ideas across different categories
  const ideas = [
    {
      title: 'AI-Powered Personal Finance Advisor',
      teaserText:
        'A revolutionary approach to personal finance using cutting-edge AI that could disrupt the $12B financial advisory market.',
      hiddenContent:
        'Build a conversational AI that analyzes spending patterns, predicts cash flow, and automatically moves money between savings goals. Monetize via premium tiers and B2B licensing to credit unions.',
      priceInCents: 499,
      category: 'Technology',
      tags: ['AI', 'FinTech', 'SaaS'],
      unlockType: 'MULTI' as const,
      published: true,
    },
    {
      title: 'Subscription Box for Indie Board Games',
      teaserText:
        'A curated monthly subscription that taps into the $13B board game market with a twist no one has tried.',
      hiddenContent:
        'Partner directly with indie board game designers on Kickstarter to offer exclusive pre-release versions. Each box includes a game, designer interview card, and a QR code to a private Discord community. Revenue model: $39/month, 60% margins after COGS.',
      priceInCents: 299,
      category: 'Business',
      tags: ['Subscription', 'Gaming', 'E-commerce'],
      unlockType: 'MULTI' as const,
      published: true,
    },
    {
      title: 'Zero-Code Mobile App for Local Services',
      teaserText:
        'How to build and launch a local services marketplace app without writing a single line of code — validated with $10K MRR.',
      hiddenContent:
        'Use Glide + Airtable + Stripe to build a Thumbtack-style marketplace for your city. Focus on one vertical (e.g., pet care) and one zip code. Charge 15% service fee. Detailed step-by-step with screenshots and templates included.',
      priceInCents: 799,
      category: 'Technology',
      tags: ['No-Code', 'Marketplace', 'Local'],
      unlockType: 'EXCLUSIVE' as const,
      maxUnlocks: 1,
      published: true,
    },
    {
      title: 'Content Repurposing Agency Blueprint',
      teaserText:
        'Start a $20K/month content agency with just 2 freelancers and this exact playbook.',
      hiddenContent:
        'Take one long-form YouTube video or podcast episode and repurpose it into 15+ pieces of content (tweets, LinkedIn posts, Instagram carousels, blog posts, email newsletters). Use Descript for transcription, Canva for design, and Notion for workflow management. Price: $2,500/month per client. You need just 8 clients for $20K MRR.',
      priceInCents: 599,
      category: 'Business',
      tags: ['Agency', 'Content', 'Marketing'],
      unlockType: 'MULTI' as const,
      published: true,
    },
    {
      title: 'Niche Newsletter to Six Figures',
      teaserText:
        'The exact system to grow a niche newsletter to 50K subscribers and $100K+ ARR in 12 months.',
      hiddenContent:
        'Pick a niche with high-value B2B readers (e.g., "AI for HR professionals"). Use SparkLoop for paid referrals, beehiiv for hosting. Monetize via: (1) Sponsored posts at $500-2,000/issue, (2) Premium tier at $10/month, (3) Community at $29/month. Growth hack: Cross-promote with 5 non-competing newsletters in adjacent niches.',
      priceInCents: 999,
      category: 'Creative',
      tags: ['Newsletter', 'Media', 'Growth'],
      unlockType: 'MULTI' as const,
      published: true,
    },
    {
      title: 'Micro-SaaS: Chrome Extension Idea',
      teaserText:
        'A Chrome extension idea with built-in virality that could hit $5K MRR in 90 days.',
      hiddenContent:
        'Build a Chrome extension that adds a "Save to read later" button on every webpage and sends a daily digest email of saved articles with AI-generated summaries. Free tier: 5 saves/day. Pro tier: unlimited + AI summaries + Kindle export. Tech stack: Plasmo framework, Supabase, Resend.',
      priceInCents: 399,
      category: 'Technology',
      tags: ['SaaS', 'Chrome Extension', 'AI'],
      unlockType: 'MULTI' as const,
      published: true,
    },
  ];

  for (const idea of ideas) {
    await prisma.idea.upsert({
      where: {
        id: `seed_${idea.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .substring(0, 20)}`,
      },
      update: {},
      create: {
        id: `seed_${idea.title
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .substring(0, 20)}`,
        ...idea,
        creatorId: creator.id,
      },
    });
  }

  // Create a sample purchase (buyer unlocked one idea)
  const firstIdea = await prisma.idea.findFirst({ where: { creatorId: creator.id } });
  if (firstIdea) {
    await prisma.purchase.upsert({
      where: {
        buyerId_ideaId: {
          buyerId: buyer.id,
          ideaId: firstIdea.id,
        },
      },
      update: {},
      create: {
        buyerId: buyer.id,
        ideaId: firstIdea.id,
        amountInCents: firstIdea.priceInCents,
        platformFeeInCents: Math.round(firstIdea.priceInCents * 0.1),
        stripePaymentIntentId: 'pi_demo_seed_001',
        status: 'COMPLETED',
      },
    });
  }

  console.log('✅ Seed completed!');
  console.log(`   Created creator: ${creator.email}`);
  console.log(`   Created buyer: ${buyer.email}`);
  console.log(`   Created ${ideas.length} ideas`);
  console.log(`   Created 1 sample purchase`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
