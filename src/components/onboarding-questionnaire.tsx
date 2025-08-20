"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, HelpCircle, Check, Save, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: string
  title: string
  subtitle?: string
  type: 'multiple-choice' | 'text' | 'slider' | 'tags' | 'checkboxes'
  required: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number
  placeholder?: string
  help?: string
}

interface QuestionnaireData {
  [key: string]: any
}

const questions: Question[] = [
  {
    id: 'industry',
    title: 'What industries interest you most?',
    subtitle: 'Select up to 3 areas you\'d like to explore',
    type: 'checkboxes',
    required: true,
    options: [
      'Technology & Software',
      'Healthcare & Wellness',
      'Finance & Fintech',
      'E-commerce & Retail',
      'Education & EdTech',
      'Food & Beverage',
      'Real Estate',
      'Manufacturing',
      'Professional Services',
      'Entertainment & Media'
    ],
    help: 'Choose industries that align with your interests and expertise. This helps us suggest relevant business opportunities.'
  },
  {
    id: 'experience',
    title: 'What\'s your entrepreneurial experience level?',
    type: 'multiple-choice',
    required: true,
    options: [
      'Complete beginner - just getting started',
      'Some experience - have explored ideas before',
      'Moderate experience - launched a side project',
      'Experienced - have run businesses before',
      'Expert - serial entrepreneur'
    ],
    help: 'This helps us tailor recommendations to your experience level and suggest appropriate next steps.'
  },
  {
    id: 'budget',
    title: 'What\'s your initial investment budget?',
    subtitle: 'How much can you realistically invest to start?',
    type: 'multiple-choice',
    required: true,
    options: [
      'Under $1,000',
      '$1,000 - $5,000',
      '$5,000 - $25,000',
      '$25,000 - $100,000',
      'Over $100,000'
    ],
    help: 'Be realistic about your available capital. This includes personal savings, loans, or investment you can secure.'
  },
  {
    id: 'timeline',
    title: 'When do you want to launch your business?',
    type: 'multiple-choice',
    required: true,
    options: [
      'Within 3 months',
      '3-6 months',
      '6-12 months',
      '1-2 years',
      'More than 2 years'
    ],
    help: 'Your timeline affects the type of business model we\'ll recommend and the complexity of ideas we suggest.'
  },
  {
    id: 'market_preference',
    title: 'What type of market do you prefer?',
    type: 'multiple-choice',
    required: true,
    options: [
      'Local/Regional market',
      'National market',
      'Global/International market',
      'Niche/Specialized market',
      'Mass market'
    ],
    help: 'Different markets require different strategies, resources, and approaches to succeed.'
  },
  {
    id: 'risk_tolerance',
    title: 'Rate your risk tolerance',
    subtitle: 'How comfortable are you with business uncertainty?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    step: 1,
    help: 'Risk tolerance affects business model recommendations. Higher tolerance opens more aggressive growth opportunities.'
  },
  {
    id: 'strengths',
    title: 'What are your key strengths?',
    subtitle: 'Select all that apply to you',
    type: 'tags',
    required: false,
    options: [
      'Sales & Marketing',
      'Technical Skills',
      'Financial Management',
      'Leadership',
      'Creativity',
      'Problem Solving',
      'Networking',
      'Operations',
      'Customer Service',
      'Strategic Planning'
    ],
    help: 'Understanding your strengths helps us suggest businesses that leverage your natural abilities.'
  },
  {
    id: 'goals',
    title: 'What\'s your primary business goal?',
    type: 'multiple-choice',
    required: true,
    options: [
      'Generate passive income',
      'Replace my full-time job',
      'Build wealth over time',
      'Create social impact',
      'Achieve work-life balance',
      'Build something to sell later'
    ],
    help: 'Your goals determine the type of business model and growth strategy we\'ll recommend.'
  }
]

interface OnboardingQuestionnaireProps {
  onComplete?: (answers: QuestionnaireData) => void
}

export default function OnboardingQuestionnaire({ onComplete }: OnboardingQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<QuestionnaireData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [autoSaved, setAutoSaved] = useState<Record<string, boolean>>({})
  const [showSummary, setShowSummary] = useState(false)

  const currentQuestion = questions[currentStep]
  const totalSteps = questions.length
  const progress = ((currentStep + 1) / totalSteps) * 100

  // Auto-save functionality
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const saveTimer = setTimeout(() => {
        localStorage.setItem('questionnaire-answers', JSON.stringify(answers))
        setAutoSaved(prev => ({ ...prev, [currentQuestion?.id]: true }))
        setTimeout(() => {
          setAutoSaved(prev => ({ ...prev, [currentQuestion?.id]: false }))
        }, 2000)
      }, 1000)

      return () => clearTimeout(saveTimer)
    }
  }, [answers, currentQuestion?.id])

  // Load saved answers on mount
  useEffect(() => {
    const saved = localStorage.getItem('questionnaire-answers')
    if (saved) {
      setAnswers(JSON.parse(saved))
    }
  }, [])

  const validateAnswer = (question: Question, value: any): string => {
    if (question.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required'
    }

    if (question.type === 'checkboxes' && question.id === 'industry' && value?.length > 3) {
      return 'Please select up to 3 industries only'
    }

    return ''
  }

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    
    const question = questions.find(q => q.id === questionId)
    if (question) {
      const error = validateAnswer(question, value)
      setErrors(prev => ({ ...prev, [questionId]: error }))
    }
  }

  const handleNext = async () => {
    const error = validateAnswer(currentQuestion, answers[currentQuestion.id])
    
    if (error) {
      setErrors(prev => ({ ...prev, [currentQuestion.id]: error }))
      return
    }

    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate processing
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setShowSummary(true)
    }
    
    setIsLoading(false)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    if (!currentQuestion.required) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        setShowSummary(true)
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    // Save and hand off to parent to begin analysis/generation
    localStorage.removeItem('questionnaire-answers')
    onComplete?.(answers)
    setIsLoading(false)
  }

  const renderQuestion = (question: Question) => {
    const currentValue = answers[question.id]
    const hasError = errors[question.id]

    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup
            value={currentValue || ''}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-100/50 transition-colors">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'checkboxes':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-100/50 transition-colors">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={currentValue?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const newValue = currentValue || []
                    if (checked) {
                      handleAnswerChange(question.id, [...newValue, option])
                    } else {
                      handleAnswerChange(question.id, newValue.filter((item: string) => item !== option))
                    }
                  }}
                />
                <Label htmlFor={`${question.id}-${index}`} className="flex-1 cursor-pointer text-base leading-relaxed">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'tags':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {question.options?.map((option, index) => {
              const isSelected = currentValue?.includes(option) || false
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    const newValue = currentValue || []
                    if (isSelected) {
                      handleAnswerChange(question.id, newValue.filter((item: string) => item !== option))
                    } else {
                      handleAnswerChange(question.id, [...newValue, option])
                    }
                  }}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    isSelected
                      ? 'border-accent-500 bg-accent-500 text-white'
                      : 'border-neutral-100 bg-white hover:border-accent-400 hover:bg-accent-50'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>
        )

      case 'slider':
        return (
          <div className="space-y-6">
            <div className="px-3">
              <Slider
                value={[currentValue || question.min || 1]}
                onValueChange={(value) => handleAnswerChange(question.id, value[0])}
                min={question.min || 1}
                max={question.max || 10}
                step={question.step || 1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-neutral-700 px-3">
              <span>Low Risk</span>
              <span className="font-semibold text-accent-500">
                {currentValue || question.min || 1}/{question.max || 10}
              </span>
              <span>High Risk</span>
            </div>
          </div>
        )

      case 'text':
        return (
          <Input
            value={currentValue || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={`text-base ${hasError ? 'border-coral-500' : ''}`}
          />
        )

      default:
        return null
    }
  }

  if (showSummary) {
    return (
      <div className="bg-neutral-50 min-h-screen py-8">
        <div className="container max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg rounded-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-display text-primary-900">
                Review Your Answers
              </CardTitle>
              <p className="text-neutral-700 text-lg mt-2">
                Please review your responses before we generate your personalized business recommendations
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => {
                const answer = answers[question.id]
                if (!answer) return null

                return (
                  <div key={question.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                    <h3 className="font-semibold text-primary-900 mb-2">{question.title}</h3>
                    <div className="text-neutral-700">
                      {Array.isArray(answer) ? answer.join(', ') : answer.toString()}
                    </div>
                  </div>
                )
              })}

              <div className="flex gap-4 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowSummary(false)}
                  className="flex-1"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Edit
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-accent-500 hover:bg-accent-400"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Ideas...
                    </>
                  ) : (
                    'Generate My Business Ideas'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="container max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display text-primary-900">
              Business Discovery Questionnaire
            </h1>
            <div className="text-sm text-neutral-700">
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-neutral-100 shadow-lg rounded-2xl border-0">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl font-display text-primary-900 leading-tight">
                      {currentQuestion.title}
                    </CardTitle>
                    {currentQuestion.subtitle && (
                      <p className="text-neutral-700 mt-2 text-lg">
                        {currentQuestion.subtitle}
                      </p>
                    )}
                  </div>
                  {currentQuestion.help && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="ml-4 p-2">
                            <HelpCircle className="w-5 h-5 text-neutral-700" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{currentQuestion.help}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderQuestion(currentQuestion)}
                
                {errors[currentQuestion.id] && (
                  <div className="flex items-center gap-2 text-coral-500 text-sm">
                    <div className="w-1 h-1 bg-coral-500 rounded-full" />
                    {errors[currentQuestion.id]}
                  </div>
                )}

                {autoSaved[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-accent-500 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Saved automatically
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-3">
            {!currentQuestion.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="flex items-center gap-2 text-neutral-700"
              >
                <SkipForward className="w-4 h-4" />
                Skip
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="bg-accent-500 hover:bg-accent-400 flex items-center gap-2 min-w-[120px]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === totalSteps - 1 ? 'Review' : 'Next'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}