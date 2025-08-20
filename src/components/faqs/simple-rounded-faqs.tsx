"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How is this different from generic business idea generators?",
    answer:
      "Unlike generic generators that produce random ideas, we use personalized profiling to understand your unique skills, experience, and market position. Our AI analyzes your background against real market data to recommend opportunities with the highest probability of success for you specifically, including comprehensive market validation and competitive analysis.",
  },
  {
    question: "What if I don't like the business idea you recommend?",
    answer:
      "We only present ideas with high confidence scores based on thorough analysis of your profile and market conditions. However, if you're not satisfied with your recommendation, we offer a 100% money-back guarantee. Our goal is to provide you with an idea you're genuinely excited to pursue.",
  },
  {
    question: "How long does the analysis take?",
    answer:
      "The typical analysis takes 15-30 minutes to complete. During this time, our AI processes your responses, analyzes market data, validates opportunities, and generates your comprehensive business idea report. You'll see real-time progress updates throughout the process.",
  },
  {
    question: "What's included in the PDF report?",
    answer:
      "Your comprehensive report includes detailed market analysis with competitor landscape, step-by-step implementation roadmap, financial projections including startup costs and revenue potential, target audience insights, marketing strategies, and risk assessment with mitigation strategies—everything you need to evaluate and launch your business idea.",
  },
  {
    question: "Can I get multiple business ideas?",
    answer:
      "We focus on delivering one high-confidence recommendation that's specifically tailored to your unique situation, ensuring the highest quality analysis. This approach provides deeper insights than multiple generic suggestions. Upgrade options are available if you'd like to explore additional opportunities after reviewing your initial recommendation.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Absolutely. We use industry-standard encryption and security measures to protect your data. Your personal information is never shared with third parties, and all analysis is conducted in secure, isolated environments. We're committed to maintaining the highest standards of data privacy and security.",
  },
  {
    question: "What happens after I get my results?",
    answer:
      "After receiving your business idea report, you have the option to continue with our full build chat service, where our AI guides you through detailed implementation, helps refine your business plan, and provides ongoing strategic advice. This optional service takes you from idea to execution with personalized support.",
  },
];

const SimpleRoundedFaqs = () => {
  return (
    <section className="py-32 bg-neutral-50">
      <div className="container max-w-4xl mx-auto">
        <h2 className="mt-2 mb-12 text-3xl font-bold md:text-6xl font-[var(--font-body)]">
          Frequently Asked Questions
        </h2>
        <Accordion type="multiple">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="mb-2 rounded-md border-b-0 bg-muted px-5 py-2 md:mb-4"
            >
              <AccordionTrigger className="text-left font-[var(--font-body)]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-[var(--font-body)]">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export { SimpleRoundedFaqs };