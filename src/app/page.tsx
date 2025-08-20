"use client"

import { useState } from "react"
import ResultsPresentation from "@/components/results-presentation"

// Static business idea data
const staticBusinessIdea = {
  title: "AI-Powered Personal Fitness Coach",
  summary: "A mobile app that uses machine learning to create personalized workout plans and nutrition guidance based on user goals, fitness level, and available equipment. The app adapts in real-time based on performance metrics and user feedback.",
  confidenceScore: 85,
  marketSize: "$15.6B",
  estimatedRevenue: "$2.5M - $8.2M",
  implementationTime: "8-12 months",
  riskLevel: "medium" as const,
  category: "Health & Wellness Technology"
}

export default function HomePage() {
  const handleContinueToFullBuild = () => {
    console.log('Continue to full build')
  }

  return (
    <ResultsPresentation
      businessIdea={staticBusinessIdea}
      onContinueToFullBuild={handleContinueToFullBuild}
      onBookmark={() => console.log('Bookmarked')}
      onShare={() => console.log('Shared')}
      onPrint={() => window.print()}
      onExportPDF={async () => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('PDF exported')
      }}
    />
  )
}