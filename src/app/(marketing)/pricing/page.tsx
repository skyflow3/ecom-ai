/**
 * Purpose: Public pricing page — marketing route group, no auth required.
 *          Shows plan cards, feature comparison table, and FAQ.
 * Dependencies: @/lib/plans, lucide-react, next/link
 * Related: src/app/(dashboard)/billing/page.tsx (authenticated version)
 *
 * WHY: Marketing pages live outside the dashboard route group so they
 *      don't require authentication. This is the first touchpoint for
 *      prospects evaluating ECOM-AI pricing.
 */

import Link from "next/link";
import { Check, X, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS, type PlanKey } from "@/lib/plans";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Pricing — ECOM-AI",
  description:
    "Simple, transparent pricing for ECOM-AI. Start free, upgrade when you're ready.",
};

// ─── Plan data for marketing display ─────────────────────────────────────────

interface MarketingPlan {
  key: PlanKey;
  name: string;
  price: number;
  description: string;
  features: string[];
  cta: string;
  ctaHref: string;
  popular?: boolean;
}

const PLANS_MARKETING: MarketingPlan[] = [
  {
    key: "free",
    name: "Free",
    price: 0,
    description: "Try ECOM-AI and build your first funnel",
    features: [
      `${PLANS.free.funnels} funnel`,
      `${PLANS.free.pagesPerMonth} AI-generated pages per month`,
      "Basic analytics dashboard",
      "Community support",
    ],
    cta: "Get Started",
    ctaHref: "/sign-up",
  },
  {
    key: "pro",
    name: "Pro",
    price: PLANS.pro.price,
    description: "For growing stores that need more power",
    features: [
      `Up to ${PLANS.pro.funnels} funnels`,
      `${PLANS.pro.pagesPerMonth} AI-generated pages per month`,
      "A/B testing",
      "Priority AI generation",
      "Custom domains",
      `${PLANS.pro.abTests} concurrent A/B tests`,
      "Email support",
    ],
    cta: "Start Pro Trial",
    ctaHref: "/sign-up",
    popular: true,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: PLANS.enterprise.price,
    description: "For high-volume stores and agencies",
    features: [
      "Unlimited funnels",
      "Unlimited AI-generated pages",
      "Unlimited A/B tests",
      "Custom domains",
      "API access",
      "Priority support",
      "SSO & dedicated account manager",
    ],
    cta: "Contact Sales",
    ctaHref: "mailto:sales@ecom-ai.com",
  },
];

// ─── Feature comparison matrix ───────────────────────────────────────────────

interface ComparisonRow {
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}

const COMPARISON: ComparisonRow[] = [
  {
    feature: "Funnels",
    free: `${PLANS.free.funnels}`,
    pro: `Up to ${PLANS.pro.funnels}`,
    enterprise: "Unlimited",
  },
  {
    feature: "Pages / month",
    free: `${PLANS.free.pagesPerMonth}`,
    pro: `${PLANS.pro.pagesPerMonth}`,
    enterprise: "Unlimited",
  },
  {
    feature: "A/B tests",
    free: false,
    pro: `${PLANS.pro.abTests} concurrent`,
    enterprise: "Unlimited",
  },
  {
    feature: "Priority generation",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "Custom domains",
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    feature: "API access",
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Email",
    enterprise: "Priority",
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ: FaqItem[] = [
  {
    question: "Can I change plans at any time?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the change takes effect at the end of your current billing cycle.",
  },
  {
    question: "What happens when I reach my page limit?",
    answer:
      "You'll receive a notification when you're approaching your monthly limit. Once reached, AI generation is paused until the next billing cycle or until you upgrade your plan.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Yes. We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 14 days for a full refund — no questions asked.",
  },
];

// ─── Page Component ──────────────────────────────────────────────────────────

export default function PricingPage() {
  return (
    <>
      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-6 inline-flex items-center justify-center rounded-full bg-gray-100 p-3">
            <Zap className="h-6 w-6 text-gray-700" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Start free. Scale as you grow. No hidden fees.
          </p>
        </div>
      </section>

      {/* ─── Plan cards ──────────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PLANS_MARKETING.map((plan) => (
              <div
                key={plan.key}
                className={cn(
                  "relative rounded-2xl border-2 p-8 transition-shadow",
                  plan.popular
                    ? "border-black shadow-lg"
                    : "border-gray-200"
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white">
                      Popular
                    </span>
                  </div>
                )}

                {/* Name */}
                <h2 className="text-xl font-bold text-gray-900">
                  {plan.name}
                </h2>

                {/* Price */}
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-lg text-gray-500">/mo</span>
                </div>

                <p className="mb-6 text-sm text-gray-500">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="mb-8 min-h-[160px] space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.ctaHref}
                  className={cn(
                    "block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-colors",
                    plan.popular
                      ? "bg-black text-white hover:bg-gray-800"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Feature comparison table ────────────────────────────────────── */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Compare plans
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-1/4 py-4 pr-4 text-left text-sm font-semibold text-gray-900">
                    Feature
                  </th>
                  {PLANS_MARKETING.map((plan) => (
                    <th
                      key={plan.key}
                      className="px-4 py-4 text-center text-sm font-semibold text-gray-900"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-gray-100"
                  >
                    <td className="py-4 pr-4 text-sm text-gray-700">
                      {row.feature}
                    </td>
                    {(["free", "pro", "enterprise"] as const).map(
                      (planKey) => (
                        <td
                          key={planKey}
                          className="px-4 py-4 text-center"
                        >
                          {typeof row[planKey] === "boolean" ? (
                            row[planKey] ? (
                              <Check className="mx-auto h-5 w-5 text-green-500" />
                            ) : (
                              <X className="mx-auto h-5 w-5 text-gray-300" />
                            )
                          ) : (
                            <span className="text-sm text-gray-700">
                              {row[planKey]}
                            </span>
                          )}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {FAQ.map((item) => (
              <div key={item.question}>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
                <p className="leading-relaxed text-gray-500">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ──────────────────────────────────────────────────── */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Ready to build converting funnels?
          </h2>
          <p className="mb-8 text-gray-400">
            Join thousands of e-commerce stores using ECOM-AI to convert more
            visitors into customers.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100"
          >
            Start Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
