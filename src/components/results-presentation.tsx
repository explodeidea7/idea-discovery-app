"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  Building, 
  Download, 
  Share2, 
  Bookmark, 
  Printer, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

interface BusinessIdea {
  title: string
  summary: string
  confidenceScore: number
  marketSize: string
  estimatedRevenue: string
  implementationTime: string
  riskLevel: "low" | "medium" | "high"
  category: string
}

interface ResultsPresentationProps {
  businessIdea: BusinessIdea
  onContinueToFullBuild?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onPrint?: () => void
  onExportPDF?: () => Promise<void>
}

const metrics = [
  {
    title: "Market Size",
    value: "$2.3B",
    change: "+12.5%",
    icon: Target,
    color: "text-accent-500"
  },
  {
    title: "Revenue Potential",
    value: "$150K",
    change: "Year 1",
    icon: DollarSign,
    color: "text-primary-900"
  },
  {
    title: "User Base",
    value: "45K",
    change: "Target Users",
    icon: Users,
    color: "text-coral-500"
  },
  {
    title: "Time to Market",
    value: "4-6",
    change: "Months",
    icon: Clock,
    color: "text-accent-400"
  }
]

const implementationMilestones = [
  { phase: "Research & Planning", duration: "2 weeks", status: "pending", details: "Market research, competitor analysis, feature specification" },
  { phase: "MVP Development", duration: "8 weeks", status: "pending", details: "Core features, basic UI/UX, initial testing" },
  { phase: "Beta Testing", duration: "3 weeks", status: "pending", details: "User feedback, bug fixes, performance optimization" },
  { phase: "Launch Preparation", duration: "2 weeks", status: "pending", details: "Marketing materials, deployment, final testing" },
  { phase: "Go-to-Market", duration: "1 week", status: "pending", details: "Public launch, customer acquisition, monitoring" }
]

const riskFactors = [
  { category: "Market Risk", level: "low", description: "Strong market demand with growing trend", color: "bg-emerald-100 text-emerald-700" },
  { category: "Technical Risk", level: "medium", description: "Moderate complexity with proven technologies", color: "bg-amber-100 text-amber-700" },
  { category: "Competition", level: "medium", description: "Several competitors but clear differentiation", color: "bg-amber-100 text-amber-700" },
  { category: "Financial Risk", level: "low", description: "Low initial investment with scalable model", color: "bg-emerald-100 text-emerald-700" }
]

const competitors = [
  { name: "Competitor A", marketShare: "25%", strength: "Brand recognition", weakness: "Limited features" },
  { name: "Competitor B", marketShare: "18%", strength: "Low pricing", weakness: "Poor UX" },
  { name: "Competitor C", marketShare: "12%", strength: "Technical innovation", weakness: "Small user base" }
]

const financialProjections = [
  { period: "Q1 2024", revenue: "$25K", users: "2.5K", costs: "$15K", profit: "$10K" },
  { period: "Q2 2024", revenue: "$45K", users: "4.8K", costs: "$25K", profit: "$20K" },
  { period: "Q3 2024", revenue: "$75K", users: "8.2K", costs: "$35K", profit: "$40K" },
  { period: "Q4 2024", revenue: "$120K", users: "12.5K", costs: "$50K", profit: "$70K" }
]

export default function ResultsPresentation({
  businessIdea = {
    title: "AI-Powered Personal Finance Assistant",
    summary: "An intelligent mobile app that analyzes spending patterns, provides personalized budgeting recommendations, and automates savings through micro-investments. Features include expense categorization, bill reminders, and goal-based financial planning.",
    confidenceScore: 94,
    marketSize: "$2.3B",
    estimatedRevenue: "$150K",
    implementationTime: "4-6 months",
    riskLevel: "low",
    category: "FinTech"
  },
  onContinueToFullBuild,
  onBookmark,
  onShare,
  onPrint,
  onExportPDF
}: ResultsPresentationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isExporting, setIsExporting] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await onExportPDF?.()
    } finally {
      setIsExporting(false)
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.()
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low": return <CheckCircle2 className="h-4 w-4" />
      case "medium": return <AlertCircle className="h-4 w-4" />
      case "high": return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent-500 text-white hover:bg-accent-400">
              <Trophy className="h-5 w-5 mr-2" />
              {businessIdea.confidenceScore}% Confidence Match
            </Badge>
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-900 mb-4">
            {businessIdea.title}
          </h1>
          
          <p className="text-lg text-foreground max-w-3xl mx-auto leading-relaxed">
            {businessIdea.summary}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button 
              onClick={handleExportPDF}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="rounded-2xl"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export PDF"}
            </Button>
            
            <Button 
              onClick={onShare}
              variant="outline" 
              size="sm"
              className="rounded-2xl"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button 
              onClick={handleBookmark}
              variant="outline" 
              size="sm"
              className="rounded-2xl"
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
            
            <Button 
              onClick={onPrint}
              variant="outline" 
              size="sm"
              className="rounded-2xl"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => (
            <Card key={metric.title} className="rounded-2xl bg-card hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  <Badge variant="secondary" className="text-xs">
                    {metric.change}
                  </Badge>
                </div>
                <h3 className="font-semibold text-2xl text-primary-900 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {metric.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-muted rounded-2xl">
              <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
              <TabsTrigger value="market" className="rounded-xl">Market Analysis</TabsTrigger>
              <TabsTrigger value="implementation" className="rounded-xl">Implementation</TabsTrigger>
              <TabsTrigger value="financials" className="rounded-xl">Financials</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-2xl bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-accent-500" />
                      Key Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Smart Expense Tracking</h4>
                        <p className="text-sm text-muted-foreground">Automatic categorization and analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Personalized Budgeting</h4>
                        <p className="text-sm text-muted-foreground">AI-driven recommendations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Micro-Investment Automation</h4>
                        <p className="text-sm text-muted-foreground">Round-up savings and goal-based investing</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary-600" />
                      Competitive Advantages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Advanced AI Integration</h4>
                        <p className="text-sm text-muted-foreground">More accurate predictions than competitors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Seamless User Experience</h4>
                        <p className="text-sm text-muted-foreground">Intuitive interface with minimal friction</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Comprehensive Integration</h4>
                        <p className="text-sm text-muted-foreground">Works with all major banks and services</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Assessment */}
              <Card className="rounded-2xl bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Risk Assessment
                  </CardTitle>
                  <CardDescription>
                    Comprehensive analysis of potential risks and mitigation strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {riskFactors.map((risk, index) => (
                      <div key={risk.category} className="flex items-center justify-between p-3 rounded-xl border">
                        <div className="flex items-center gap-3">
                          {getRiskIcon(risk.level)}
                          <div>
                            <h4 className="font-medium">{risk.category}</h4>
                            <p className="text-sm text-muted-foreground">{risk.description}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={risk.color}>
                          {risk.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Market Analysis Tab */}
            <TabsContent value="market" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-2xl bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent-500" />
                      Market Size & Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Total Addressable Market</span>
                          <span className="text-2xl font-bold text-primary-900">$2.3B</span>
                        </div>
                        <Progress value={85} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Growing at 12.5% annually</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Serviceable Market</span>
                          <span className="text-xl font-bold text-primary-900">$580M</span>
                        </div>
                        <Progress value={65} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">25% of total market</p>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Target Market</span>
                          <span className="text-lg font-bold text-primary-900">$115M</span>
                        </div>
                        <Progress value={40} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">Initial 5% market capture</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary-600" />
                      Competitive Landscape
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competitors.map((competitor, index) => (
                        <div key={competitor.name} className="border rounded-xl p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{competitor.name}</h4>
                            <Badge variant="outline">{competitor.marketShare}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-emerald-600">✓ {competitor.strength}</span>
                            </div>
                            <div>
                              <span className="text-amber-600">⚠ {competitor.weakness}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation" className="space-y-6">
              <Card className="rounded-2xl bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-500" />
                    Implementation Timeline
                  </CardTitle>
                  <CardDescription>
                    Detailed roadmap from concept to market launch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {implementationMilestones.map((milestone, index) => (
                      <div key={milestone.phase} className="relative">
                        {index < implementationMilestones.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-12 bg-border"></div>
                        )}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-sm font-medium">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <button
                              onClick={() => toggleSection(milestone.phase)}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <div>
                                <h4 className="font-medium text-primary-900">{milestone.phase}</h4>
                                <p className="text-sm text-muted-foreground">{milestone.duration}</p>
                              </div>
                              {expandedSections.has(milestone.phase) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            {expandedSections.has(milestone.phase) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 p-3 bg-muted rounded-xl"
                              >
                                <p className="text-sm">{milestone.details}</p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="space-y-6">
              <Card className="rounded-2xl bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent-500" />
                    Financial Projections
                  </CardTitle>
                  <CardDescription>
                    Revenue and growth projections for the first year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Period</th>
                          <th className="text-left py-2 px-3 font-medium">Revenue</th>
                          <th className="text-left py-2 px-3 font-medium">Users</th>
                          <th className="text-left py-2 px-3 font-medium">Costs</th>
                          <th className="text-left py-2 px-3 font-medium">Profit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialProjections.map((projection, index) => (
                          <tr key={projection.period} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-3 font-medium">{projection.period}</td>
                            <td className="py-3 px-3 text-emerald-600 font-medium">{projection.revenue}</td>
                            <td className="py-3 px-3">{projection.users}</td>
                            <td className="py-3 px-3 text-coral-500">{projection.costs}</td>
                            <td className="py-3 px-3 text-primary-900 font-medium">{projection.profit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="rounded-2xl bg-gradient-to-br from-accent-500 to-accent-400 text-white border-0">
            <CardContent className="p-8">
              <h2 className="font-display text-3xl font-bold mb-4">
                Ready to Build Your Business?
              </h2>
              <p className="text-lg mb-6 text-white/90">
                Get a comprehensive business plan, technical specifications, and step-by-step implementation guide.
              </p>
              <Button 
                onClick={onContinueToFullBuild}
                size="lg"
                className="bg-white text-accent-500 hover:bg-neutral-100 rounded-2xl font-semibold px-8"
              >
                Continue to Full Build
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}