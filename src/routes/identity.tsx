import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle,
  Eye,
  HandHeart,
  HandPlatter,
  HeartHandshake,
  Info,
  Scale,
  Shield,
  Star,
  View,
} from 'lucide-react'
import bigironLogo from '/bigiron.svg'
import sullivanLogo from '/sullivan-logo.svg'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/identity')({
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
                  <BreadcrumbLink href="#">Brand</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Identity</BreadcrumbPage>
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
          <div className="overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                      Brand Identity
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Core brand principles, values, and identity guidelines
                      that define our brand families
                    </p>
                  </div>
                  {/* Brand Philosophy */}
                  <ComponentSection
                    title="Brand Philosophy"
                    description="The foundation of our brand identity"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-500" />
                            Vision
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            To be the most recognized Customer-Focused Equipment
                            and Real Estate platform.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-500" />
                            Mission
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">
                            To provide a quality unmatched experience for
                            sellers, buyers, our team and all those we serve.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </ComponentSection>

                  {/* Core Values */}
                  <ComponentSection
                    title="Core Values"
                    description="The principles that guide our brand"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <HandHeart className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Honesty</h4>
                          <p className="text-sm text-muted-foreground">
                            Moral principles of truthfulness and transparency in
                            all our interactions.
                          </p>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <HandPlatter className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground " />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            Customer Service
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Helping customers is our top priority. We listen,
                            understand their needs, and deliver exceptional
                            service at every touchpoint.
                          </p>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <Star className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Quality</h4>
                          <p className="text-sm text-muted-foreground">
                            High standards and attention to detail ensure our
                            products and services exceed expectations.
                          </p>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <Scale className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Integrity</h4>
                          <p className="text-sm text-muted-foreground">
                            Standards of honesty and strong moral principles
                            guide our actions and decisions.
                          </p>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <HeartHandshake className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">Respect</h4>
                          <p className="text-sm text-muted-foreground">
                            Respect for diverse perspectives and experiences
                            drives our inclusive design process and outcomes.
                          </p>
                        </div>
                      </div>
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground">
                          <View className="h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            Transparency
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Conduct business ethically and transparently,
                            building trust with our users and stakeholders.
                          </p>
                        </div>
                      </div>{' '}
                    </div>
                  </ComponentSection>

                  {/* Brand Architecture */}
                  <ComponentSection
                    title="Brand Architecture"
                    description="How our brand families are organized"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="border rounded-lg p-6 bg-background">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">
                            Master Brand
                          </h4>
                          <Badge variant="outline">Single & Multi-Day</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <div>
                            <div className="text-4xl font-bold text-black p-4 rounded-lg dark:bg-foreground">
                              <img
                                src={bigironLogo}
                                alt="BigIron Logo"
                                className="w-48 h-20"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          The foundational brand that represents our core design
                          system platform and methodology.
                        </p>
                      </div>

                      <div className="border rounded-lg p-6 bg-background">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold">
                            Secondary Brand
                          </h4>
                          <Badge variant="secondary">Live Auctions</Badge>
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                          <div>
                            <div className="text-4xl font-bold text-black p-4 rounded-lg dark:bg-foreground">
                              <img
                                src={sullivanLogo}
                                alt="Sullivan Auctioneers Logo"
                                className="w-48 h-20"
                              />
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Among the nation's leading Real Estate and Farm
                          Machinery Auctioneers, with over 40 years of
                          experience.
                        </p>
                      </div>
                    </div>
                  </ComponentSection>

                  <ComponentSection
                    title="Usage Guidelines"
                    description="When and how to use each brand"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Brand Consistency</AlertTitle>
                        <AlertDescription>
                          Always maintain consistent application of brand
                          elements across all touchpoints. Each brand should be
                          used in its appropriate context and never mixed with
                          elements from other brands.
                        </AlertDescription>
                      </Alert>

                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Brand Hierarchy</AlertTitle>
                        <AlertDescription>
                          The master brand (Design System) takes precedence in
                          general communications. Sub-brands should be used for
                          specific product communications and always include a
                          reference to the master brand.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </ComponentSection>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
