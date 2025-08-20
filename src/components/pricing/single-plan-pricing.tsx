"use client";

import { Check, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SinglePlanPricing = () => {
  return (
    <section className="py-32 bg-neutral-50">
      <div className="container">
        <div className="mx-auto max-w-5xl rounded-2xl bg-card shadow-lg p-6 md:p-10">
          <div className="mb-12 flex items-center gap-3">
            <span className="text-2xl font-bold text-primary font-[var(--font-display)]">Idea Discovery Analysis</span>
          </div>
          <div className="flex flex-col justify-between gap-6 md:flex-row">
            <h2 className="max-w-xl text-3xl font-bold md:text-4xl font-[var(--font-display)] text-primary">
              Get Your Perfect Business Idea
            </h2>
            <div className="md:text-right">
              <span className="text-3xl font-bold md:text-5xl text-primary">$97</span>
              <p className="text-muted-foreground">
                One-time payment
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                No subscription, no hidden fees
              </p>
            </div>
          </div>
          <Separator className="my-8" />
          <div>
            <p className="mb-5 text-muted-foreground">
              Everything you need to discover your ideal business opportunity:
            </p>
            <div className="flex flex-col justify-between gap-10 md:flex-row md:gap-20">
              <ul className="grid gap-x-20 gap-y-4 font-medium md:grid-cols-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  6-8 question personalized profile
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  Deep market & trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  One highest-confidence business idea
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  Comprehensive implementation guide
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  PDF report with all insights
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 text-accent" />
                  Continue to full build chat (optional)
                </li>
              </ul>
              <div className="flex flex-col gap-4">
                <Button size="lg" className="bg-accent hover:bg-accent-400 text-white">
                  Start Analysis Now
                </Button>
                <Button variant="outline" size="lg">
                  View Sample Report
                </Button>
                <div className="flex items-center gap-2 justify-center md:justify-end mt-2">
                  <Shield className="w-4 h-4 text-coral-500" />
                  <span className="text-sm text-coral-500 font-medium">30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { SinglePlanPricing };