import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ButtonToggle } from '@/components/button-toggle'
import { LoginForm } from '@/components/login-form'

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
}

const ComponentDemo = ({
  title,
  description,
  children,
  code,
}: ComponentDemoProps) => (
  <div className="space-y-3">
    <div>
      <h4 className="text-lg font-medium">{title}</h4>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="border rounded-lg p-6 bg-background">{children}</div>
    {code && (
      <details className="text-xs">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
          View code
        </summary>
        <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">
          <code>{code}</code>
        </pre>
      </details>
    )}
  </div>
)

const PasswordField = ({
  control,
}: {
  control: React.InputHTMLAttributes<HTMLInputElement>
}) => {
  const [isView, setIsView] = useState(false)

  return (
    <div className="relative">
      <Input
        id="password"
        type={isView ? 'text' : 'password'}
        placeholder="Enter password"
        {...control}
      />
      {isView ? (
        <Eye
          className="absolute w-4 h-4 right-2.5 top-2.5 z-10 cursor-pointer text-gray-500"
          onClick={() => {
            ;(setIsView(!isView), console.log(isView))
          }}
        />
      ) : (
        <EyeOff
          className="absolute w-4 h-4 right-2.5 top-2.5 z-10 cursor-pointer text-gray-500"
          onClick={() => setIsView(!isView)}
        />
      )}
    </div>
  )
}

function App() {
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
                      <ComponentDemo title="Basic Inputs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Enter your email" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordField
                              control={{
                                className: 'col-span-1 md:col-span-2',
                              }}
                            />
                          </div>
                        </div>
                      </ComponentDemo>

                      <ComponentDemo title="Textarea">
                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Type your message here..."
                          />
                        </div>
                      </ComponentDemo>

                      <ComponentDemo title="Form Controls">
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
                    {/* Modals */}
                    <ComponentSection
                      title="Modals"
                      description="Overlay dialogs for user interactions"
                    >
                      <ComponentDemo title="Sign-on">
                        <div className="flex flex-wrap gap-2">
                          <div className="bg-muted flex min-w-full flex-col items-center justify-center p-6 md:p-10">
                            <div className="w-full md:max-w-3xl">
                              <LoginForm />
                            </div>
                          </div>
                        </div>
                      </ComponentDemo>
                      <ComponentDemo title="Registration">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="draft">Coming Soon</Badge>
                        </div>
                      </ComponentDemo>
                      <ComponentDemo title="Calendar">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="draft">Coming Soon</Badge>
                        </div>
                      </ComponentDemo>
                      <ComponentDemo title="Bid Input">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="draft">Coming Soon</Badge>
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
