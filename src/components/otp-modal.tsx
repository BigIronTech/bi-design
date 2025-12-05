import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp'

interface OTPModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (otp: string) => void
  maxLength?: number
  title?: string
  description?: string
}

export function OTPModal({
  open,
  onOpenChange,
  onVerify,
  maxLength = 6,
  title = 'Enter Verification Code',
  description = 'Please enter the verification code sent to your device',
}: OTPModalProps) {
  const [value, setValue] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.length === maxLength) {
      onVerify(value)
      setValue('') // Reset after verification
    }
  }

  const handleComplete = (value: string) => {
    if (value.length === maxLength) {
      onVerify(value)
      setValue('') // Reset after verification
    }
  }

  const isComplete = value.length === maxLength

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={maxLength}
              value={value}
              onChange={setValue}
              onComplete={handleComplete}
            >
              <InputOTPGroup>
                {Array.from({ length: Math.ceil(maxLength / 2) }).map(
                  (_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ),
                )}
              </InputOTPGroup>
              {maxLength > 3 && <InputOTPSeparator />}
              <InputOTPGroup>
                {Array.from({ length: Math.floor(maxLength / 2) }).map(
                  (_, i) => (
                    <InputOTPSlot
                      key={i + Math.ceil(maxLength / 2)}
                      index={i + Math.ceil(maxLength / 2)}
                    />
                  ),
                )}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={!isComplete} className="w-full">
              Verify
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setValue('')}
              className="w-full"
            >
              Clear
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Didn't receive a code?{' '}
            <button
              type="button"
              className="text-blue-600 underline-offset-4 hover:underline cursor-pointer active:outline-none active:ring-2 active:ring-blue-500 active:ring-offset-2 active:ring-offset-blue-50"
              onClick={() => {
                // Handle resend logic here
                console.log('Resend code')
              }}
            >
              Resend
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
