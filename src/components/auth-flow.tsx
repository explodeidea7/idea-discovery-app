"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Github, Mail, Eye, EyeOff, Loader2, Check, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface AuthFlowProps {
  isOpen?: boolean
  onClose?: () => void
  onSuccess?: (user: any) => void
  defaultMode?: 'login' | 'signup'
}

interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
  isValid: boolean
}

const AuthFlow: React.FC<AuthFlowProps> = ({
  isOpen = true,
  onClose,
  onSuccess,
  defaultMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(defaultMode)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false
  })

  // Password strength calculation
  useEffect(() => {
    if (mode === 'signup' && formData.password) {
      const password = formData.password
      let score = 0
      const feedback: string[] = []

      if (password.length >= 8) score += 1
      else feedback.push('At least 8 characters')

      if (/[A-Z]/.test(password)) score += 1
      else feedback.push('One uppercase letter')

      if (/[a-z]/.test(password)) score += 1
      else feedback.push('One lowercase letter')

      if (/\d/.test(password)) score += 1
      else feedback.push('One number')

      if (/[!@#$%^&*]/.test(password)) score += 1
      else feedback.push('One special character')

      setPasswordStrength({
        score,
        feedback,
        isValid: score >= 4
      })
    }
  }, [formData.password, mode])

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (mode === 'signup' && !passwordStrength.isValid) {
      errors.password = 'Password does not meet requirements'
    }

    if (mode === 'signup') {
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (mode === 'forgot-password') {
        setSuccess('Password reset link sent to your email')
        setTimeout(() => setMode('login'), 2000)
      } else {
        setSuccess(mode === 'login' ? 'Welcome back!' : 'Account created successfully!')
        setTimeout(() => {
          onSuccess?.({ email: formData.email, mode })
        }, 1000)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate social login
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(`Connecting with ${provider}...`)
      setTimeout(() => {
        onSuccess?.({ provider, email: null })
      }, 1000)
    } catch (err) {
      setError(`Failed to connect with ${provider}. Please try again.`)
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'bg-coral-500'
    if (passwordStrength.score <= 3) return 'bg-yellow-500'
    return 'bg-accent-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak'
    if (passwordStrength.score <= 3) return 'Fair'
    return 'Strong'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-neutral-50 border border-neutral-100 shadow-lg rounded-2xl">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-2xl font-display text-primary-900">
              {mode === 'login' && 'Welcome back'}
              {mode === 'signup' && 'Create your account'}
              {mode === 'forgot-password' && 'Reset password'}
            </CardTitle>
            <CardDescription className="text-neutral-700 font-body">
              {mode === 'login' && 'Sign in to your account to continue'}
              {mode === 'signup' && 'Get started with your free account'}
              {mode === 'forgot-password' && 'Enter your email to receive reset instructions'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert className="border-coral-500 bg-coral-50">
                    <AlertCircle className="h-4 w-4 text-coral-500" />
                    <AlertDescription className="text-coral-500 font-body">
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert className="border-accent-500 bg-accent-50">
                    <Check className="h-4 w-4 text-accent-500" />
                    <AlertDescription className="text-accent-500 font-body">
                      {success}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {mode !== 'forgot-password' && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  disabled={isLoading}
                  className="bg-neutral-50 border-neutral-100 text-neutral-700 hover:bg-neutral-100 font-body transition-colors duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Github className="mr-2 h-4 w-4" />
                  )}
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="bg-neutral-50 border-neutral-100 text-neutral-700 hover:bg-neutral-100 font-body transition-colors duration-200"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Google
                </Button>
              </div>
            )}

            {mode !== 'forgot-password' && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-50 px-2 text-neutral-700 font-body">Or continue with</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-700 font-body">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={isLoading}
                  className={`bg-neutral-50 border-neutral-100 text-neutral-700 font-body transition-colors duration-200 ${
                    validationErrors.email ? 'border-coral-500 focus:ring-coral-500' : 'focus:ring-primary-900'
                  }`}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
                {validationErrors.email && (
                  <p id="email-error" className="text-sm text-coral-500 font-body">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-neutral-700 font-body">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      disabled={isLoading}
                      className={`bg-neutral-50 border-neutral-100 text-neutral-700 font-body pr-10 transition-colors duration-200 ${
                        validationErrors.password ? 'border-coral-500 focus:ring-coral-500' : 'focus:ring-primary-900'
                      }`}
                      aria-describedby={validationErrors.password ? 'password-error' : undefined}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-700" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-700" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p id="password-error" className="text-sm text-coral-500 font-body">
                      {validationErrors.password}
                    </p>
                  )}

                  {mode === 'signup' && formData.password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-700 font-body">Password strength</span>
                        <span className={`text-sm font-body ${
                          passwordStrength.score <= 2 ? 'text-coral-500' :
                          passwordStrength.score <= 3 ? 'text-yellow-600' :
                          'text-accent-500'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-2 rounded-full transition-colors duration-300 ${getPasswordStrengthColor()}`}
                        />
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-neutral-700 font-body">
                          Missing: {passwordStrength.feedback.join(', ')}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirm-password" className="text-neutral-700 font-body">
                    Confirm password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      disabled={isLoading}
                      className={`bg-neutral-50 border-neutral-100 text-neutral-700 font-body pr-10 transition-colors duration-200 ${
                        validationErrors.confirmPassword ? 'border-coral-500 focus:ring-coral-500' : 'focus:ring-primary-900'
                      }`}
                      aria-describedby={validationErrors.confirmPassword ? 'confirm-password-error' : undefined}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-700" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-700" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p id="confirm-password-error" className="text-sm text-coral-500 font-body">
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                </motion.div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      disabled={isLoading}
                      className="border-neutral-100 data-[state=checked]:bg-accent-500 data-[state=checked]:border-accent-500"
                    />
                    <Label
                      htmlFor="remember"
                      className="text-sm text-neutral-700 font-body cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('forgot-password')}
                    disabled={isLoading}
                    className="p-0 h-auto text-sm text-primary-600 hover:text-primary-900 font-body"
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-900 hover:bg-primary-600 text-neutral-50 font-body transition-colors duration-200"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && 'Create account'}
                {mode === 'forgot-password' && 'Send reset link'}
              </Button>
            </form>

            <div className="text-center">
              {mode === 'login' && (
                <p className="text-sm text-neutral-700 font-body">
                  Don't have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('signup')}
                    disabled={isLoading}
                    className="p-0 h-auto text-sm text-primary-600 hover:text-primary-900 font-body"
                  >
                    Sign up
                  </Button>
                </p>
              )}
              {mode === 'signup' && (
                <p className="text-sm text-neutral-700 font-body">
                  Already have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('login')}
                    disabled={isLoading}
                    className="p-0 h-auto text-sm text-primary-600 hover:text-primary-900 font-body"
                  >
                    Sign in
                  </Button>
                </p>
              )}
              {mode === 'forgot-password' && (
                <p className="text-sm text-neutral-700 font-body">
                  Remember your password?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('login')}
                    disabled={isLoading}
                    className="p-0 h-auto text-sm text-primary-600 hover:text-primary-900 font-body"
                  >
                    Sign in
                  </Button>
                </p>
              )}
            </div>

            {onClose && (
              <div className="text-center pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isLoading}
                  className="text-sm text-neutral-700 hover:text-primary-900 font-body"
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AuthFlow