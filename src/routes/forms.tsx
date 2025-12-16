import { useState } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { createFileRoute } from '@tanstack/react-router'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { AppSidebar } from '@/components/app-sidebar'
import { Calendar } from '@/components/ui/calendar'
import { BidModal } from '@/components/bid-modal'
import { ButtonToggle } from '@/components/button-toggle'
import { LoginForm } from '@/components/login-form'
import { LoginModal } from '@/components/login-modal'
import { OTPModal } from '@/components/otp-modal'
import { RegistrationForm } from '@/components/registration-form'
import { RegistrationModal } from '@/components/registration-modal'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/forms')({
  component: App,
})

function ComponentSection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>
      {children}
    </section>
  )
}

type ComponentDemoProps = {
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  code?: string
  docs?: string
}

const ComponentDemo = ({
  title,
  description,
  children,
  code,
  docs,
}: ComponentDemoProps) => (
  <div className="space-y-3">
    <Tabs defaultValue="preview" className="w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-lg font-medium">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <TabsList className="ml-0 lg:ml-auto">
          <TabsTrigger className=" cursor-pointer" value="preview">
            Preview
          </TabsTrigger>
          <TabsTrigger className=" cursor-pointer" value="code">
            Code
          </TabsTrigger>
          <TabsTrigger className=" cursor-pointer" value="docs">
            Docs
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="preview" className="mt-3">
        <div className="border rounded-lg p-6 bg-background">{children}</div>
      </TabsContent>

      <TabsContent value="code" className="mt-3">
        <div className="border rounded-lg bg-muted">
          {code ? (
            <pre className="p-4 text-xs overflow-auto max-h-[500px]">
              <code>{code}</code>
            </pre>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No code example available
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="docs" className="mt-3">
        <div className="border rounded-lg p-6 bg-background">
          {docs ? (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {docs}
              </p>
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              No documentation available
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  </div>
)

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [showRegistration, setShowRegistration] = useState(false)
  const [showBidModal, setShowBidModal] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Sample auction item for bid modal demo
  const sampleAuctionItem = {
    id: 'AUC-001',
    title: 'John Deere 8320R Tractor - 2020 Model',
    currentBid: 145000,
    startingBid: 125000,
    bids: 24,
    endDate: '2025-12-15T18:00:00',
    category: 'Equipment',
    seller: 'Johnson Farm Equipment',
    location: 'Des Moines, IA',
  }

  const handleLogin = (data: any) => {
    console.log('Login data:', data)
    // Add your login logic here
    alert(`Login attempt for: ${data.email}`)
  }

  const handleOTPVerify = (otp: string) => {
    console.log('OTP verified:', otp)
    // Add your verification logic here
    alert(`OTP submitted: ${otp}`)
    setShowOTP(false)
  }

  const handleRegistration = (data: any) => {
    console.log('Registration data:', data)
    // Add your registration logic here
    alert(`Registration submitted for: ${data.email}`)
  }

  const handleBidSubmit = (bidAmount: number) => {
    console.log('Bid submitted:', bidAmount)
    // Add your bid logic here
    alert(`Bid of $${bidAmount.toLocaleString()} placed successfully!`)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Development</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Patterns</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto h-5 flex items-center gap-2 px-3">
            <div className=" md:block text-sm text-muted-foreground">
              <span className="px-2">v1.0.0</span>
            </div>
            <Separator orientation="vertical" />
            <ButtonToggle />
          </div>
        </header>
        <main className="container-wrapper flex flex-1 flex-col px-2">
          <div className="overflow-y-auto w-full min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                      Form Elements
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Form elements and input components for user data entry.
                      Input components and form patterns. Use consistent
                      spacing, clear labels, and accessible states for error,
                      success, and disabled. All form controls are built with
                      shadcn/ui and Tailwind CSS for a modern, cohesive look.
                    </p>
                  </div>

                  <Separator />

                  {/* Form Elements */}
                  <div className="space-y-8">
                    <ComponentSection title="" description="">
                      <ComponentDemo
                        title="Basic Inputs"
                        code={`import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <Label htmlFor="firstName">First Name</Label>
    <Input
      type="text"
      id="firstName"
      placeholder="First name"
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="lastName">Last Name</Label>
    <Input
      type="text"
      id="lastName"
      placeholder="Last name"
    />
  </div>
</div>`}
                        docs={`Basic text inputs with labels. Use clear, descriptive labels and helpful placeholder text. Always pair inputs with labels for accessibility.

Key Features:
• Responsive grid layout (1 column mobile, 2 columns desktop)
• Proper label-input associations with htmlFor
• Consistent spacing with space-y-2
• Placeholder text for user guidance`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              type="input"
                              id="firstName"
                              placeholder="First name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              type="input"
                              id="lastName"
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                      </ComponentDemo>

                      <ComponentDemo
                        title="Textarea"
                        code={`import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea
    id="message"
    placeholder="Type your message here..."
  />
</div>`}
                        docs={`Multi-line text input for longer content like messages, descriptions, or comments. Automatically resizes and supports all standard text input features.

Key Features:
• Auto-growing height based on content
• Supports placeholder text
• Accessible with proper label association
• Maintains consistent styling with other inputs`}
                      >
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Type your message here..."
                          />
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="Date Range Picker"
                        description="Select a date range with an intuitive calendar interface"
                        code={`import { useState } from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const [dateRange, setDateRange] = useState<DateRange | undefined>()

<div className="space-y-2 w-auto max-w-sm">
  <Label>Date Range</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !dateRange && "text-muted-foreground"
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {dateRange?.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, "LLL dd, y")} -{" "}
              {format(dateRange.to, "LLL dd, y")}
            </>
          ) : (
            format(dateRange.from, "LLL dd, y")
          )
        ) : (
          <span>Pick a date range</span>
        )}
        {dateRange?.from && (
          <span
            className="ml-auto flex items-center cursor-pointer hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDateRange(undefined)
            }}
          >
            <X className="h-4 w-4" />
          </span>
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 border rounded-md shadow-md" align="start">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={dateRange?.from}
        selected={dateRange}
        onSelect={setDateRange}
        numberOfMonths={2}
      />
    </PopoverContent>
  </Popover>
</div>`}
                        docs={`Date range picker component using react-day-picker with a popover interface. Perfect for filtering data, booking systems, and date selection.

Features:
• Visual calendar interface with 2-month view
• Select start and end dates by clicking
• Clear selection with X button
• Formatted date display (e.g., "Dec 01, 2025 - Dec 15, 2025")
• Keyboard accessible
• Mobile-friendly touch interface
• Proper ARIA labels for accessibility

Components Used:
• Popover - Overlay container
• Button - Trigger with date display
• Calendar - Date selection interface (react-day-picker)
• Icons - CalendarIcon, X for clear

State Management:
• Uses DateRange type from react-day-picker
• Stores { from: Date, to: Date } or undefined
• Updates on selection via onSelect callback

Use Cases:
• Date filtering in dashboards
• Booking/reservation systems
• Event date selection
• Analytics date ranges
• Report generation periods`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <div className="space-y-2 w-auto max-w-sm">
                            <Label>Date Range</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start text-left font-normal',
                                    !dateRange && 'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateRange?.from ? (
                                    dateRange.to ? (
                                      <>
                                        {format(dateRange.from, 'LLL dd, y')} -{' '}
                                        {format(dateRange.to, 'LLL dd, y')}
                                      </>
                                    ) : (
                                      format(dateRange.from, 'LLL dd, y')
                                    )
                                  ) : (
                                    <span>Pick a date range</span>
                                  )}
                                  {dateRange?.from && (
                                    <span
                                      className="ml-auto flex items-center cursor-pointer hover:text-destructive"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setDateRange(undefined)
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0 border rounded-md shadow-md"
                                align="start"
                              >
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  defaultMonth={dateRange?.from}
                                  selected={dateRange}
                                  onSelect={setDateRange}
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="Form Controls"
                        code={`import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

<div className="space-y-6">
  {/* Switch */}
  <div className="flex items-center space-x-2">
    <Switch id="notifications" />
    <Label htmlFor="notifications">
      Enable notifications
    </Label>
  </div>

  {/* Checkbox */}
  <div className="flex items-center space-x-2">
    <Checkbox id="terms" />
    <Label htmlFor="terms">
      Accept terms and conditions
    </Label>
  </div>

  {/* Radio Group */}
  <RadioGroup defaultValue="option1">
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option1" id="option1" />
      <Label htmlFor="option1">Option 1</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem value="option2" id="option2" />
      <Label htmlFor="option2">Option 2</Label>
    </div>
  </RadioGroup>
</div>`}
                        docs={`Interactive form controls for binary choices, multiple selections, and exclusive options.

Switch: On/off toggle for settings and preferences
Checkbox: Select one or multiple options
Radio Group: Choose one option from a set

Key Features:
• Accessible keyboard navigation
• Proper ARIA labels and roles
• Consistent visual styling
• Touch-friendly hit areas`}
                      >
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2">
                            <Switch id="notifications" />
                            <Label htmlFor="notifications">
                              Enable notifications
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">
                              Accept terms and conditions
                            </Label>
                          </div>

                          <RadioGroup defaultValue="option1">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="option1" id="option1" />
                              <Label htmlFor="option1">Option 1</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="option2" id="option2" />
                              <Label htmlFor="option2">Option 2</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </ComponentDemo>
                    </ComponentSection>
                    {/* Full Page Forms */}
                    <ComponentSection
                      title="Full Page Forms"
                      description="Complete form layouts with images, ideal for dedicated pages"
                    >
                      <ComponentDemo
                        title="Sign-on"
                        description="Full inline login form with image layout"
                        code={`import { LoginForm } from '@/components/login-form'

<div className="bg-muted flex min-w-full flex-col items-center justify-center p-6 md:p-10">
  <div className="w-full md:max-w-3xl">
    <LoginForm />
  </div>
</div>`}
                        docs={`Full-page login form component with image layout, ideal for dedicated authentication pages. Features email/password inputs, remember me option, and forgot password link.

Use Cases:
• Dedicated login pages
• Standalone authentication flows
• Marketing-focused sign-in experiences

Layout: Centered container with max-width constraint for optimal readability`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-muted flex min-w-full flex-col items-center justify-center p-6 md:p-10">
                            <div className="w-full md:max-w-3xl">
                              <LoginForm />
                            </div>
                          </div>
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="Registration"
                        description="Full inline registration form with image layout"
                        code={`import { RegistrationForm } from '@/components/registration-form'

<div className="bg-muted flex min-w-full flex-col items-center justify-center p-6 md:p-10">
  <div className="w-full md:max-w-3xl">
    <RegistrationForm />
  </div>
</div>`}
                        docs={`Full-page registration form with comprehensive fields including name, email, password, and confirmation. Features validation, password strength indicators, and terms acceptance.

Use Cases:
• User onboarding pages
• Account creation flows
• Full-screen registration experiences

Layout: Centered with responsive padding, optimal for conversion-focused pages`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-muted flex min-w-full flex-col items-center justify-center p-6 md:p-10">
                            <div className="w-full md:max-w-3xl">
                              <RegistrationForm />
                            </div>
                          </div>
                        </div>
                      </ComponentDemo>
                    </ComponentSection>
                    {/* Modals */}
                    <ComponentSection
                      title="Modals"
                      description="Overlay dialogs for user interactions"
                    >
                      <ComponentDemo
                        title="Sign-on Modal"
                        description="Compact modal version for navigation headers and CTAs"
                        code={`import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoginModal } from '@/components/login-modal'

const [showLogin, setShowLogin] = useState(false)

const handleLogin = (data) => {
  console.log('Login data:', data)
  // Add your login logic here
}

<Button onClick={() => setShowLogin(true)}>
  Open Login Modal
</Button>

<LoginModal
  open={showLogin}
  onOpenChange={setShowLogin}
  onLogin={handleLogin}
/>`}
                        docs={`Compact login modal for quick authentication without leaving the current page. Perfect for navigation headers, protected content, or inline authentication flows.

Features:
• Email and password inputs
• Remember me checkbox
• Forgot password link
• Form validation
• Mobile-optimized (slides from bottom)
• Desktop-optimized (centered with animation)

Props:
• open: boolean - Controls modal visibility
• onOpenChange: (open: boolean) => void - Callback when modal closes
• onLogin: (data) => void - Callback with email/password data`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => setShowLogin(true)}>
                            Open Login Modal
                          </Button>
                          <LoginModal
                            open={showLogin}
                            onOpenChange={setShowLogin}
                            onLogin={handleLogin}
                          />
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="One-Time Password (OTP)"
                        description="Secure verification using shadcn/ui InputOTP with auto-complete, paste support, and keyboard navigation"
                        code={`import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { OTPModal } from '@/components/otp-modal'

const [showOTP, setShowOTP] = useState(false)

const handleOTPVerify = (otp) => {
  console.log('OTP verified:', otp)
  // Add your verification logic here
}

<Button onClick={() => setShowOTP(true)}>
  Open OTP Modal
</Button>

<OTPModal
  open={showOTP}
  onOpenChange={setShowOTP}
  onVerify={handleOTPVerify}
  maxLength={6}
  title="Enter Verification Code"
  description="We've sent a 6-digit code to your email address"
/>`}
                        docs={`Secure one-time password verification modal with support for 2FA, email verification, and phone number confirmation.

Features:
• Auto-focus first input
• Automatic progression between inputs
• Paste support (auto-fills all inputs)
• Backspace navigation
• Keyboard-accessible
• Customizable length (4-8 digits)
• Resend code functionality
• Clear error states

Props:
• maxLength: number - OTP code length (typically 4 or 6)
• title: string - Modal title
• description: string - Helper text
• onVerify: (otp: string) => void - Callback with complete OTP`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => setShowOTP(true)}>
                            Open OTP Modal
                          </Button>
                          <OTPModal
                            open={showOTP}
                            onOpenChange={setShowOTP}
                            onVerify={handleOTPVerify}
                            maxLength={6}
                            title="Enter Verification Code"
                            description="We've sent a 6-digit code to your email address"
                          />
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="Registration Modal"
                        description="Compact modal version for space-constrained layouts"
                        code={`import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RegistrationModal } from '@/components/registration-modal'

const [showRegistration, setShowRegistration] = useState(false)

const handleRegistration = (data) => {
  console.log('Registration data:', data)
  // Add your registration logic here
}

<Button onClick={() => setShowRegistration(true)}>
  Open Registration Modal
</Button>

<RegistrationModal
  open={showRegistration}
  onOpenChange={setShowRegistration}
  onRegister={handleRegistration}
/>`}
                        docs={`Registration modal for quick sign-up flows without navigating away from the current page. Includes comprehensive validation and user-friendly error handling.

Features:
• Name, email, password fields
• Password confirmation
• Password strength indicator
• Terms and conditions checkbox
• Form validation
• Responsive layout
• Mobile-optimized bottom sheet
• Desktop-centered modal

Props:
• open: boolean - Controls modal visibility
• onOpenChange: (open: boolean) => void - Callback when modal closes
• onRegister: (data) => void - Callback with registration data

Validation:
• Email format validation
• Password strength requirements
• Password match confirmation
• Required fields checking`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => setShowRegistration(true)}>
                            Open Registration Modal
                          </Button>
                          <RegistrationModal
                            open={showRegistration}
                            onOpenChange={setShowRegistration}
                            onRegister={handleRegistration}
                          />
                        </div>
                      </ComponentDemo>
                      <ComponentDemo
                        title="Bid Modal"
                        description="Professional auction bidding interface with validation and quick bid options"
                        code={`import { useState } from 'react'
import { BidModal } from '@/components/bid-modal'
import { Button } from '@/components/ui/button'

const [showBidModal, setShowBidModal] = useState(false)

const auctionItem = {
  id: 'AUC-001',
  title: 'John Deere 8320R Tractor - 2020 Model',
  currentBid: 145000,
  startingBid: 125000,
  bids: 24,
  endDate: '2025-12-15T18:00:00',
  category: 'Equipment',
  seller: 'Johnson Farm Equipment',
  location: 'Des Moines, IA',
}

const handleBidSubmit = (bidAmount) => {
  console.log('Bid placed:', bidAmount)
  // Add your bid submission logic here
}

<Button onClick={() => setShowBidModal(true)}>
  Place a Bid
</Button>

<BidModal
  isOpen={showBidModal}
  onClose={() => setShowBidModal(false)}
  item={auctionItem}
  onSubmit={handleBidSubmit}
/>`}
                        docs={`Professional auction bidding modal with comprehensive validation, quick bid buttons, and detailed item information display.

Features:
• Item details (title, category, location, seller)
• Current/starting bid display
• Minimum bid validation
• Quick bid amount buttons ($100, $500, $1k, $2.5k increments)
• Dollar sign icon in input
• Real-time validation
• Loading states
• Error handling
• Mobile: Full-screen bottom sheet
• Desktop: Centered modal with slide-from-top animation

Props:
• isOpen: boolean - Controls modal visibility
• onClose: () => void - Callback when modal closes
• item: object - Auction item details
• onSubmit: (bidAmount: number) => void - Callback with bid amount

Validation:
• Ensures bid ≥ minimum bid
• Validates numeric input
• Shows clear error messages
• Prevents invalid submissions`}
                      >
                        <div className="flex flex-wrap gap-2">
                          <Button onClick={() => setShowBidModal(true)}>
                            Place a Bid
                          </Button>
                          <BidModal
                            isOpen={showBidModal}
                            onClose={() => setShowBidModal(false)}
                            item={sampleAuctionItem}
                            onSubmit={handleBidSubmit}
                          />
                        </div>
                      </ComponentDemo>
                    </ComponentSection>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
