import React, { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function FormWithErrors() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [showAlert, setShowAlert] = useState(false)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setShowAlert(true)
    } else {
      setErrors({})
      setShowAlert(false)
      alert('Form submitted successfully!')
    }
  }

  return (
    <div className="bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Inline error alerts
          </h1>
          <p className="text-slate-600 mt-2">
            This is for example purposes only. <br /> Leave fields blank or
            enter invalid data to see error states.
          </p>
        </div>

        {showAlert && (
          <Alert variant="destructive" className="relative flex">
            <div className="flex items-center w-full gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There {Object.keys(errors).length === 1 ? 'is' : 'are'}{' '}
                  {Object.keys(errors).length} error
                  {Object.keys(errors).length !== 1 ? 's' : ''} with your
                  submission. Please check the form below.
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
              }
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
                errors.password
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : ''
              }
            />
            {errors.password && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.password}
              </p>
            )}
          </div>

          <Button type="submit" onClick={handleSubmit} className="w-full">
            Sign In
          </Button>
        </div>
      </div>
    </div>
  )
}
