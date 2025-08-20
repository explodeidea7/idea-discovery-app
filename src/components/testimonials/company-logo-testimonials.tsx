"use client"

import { Handshake } from "lucide-react";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const testimonials = [
  {
    logo: {
      src: "https://api.dicebear.com/9.x/initials/svg?seed=TF&backgroundColor=0B2447&textColor=F7F9FB",
      alt: "TechFlow Solutions logo",
      width: 48,
      height: 48,
    },
    quote:
      "The market analysis was spot-on. I went from confused about my next venture to having a clear, validated path forward in just one session.",
    author: {
      name: "Sarah Chen",
      role: "Founder, TechFlow Solutions",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Sarah%20Chen",
    },
  },
  {
    logo: {
      src: "https://api.dicebear.com/9.x/initials/svg?seed=GE&backgroundColor=00AFAE&textColor=F7F9FB",
      alt: "Green Energy Startup logo",
      width: 48,
      height: 48,
    },
    quote:
      "I was amazed by the depth of research. The confidence score and implementation roadmap gave me exactly what I needed to pitch investors.",
    author: {
      name: "Marcus Rivera",
      role: "CEO, Green Energy Startup",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus%20Rivera",
    },
  },
  {
    logo: {
      src: "https://api.dicebear.com/9.x/initials/svg?seed=EP&backgroundColor=FF6B61&textColor=F7F9FB",
      alt: "E-commerce Platform logo",
      width: 48,
      height: 48,
    },
    quote:
      "As a repeat entrepreneur, I've learned to value quality market research. This tool delivered insights that would have taken me weeks to gather.",
    author: {
      name: "Lisa Park",
      role: "Founder, E-commerce Platform",
      image: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lisa%20Park",
    },
  },
];

const CompanyLogoTestimonials = () => {
  return (
    <section className="py-32 bg-background">
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl font-display">
            Entrepreneurs Trust Our Analysis
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground font-body">
            Trusted by entrepreneurs across industries who've successfully validated and launched their business ideas
          </p>
        </div>
      </div>

      <div className="container mt-10 grid gap-8 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="flex flex-col gap-6 rounded-2xl bg-card p-6 shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            <img
              src={testimonial.logo.src}
              alt={testimonial.logo.alt}
              width={testimonial.logo.width}
              height={testimonial.logo.height}
              className="rounded-lg object-contain"
            />

            <blockquote className="text-muted-foreground text-lg font-normal italic font-body">{`"${testimonial.quote}"`}</blockquote>

            <div className="mt-auto flex items-center gap-4">
              <img
                src={testimonial.author.image}
                alt={`${testimonial.author.name}'s profile picture`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-lg tracking-[-0.36px] font-display font-medium">
                  {testimonial.author.name}
                </p>
                <p className="text-muted-foreground font-body">
                  {testimonial.author.role}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export { CompanyLogoTestimonials };