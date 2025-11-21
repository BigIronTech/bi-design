import { createFileRoute } from '@tanstack/react-router'
import { Bolt, CheckCircle, XCircle } from 'lucide-react'
import bigironLogo from '/bigiron.svg'
import sullivanLogo from '/sullivan-logo.svg'
import bigironLogoBW from '/bigiron-bw.svg'
import bigironLogoDark from '/bigiron-dark.svg'
import sullivanLogoBW from '/sullivan-logo-bw.svg'
import sullivanLogoDark from '/sullivan-logo-reverse.svg'
import sullivanLogoMark from '/sullivan-logo-mark.svg'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/standards')({
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
                  <BreadcrumbPage>Standards</BreadcrumbPage>
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
          <div className="w-full overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:py-8 md:px-0 max-w-7xl mx-auto">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                      Brand Standards
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Logo guidelines, brand colors, and usage standards for our
                      brand families
                    </p>
                  </div>

                  <Tabs defaultValue="bigiron" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bigiron" className="cursor-pointer">
                        BigIron
                      </TabsTrigger>
                      <TabsTrigger value="sullivan" className="cursor-pointer">
                        Sullivan
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bigiron" className="space-y-8">
                      <ComponentSection
                        title="Logo & Mark"
                        description="Design System brand identity and logo usage guidelines"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Primary Logo */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">
                              Primary Logo
                            </h4>
                            <div className="border rounded-lg p-8 bg-background flex items-center justify-center dark:bg-white">
                              <div className="flex items-center space-x-2">
                                <div className="text-3xl font-bold text-foreground">
                                  <img
                                    src={bigironLogo}
                                    alt="BigIron Logo"
                                    className="w-32 h-12"
                                  />
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Use this version on light backgrounds with
                              sufficient contrast.
                            </p>
                          </div>

                          {/* Logo Mark Only */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">Logo Mark</h4>
                            <div className="border rounded-lg p-8 bg-background flex items-center justify-center">
                              <Bolt className="h-12 w-12 text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Standalone mark for small spaces and favicons.
                            </p>
                          </div>

                          {/* Dark Background Version */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">
                              Dark Background
                            </h4>
                            <div className="border rounded-lg p-8 bg-foreground dark:bg-background flex items-center justify-center">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="text-3xl font-bold text-white">
                                    <img
                                      src={bigironLogoDark}
                                      alt="BigIron Logo"
                                      className="w-32 h-12"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Use this version on dark backgrounds.
                            </p>
                          </div>

                          {/* Monochrome Version */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">Monochrome</h4>
                            <div className="border rounded-lg p-8 bg-background flex items-center justify-center dark:bg-white">
                              <div className="flex items-center space-x-3">
                                <div>
                                  <div className="text-3xl font-bold text-gray-800">
                                    <img
                                      src={bigironLogoBW}
                                      alt="BigIron Logo"
                                      className="w-32 h-12"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Single color version for special applications.
                            </p>
                          </div>
                        </div>
                      </ComponentSection>

                      <ComponentSection
                        title="Brand Colors"
                        description="Primary brand color palette"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            {
                              name: 'Brand Gold',
                              class: 'bg-primary text-primary-foreground',
                              hex: '#ffcf01',
                              usage: 'Primary brand color',
                            },
                            {
                              name: 'Brand White',
                              class:
                                'bg-white text-foreground dark:text-background border border-black/20',
                              hex: '#ffffff',
                              usage: 'Secondary brand color',
                            },
                            {
                              name: 'Brand Dark',
                              class:
                                'bg-brand-bi-secondary text-white dark:text-foreground dark:bg-black border border-white/40',
                              hex: '#0C1218',
                              usage: 'Text and dark elements',
                            },
                          ].map((color) => (
                            <div key={color.name} className="space-y-3">
                              <div
                                className={`h-24 rounded-lg ${color.class} flex items-center justify-center shadow-lg`}
                              >
                                <span className="font-medium text-sm">
                                  {color.name}
                                </span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">{color.name}</p>
                                <p className="text-muted-foreground font-mono text-xs">
                                  {color.hex}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {color.usage}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ComponentSection>
                    </TabsContent>

                    <TabsContent value="sullivan" className="space-y-8">
                      <ComponentSection
                        title="Logo & Mark"
                        description="Sullivan brand identity and logo usage guidelines"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Primary Logo */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">
                              Primary Logo
                            </h4>
                            <div className="border rounded-lg p-4 bg-background dark:bg-foreground flex items-center justify-center">
                              <div className="flex items-center space-x-3 ">
                                <img
                                  src={sullivanLogo}
                                  alt="Sullivan Auctioneers Logo"
                                  className="w-48 h-20"
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Use this version on light backgrounds with
                              sufficient contrast.
                            </p>
                          </div>

                          {/* Logo Mark Only */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">Logo Mark</h4>
                            <div className="border rounded-lg p-4 bg-background dark:bg-foreground flex items-center justify-center">
                              <img
                                src={sullivanLogoMark}
                                alt="Sullivan Auctioneers Logo Mark"
                                className="w-20 h-20"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Standalone mark for small spaces and favicons.
                            </p>
                          </div>

                          {/* Dark Background Version */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">
                              Dark Background
                            </h4>
                            <div className="border rounded-lg p-8 bg-gray-900 flex items-center justify-center">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={sullivanLogoDark}
                                  alt="Sullivan Logo Black and White"
                                  className="w-48 h-20"
                                />
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Use this version on dark backgrounds.
                            </p>
                          </div>

                          {/* Monochrome Version */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-medium">Monochrome</h4>
                            <div className="border rounded-lg p-8 bg-background dark:bg-foreground flex items-center justify-center">
                              <img
                                src={sullivanLogoBW}
                                alt="Sullivan Logo Black and White"
                                className="w-48 h-20"
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Single color version for special applications.
                            </p>
                          </div>
                        </div>
                      </ComponentSection>

                      <ComponentSection
                        title="Brand Colors"
                        description="Sullivan brand color palette"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            {
                              name: 'Brand Blue',
                              class: 'bg-brand-sul-primary text-white',
                              hex: '#12284b',
                              usage: 'Primary brand color',
                            },
                            {
                              name: 'Brand Gold',
                              class:
                                'bg-brand-sul-secondary text-primary-foreground',
                              hex: '#ffcf06',
                              usage: 'Secondary brand color',
                            },
                            {
                              name: 'Brand Dark',
                              class:
                                'bg-brand-bi-secondary dark:bg-background text-white border border-white/40',
                              hex: '#000000',
                              usage: 'Text and dark elements',
                            },
                            {
                              name: 'Complimentary Gray',
                              class:
                                'bg-brand-sul-complimentary-gray text-white',
                              hex: '#636466',
                              usage: 'Complimentary brand color',
                            },
                            {
                              name: 'Complimentary Light Gray',
                              class:
                                'bg-brand-sul-complimentary-lt-gray text-foreground dark:text-background',
                              hex: '#d9d8d6',
                              usage: 'Complimentary brand color',
                            },
                            {
                              name: 'Complimentary Blue',
                              class:
                                'bg-brand-sul-complimentary-blue text-white',
                              hex: '#6482a7',
                              usage: 'Complimentary brand color',
                            },
                          ].map((color) => (
                            <div key={color.name} className="space-y-3">
                              <div
                                className={`h-24 rounded-lg ${color.class} flex items-center justify-center shadow-lg`}
                              >
                                <span className="font-medium text-sm">
                                  {color.name}
                                </span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p className="font-medium">{color.name}</p>
                                <p className="text-muted-foreground font-mono text-xs">
                                  {color.hex}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {color.usage}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ComponentSection>
                    </TabsContent>

                    {/* Shared Guidelines */}
                    <ComponentSection
                      title="Logo Usage Guidelines"
                      description="When and how to use each brand"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Do's</AlertTitle>
                          <AlertDescription className="space-y-2">
                            <ul className="text-sm space-y-1 text-normal">
                              <li>• Maintain clear space around the logo</li>
                              <li>• Use approved color variations</li>
                              <li>• Scale proportionally</li>
                              <li>• Ensure sufficient contrast</li>
                              <li>• Use high-resolution files</li>
                            </ul>
                          </AlertDescription>
                        </Alert>

                        <Alert variant="destructive">
                          <XCircle className="h-4 w-4" />
                          <AlertTitle>Don'ts</AlertTitle>
                          <AlertDescription className="space-y-2">
                            <ul className="text-sm space-y-1">
                              <li>• Don't stretch or distort the logo</li>
                              <li>• Don't use unauthorized colors</li>
                              <li>• Don't place on busy backgrounds</li>
                              <li>• Don't rotate or modify elements</li>
                              <li>• Don't use low-resolution files</li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </ComponentSection>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
