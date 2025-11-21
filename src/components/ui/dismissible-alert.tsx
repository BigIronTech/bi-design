import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function DismissibleAlert() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) {
    return (
      <div className="flex items-center justify-center h-50 bg-gray-50 p-4">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          className="text-foreground dark:text-background dark:border-accent-background cursor-pointer"
        >
          Show Alert
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-50 bg-gray-50/50">
      <div className="w-full">
        <Alert className="relative flex">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 flex items-center justify-center">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <AlertTitle className="mb-1">Dismissible Info Alert</AlertTitle>
              <AlertDescription>
                This is a dismissible alert component built with Tailwind CSS.
                Click the X button to dismiss it.
              </AlertDescription>
            </div>
            <Button variant="info">Learn More</Button>
            <div className="flex-shrink-0 w-px h-8 bg-slate-300"></div>
            <Button
              onClick={() => setIsVisible(false)}
              variant={'ghost'}
              className="w-9 rounded-full p-1 flex-shrink-0 ml-3 inline-flex text-blue-500 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 transition-colors"
              aria-label="Dismiss alert"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  )
}
