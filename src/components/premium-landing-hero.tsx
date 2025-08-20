"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Play } from "lucide-react";

type PremiumLandingHeroProps = {
  onStart?: () => void;
};

export default function PremiumLandingHero({ onStart }: PremiumLandingHeroProps) {
  // Avatar cluster data for social proof
  const avatars = [
  { id: 1, src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" },
  { id: 2, src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" },
  { id: 3, src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face" },
  { id: 4, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { id: 5, src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" }];


  const confidenceFeatures = [
  "Market-validated",
  "Trend-aligned",
  "Actionable insights"];


  return (
    <section className="bg-gradient-to-b from-neutral-50 to-white">
      <div className="container py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Main Headline */}
          <motion.h1
            className="font-display text-5xl font-bold leading-tight tracking-tight text-primary-900 sm:text-6xl lg:text-7xl !whitespace-pre-line !whitespace-pre-line"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}>
            Transform Your Ideas into Opportunities
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="mt-6 text-lg leading-relaxed text-neutral-700 sm:text-xl lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>

            Get one perfect, market-validated business idea from our AI-powered analysis. 
            No guesswork, just results.
          </motion.p>

          {/* Confidence Features */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>

            {confidenceFeatures.map((feature, index) =>
            <div key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-accent-500" />
                <span className="text-neutral-700 font-medium">{feature}</span>
              </div>
            )}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}>

            <Button
              size="lg"
              className="group bg-accent-500 text-white hover:bg-accent-400 rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
              onClick={() => onStart?.()}>

              Start Your Analysis
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white rounded-2xl px-8 py-6 text-lg font-semibold transition-all duration-200 ease-in-out">

              <Play className="mr-2 h-5 w-5" />
              View Sample Report
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-12 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}>

            <div className="flex -space-x-2">
              {avatars.map((avatar, index) =>
              <motion.div
                key={avatar.id}
                className="relative h-10 w-10 rounded-full border-2 border-white shadow-md overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}>

                  <img
                  src={avatar.src}
                  alt={`User ${avatar.id}`}
                  className="h-full w-full object-cover" />

                </motion.div>
              )}
            </div>
            
            <p className="text-neutral-700 font-medium">
              Join 2,000+ entrepreneurs who've transformed their ideas
            </p>
          </motion.div>
        </div>
      </div>
    </section>);

}