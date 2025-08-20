"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Search, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  Clock, 
  X,
  RefreshCw,
  Activity,
  Sparkles,
  Target,
  BarChart3,
  Zap
} from 'lucide-react'

interface AnalysisStage {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  status: 'pending' | 'active' | 'complete'
  estimatedTime: number
}

interface ActivityUpdate {
  id: string
  title: string
  description: string
  timestamp: Date
  type: 'insight' | 'data' | 'progress'
}

interface AnalysisDashboardProps {
  userId?: string
  onCancel?: () => void
  onComplete?: (results: any) => void
  onError?: (error: string) => void
}

export default function AnalysisDashboard({
  userId = "user-123",
  onCancel,
  onComplete,
  onError
}: AnalysisDashboardProps) {
  const [progress, setProgress] = useState(15)
  const [currentStage, setCurrentStage] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(480) // 8 minutes in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [activityFeed, setActivityFeed] = useState<ActivityUpdate[]>([])
  const [error, setError] = useState<string | null>(null)

  const stages: AnalysisStage[] = [
    {
      id: 'profile',
      title: 'Profile Analysis',
      description: 'Analyzing your background, skills, and preferences',
      icon: User,
      status: 'complete',
      estimatedTime: 60
    },
    {
      id: 'market',
      title: 'Market Research',
      description: 'Researching current market trends and opportunities',
      icon: Search,
      status: 'active',
      estimatedTime: 180
    },
    {
      id: 'trends',
      title: 'Trend Analysis',
      description: 'Identifying emerging trends and market gaps',
      icon: TrendingUp,
      status: 'pending',
      estimatedTime: 120
    },
    {
      id: 'ideation',
      title: 'Idea Generation',
      description: 'Generating personalized business ideas',
      icon: Lightbulb,
      status: 'pending',
      estimatedTime: 90
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Validating ideas against market data',
      icon: CheckCircle2,
      status: 'pending',
      estimatedTime: 60
    }
  ]

  // Simulate real-time updates
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          onComplete?.({})
          return 100
        }
        return prev + Math.random() * 3
      })
    }, 2000)

    const timeInterval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1))
    }, 1000)

    const activityInterval = setInterval(() => {
      const activities = [
        { type: 'insight', title: 'Market insight discovered', description: 'Found growing demand in sustainable tech sector' },
        { type: 'data', title: 'Competitor analysis complete', description: 'Analyzed 50+ companies in your target market' },
        { type: 'progress', title: 'Trend pattern identified', description: 'Remote work solutions showing 45% growth' },
        { type: 'insight', title: 'Skill match found', description: 'Your background aligns with fintech opportunities' }
      ]
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      setActivityFeed(prev => [{
        id: Date.now().toString(),
        ...randomActivity,
        timestamp: new Date()
      } as ActivityUpdate, ...prev.slice(0, 4)])
    }, 5000)

    const loadingTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(timeInterval)
      clearInterval(activityInterval)
      clearTimeout(loadingTimeout)
    }
  }, [onComplete])

  // Update current stage based on progress
  useEffect(() => {
    if (progress < 20) setCurrentStage(0)
    else if (progress < 40) setCurrentStage(1)
    else if (progress < 60) setCurrentStage(2)
    else if (progress < 80) setCurrentStage(3)
    else setCurrentStage(4)
  }, [progress])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const handleRetry = () => {
    setError(null)
    setProgress(15)
    setCurrentStage(0)
    setTimeRemaining(480)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full"
          />
          <p className="text-neutral-700 font-body">Initializing analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-card border-border">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-coral-500 rounded-full flex items-center justify-center mx-auto">
              <X className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground">Analysis Error</h3>
            <p className="text-muted-foreground font-body">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleRetry} className="bg-accent hover:bg-accent-400">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Analysis
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${getComputedStyle(document.documentElement).getPropertyValue('--color-accent-500')} 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12 border-2 border-accent-500">
              <AvatarImage src="/api/placeholder/48/48" />
              <AvatarFallback className="bg-accent-500 text-white font-body">JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">Analysis in Progress</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-accent-500 text-white border-0 font-body">
                  <Activity className="w-3 h-3 mr-1" />
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground font-body">
                  Started {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-coral-500 text-coral-500 hover:bg-coral-500 hover:text-white">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display text-foreground">Cancel Analysis?</AlertDialogTitle>
                <AlertDialogDescription className="font-body">
                  Are you sure you want to cancel this analysis? Your progress will be lost and you'll need to start over.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="font-body">Continue Analysis</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleCancel}
                  className="bg-coral-500 hover:bg-coral-400 text-white font-body"
                >
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Circle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-6">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-neutral-100"
                        />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-accent-500"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: progress / 100 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          style={{
                            strokeDasharray: `${2 * Math.PI * 45}`,
                            strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            key={Math.floor(progress)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl font-display font-bold text-foreground"
                          >
                            {Math.floor(progress)}%
                          </motion.div>
                          <div className="text-sm text-muted-foreground font-body">Complete</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-display font-semibold text-foreground">
                        {stages[currentStage]?.title}
                      </h3>
                      <p className="text-muted-foreground font-body">
                        {stages[currentStage]?.description}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-muted-foreground font-body">
                      <Clock className="w-4 h-4" />
                      <span>Estimated time remaining: {formatTime(timeRemaining)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stage Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-6">Analysis Stages</h3>
                  <div className="space-y-4">
                    {stages.map((stage, index) => {
                      const Icon = stage.icon
                      const isActive = index === currentStage
                      const isComplete = index < currentStage || stage.status === 'complete'
                      
                      return (
                        <motion.div
                          key={stage.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                            isActive 
                              ? 'border-accent-500 bg-accent-500/5' 
                              : isComplete 
                                ? 'border-green-500 bg-green-500/5' 
                                : 'border-neutral-100 bg-neutral-50'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isComplete 
                              ? 'bg-green-500 text-white' 
                              : isActive 
                                ? 'bg-accent-500 text-white' 
                                : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <Icon className="w-6 h-6" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-display font-semibold text-foreground">{stage.title}</h4>
                            <p className="text-sm text-muted-foreground font-body">{stage.description}</p>
                          </div>

                          {isActive && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-accent-500 border-t-transparent rounded-full"
                            />
                          )}

                          {isComplete && (
                            <Badge className="bg-green-500 text-white border-0 font-body">
                              Complete
                            </Badge>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Activity Feed */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Sparkles className="w-5 h-5 text-accent-500" />
                    <h3 className="text-lg font-display font-semibold text-foreground">What's Happening Now</h3>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {activityFeed.map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: -20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 20, scale: 0.9 }}
                          className="p-4 rounded-xl border border-neutral-100 bg-neutral-50"
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              activity.type === 'insight' 
                                ? 'bg-accent-500 text-white' 
                                : activity.type === 'data'
                                  ? 'bg-primary text-white'
                                  : 'bg-coral-500 text-white'
                            }`}>
                              {activity.type === 'insight' && <Lightbulb className="w-4 h-4" />}
                              {activity.type === 'data' && <BarChart3 className="w-4 h-4" />}
                              {activity.type === 'progress' && <Zap className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-body font-semibold text-foreground text-sm">{activity.title}</h4>
                              <p className="text-xs text-muted-foreground font-body mt-1">{activity.description}</p>
                              <span className="text-xs text-muted-foreground font-body">
                                {activity.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {activityFeed.length === 0 && (
                      <div className="text-center py-8">
                        <Target className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-body">Waiting for updates...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-body font-medium text-foreground">Overall Progress</span>
                      <span className="text-sm font-body text-muted-foreground">{Math.floor(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground font-body">
                      <span>Started</span>
                      <span>Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}