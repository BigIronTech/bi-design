import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

import {
  AlertCircle,
  ChevronRight,
  CircleCheckBig,
  Clock,
  Info,
  TriangleAlert,
} from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircle,
  faCircleExclamation,
  faEye,
  faLocationDot,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarRight } from '@/components/sidebar-right'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ButtonToggle } from '@/components/button-toggle'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import DismissibleAlert from '@/components/ui/dismissible-alert'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import FormWithErrors from '@/components/form-with-errors'
import { BreadcrumbResponsive } from '@/components/breadcrumb-responsive'

export const Route = createFileRoute('/elements')({
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

function App() {
  // Table of contents data
  const sections = [
    { id: 'alerts', title: 'Alerts', level: 1 },
    { id: 'site-alerts', title: 'Site Alerts', level: 2 },
    { id: 'page-alerts', title: 'Page Alerts', level: 2 },
    { id: 'inline-alerts', title: 'Inline Alerts', level: 2 },
    { id: 'badges', title: 'Badges', level: 1 },
    { id: 'breadcrumbs', title: 'Breadcrumbs', level: 1 },
    { id: 'buttons', title: 'Buttons', level: 1 },
    { id: 'button-variants', title: 'Button Variants', level: 2 },
    { id: 'button-sizes', title: 'Button Sizes', level: 2 },
    { id: 'cards', title: 'Cards', level: 1 },
  ]
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
                  <BreadcrumbPage>Components</BreadcrumbPage>
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
        <main className="container-wrapper flex flex-1 flex-row">
          <div className="overflow-y-auto w-full min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto px-2">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                      Elements
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      A collection of reusable UI components built with
                      accessibility and customization in mind.
                    </p>
                  </div>
                  <Separator orientation="horizontal" className="my-6" />
                  {/* Components */}
                  <div className="space-y-8">
                    {/* Alerts */}
                    <div id="alerts">
                      <ComponentSection
                        title="Alerts and Notifications"
                        description="Contextual feedback messages. TBA: Mobile Friendly, Inline, Toasts (Sonner), Cookie Consent and Dismissible"
                      >
                        {/* Site-level */}
                        <div id="site-alerts" className="space-y-6">
                          <ComponentDemo title="Site Level Alert Variants">
                            <div className="space-y-4">
                              <Alert className="relative flex rounded-full py-2 px-3 pr-2 items-center bg-sky-500 border-0 text-white shadow-md backdrop-blur-sm">
                                <div className="flex items-center gap-4 w-full">
                                  <div className="flex-1 min-w-100">
                                    <div className="flex items-center gap-4">
                                      <Badge className="bg-sky-100 text-sky-600 uppercase font-bold border-0 rounded-2xl dark:text-sky-600">
                                        New
                                      </Badge>
                                      <AlertTitle className="flex-1 leading-3.5">
                                        New Feature Available
                                      </AlertTitle>
                                    </div>
                                  </div>
                                  <Button
                                    className="flex-shrink-0 h-6 text-white font-bold rounded-full flex items-center justify-center p-0 bg-sky-400 hover:bg-sky-50:text-sky-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 border-0 shadow-md hover:shadow-lg"
                                    variant="info"
                                  >
                                    Check it out
                                    <ChevronRight className="text-white w-4 h-4" />
                                  </Button>
                                </div>
                              </Alert>
                            </div>
                          </ComponentDemo>
                        </div>
                        {/* Page-level */}
                        <div id="page-alerts" className="space-y-6">
                          <ComponentDemo title="Page Level Alert Variants">
                            <div className="space-y-4">
                              <Alert className="relative flex">
                                <div className="flex items-center w-full gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-sky-50 to-sky-100/50 border-2 border-sky-200 flex items-center justify-center">
                                    <Info className="h-6 w-6 text-sky-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <AlertTitle className="mb-1">
                                      Information Alert
                                    </AlertTitle>
                                    <AlertDescription>
                                      Check out our latest updates to improve
                                      your workflow and productivity.
                                    </AlertDescription>
                                  </div>
                                  <Button variant="info">Learn More</Button>
                                </div>
                              </Alert>
                              <Alert
                                className="flex items-start gap-4"
                                variant="success"
                              >
                                <div className="flex items-center w-full gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 flex items-center justify-center">
                                    <CircleCheckBig className="h-6 w-6 text-emerald-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <AlertTitle className="mb-1">
                                      Successful Alert
                                    </AlertTitle>
                                    <AlertDescription>
                                      Your subscription will expire in 3 days.
                                      Renew now to avoid service interruption.
                                    </AlertDescription>
                                  </div>
                                  <Button variant="successful">
                                    Take Me There
                                  </Button>
                                </div>
                              </Alert>
                              <Alert
                                className="flex items-start gap-4"
                                variant="warning"
                              >
                                <div className="flex items-center w-full gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-200 flex items-center justify-center">
                                    <TriangleAlert className="h-6 w-6 text-amber-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <AlertTitle className="mb-1">
                                      Warning Alert
                                    </AlertTitle>
                                    <AlertDescription>
                                      Your subscription will expire in 3 days.
                                      Renew now to avoid service interruption.
                                    </AlertDescription>
                                  </div>
                                  <Button variant="warning">
                                    Show Me Where
                                  </Button>
                                </div>
                              </Alert>
                              <Alert
                                className="relative flex"
                                variant="destructive"
                              >
                                <div className="flex items-center w-full gap-4">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 flex items-center justify-center">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <AlertTitle className="mb-1">
                                      Upload Failed
                                    </AlertTitle>
                                    <AlertDescription>
                                      There was an error processing your file.
                                      Please check the format and try again.
                                    </AlertDescription>
                                  </div>
                                  <Button variant="destructive">Retry</Button>
                                </div>
                              </Alert>
                              <DismissibleAlert />
                            </div>
                          </ComponentDemo>
                        </div>
                        {/* Inline Alerts */}
                        <div id="inline-alerts" className="space-y-6">
                          <ComponentDemo title="Inline Alert Variants">
                            <FormWithErrors />
                          </ComponentDemo>
                        </div>
                      </ComponentSection>
                    </div>
                    {/* Badges */}
                    <div id="badges">
                      <ComponentSection
                        title="Badges"
                        description="Small status indicators"
                      >
                        <ComponentDemo title="Badge Variants">
                          <div className="flex flex-wrap gap-2">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                className="h-4 w-4"
                              />
                              Destructive
                            </Badge>
                            <Badge variant="information">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                              Information
                            </Badge>
                            <Badge variant="successful">Successful</Badge>
                            <Badge variant="warning">
                              <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                className="h-4 w-4"
                              />
                              Warning
                            </Badge>
                            <Badge variant="neutral">Neutral</Badge>
                            <Badge variant="location">
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className="h-4 w-4"
                              />
                              Location
                            </Badge>
                            <Badge variant="draft">Draft</Badge>
                            <Badge variant="archived">Archived</Badge>
                          </div>
                        </ComponentDemo>
                      </ComponentSection>
                    </div>
                    {/* Breadcrumbs */}
                    <div id="breadcrumbs">
                      <ComponentSection
                        title="Breadcrumbs"
                        description="Navigation indicators showing the user's location within a hierarchy."
                      >
                        <p className="text-base text-muted-foreground">
                          It is a <strong>responsive</strong> breadcrumb that
                          utilizes a <strong>Dropdown Menu</strong> to save
                          space and a <strong>Drawer</strong> on mobile.
                        </p>
                        <ComponentDemo title="Dropdown & Drawer Breadcrumbs">
                          <BreadcrumbResponsive />
                        </ComponentDemo>
                      </ComponentSection>
                    </div>
                    {/* Buttons */}
                    <div id="buttons">
                      <ComponentSection
                        title="Buttons"
                        description="Various button styles and states. Includes icon buttons, loading states, and more."
                      >
                        <p className="text-base text-muted-foreground">
                          Buttons should have a clear message and call to
                          action. <strong>1-3 words</strong> allowed to get
                          message across clearly.
                        </p>
                        <p className="text-base text-muted-foreground">
                          Buttons are used to trigger an action or event, such
                          as submitting a form, opening a dialog, canceling an
                          action, or performing a delete operation. They are
                          typically placed within forms, modals, cards, and
                          other interactive elements.
                        </p>
                        <p className="text-base text-muted-foreground">
                          Use <strong>title case</strong>, a convention for
                          titles of works where major words like nouns, verbs,
                          adjectives, and adverbs are capitalized, while minor
                          words like articles (a, an, the), short prepositions,
                          and most conjunctions are lowercased, unless they are
                          the first or last word of the title.
                        </p>

                        <Collapsible>
                          <CollapsibleTrigger className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800">
                            What is Title Case?
                          </CollapsibleTrigger>
                          <CollapsibleContent className="mt-2 text-sm text-muted-foreground [&_p]:leading-relaxed">
                            <h3 className="font-bold text-base mb-2">
                              General Title Case Rules
                            </h3>
                            <h4 className="text-base">
                              Capitalize the first word of the title
                            </h4>
                            <p className="text-base">
                              {' '}
                              (and any subtitle), regardless of whether it's a
                              minor word.{' '}
                            </p>
                            <h4 className="text-base">
                              Capitalize the last word
                            </h4>
                            <p className="text-base">
                              (and any subtitle), regardless of its part of
                              speech.
                            </p>
                            <h4 className="text-base">
                              Capitalize all major words.
                            </h4>
                            <p className="text-base">
                              {' '}
                              <ul className=" text-sm list-disc list-inside  mt-1 mb-2">
                                <li className="mb-1">
                                  <strong>Nouns</strong> (e.g., book, city)
                                </li>
                                <li className="mb-1">
                                  <strong>Pronouns</strong> (e.g., he, she)
                                </li>
                                <li className="mb-1">
                                  <strong>Verbs</strong> (e.g., run, write)
                                </li>
                                <li className="mb-1">
                                  <strong>Adjectives</strong> (e.g., loud,
                                  happy)
                                </li>
                                <li className="mb-1">
                                  <strong>Adverbs</strong> (e.g., quickly,
                                  quietly)
                                </li>
                                <li className="mb-1">
                                  <strong>Proper nouns</strong> (e.g., America,
                                  John)
                                </li>
                                <li className="mb-1">
                                  <strong>Certain conjunctions</strong> (e.g.,
                                  subordinating conjunctions like although,
                                  because)
                                </li>
                                <li className="mb-1">
                                  <strong>Long prepositions</strong> (typically
                                  four letters or more) (e.g., between, among,
                                  during)
                                </li>
                              </ul>
                            </p>
                            <h4 className="font-semibold text-base">
                              Lowercase Minor Words
                            </h4>
                            <ul className=" text-sm list-disc list-inside  mt-1 mb-2">
                              <li className="mb-1">Articles (a, an, the)</li>
                              <li className="mb-1">
                                Short prepositions (up to three or four letters,
                                depending on the style guide)
                              </li>
                              <li className="mb-1">
                                Coordinating conjunctions (and, but, or, for,
                                nor, yet, so)
                              </li>
                            </ul>
                            <h4 className="mb-1 text-base">
                              Handle hyphenated words
                            </h4>
                            <p className="mb-1 text-base">
                              by capitalizing the first part of the hyphenated
                              word, and the second part only if it is a major
                              word (e.g., Self-Report, Long-Term Solution).
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                        {/* Variants */}
                        <div id="button-variants" className="space-y-6">
                          <ComponentDemo title="Button Variants">
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                              <Button size="lg">This is Primary</Button>
                              <Button size="lg" variant="secondary">
                                Secondary Button
                              </Button>
                              <Button size="lg" variant="outline">
                                Tertiary is Outlined
                              </Button>
                              <Button size="lg" variant="link">
                                Link
                              </Button>
                            </div>
                            <h4 className="text-sm text-muted-foreground font-medium mb-4">
                              Additional Variants
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Button size="lg" disabled>
                                Disabled
                              </Button>
                              <Button size="lg" variant="ghost">
                                Ghost
                              </Button>
                              <Button size="lg" variant="outline">
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="w-4 h-4"
                                />
                                With Icon
                              </Button>
                              <Button size="icon" variant="outline">
                                <FontAwesomeIcon
                                  icon={faEye}
                                  className="w-4 h-4"
                                />
                              </Button>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <Button size="lg" variant="info">
                                Info for You
                              </Button>
                              <Button size="lg" variant="successful">
                                Successful CTA
                              </Button>
                              <Button size="lg" variant="warning">
                                Warning CTA
                              </Button>
                              <Button size="lg" variant="destructive">
                                Urgent CTA
                              </Button>
                            </div>
                          </ComponentDemo>
                        </div>

                        <div id="button-sizes" className="space-y-6">
                          <ComponentDemo title="Button Sizes">
                            <div className="flex flex-wrap items-center gap-3">
                              <Button size="sm" className="text-xs">
                                Small
                              </Button>
                              <Button size="default">Default</Button>
                              <Button size="lg">Large</Button>
                            </div>
                          </ComponentDemo>
                        </div>
                      </ComponentSection>
                    </div>
                    {/* Cards */}
                    <div id="cards">
                      <ComponentSection
                        title="Cards"
                        description="Flexible content containers"
                      >
                        <ComponentDemo title="Basic Card">
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                              <CardHeader>
                                <CardTitle>Card Title</CardTitle>
                                <CardDescription>
                                  Card description goes here.
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p>This is the main content.</p>
                              </CardContent>
                              <CardFooter>
                                <Button>Action</Button>
                              </CardFooter>
                            </Card>
                            <Card>
                              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                  Dashboard Card Title
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              </CardHeader>
                              <CardContent className="flex flex-col h-full">
                                <div className="flex flex-row mt-auto justify-between items-end">
                                  <div>
                                    <div className="text-2xl font-bold">1</div>
                                    <div className="flex items-end justify-between mt-1">
                                      <p className="text-xs text-muted-foreground mb-0">
                                        Subtitle
                                      </p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                  >
                                    Show Me
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </ComponentDemo>
                      </ComponentSection>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <SidebarRight sections={sections} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
