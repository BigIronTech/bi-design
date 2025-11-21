import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Blocks,
  CirclePlay,
  Fingerprint,
  Image,
  Layers,
  ListTodo,
  Medal,
  MicVocal,
  SquareMousePointer,
  Target,
  Type,
  User,
} from 'lucide-react'
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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/')({
  component: App,
})

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
                  <BreadcrumbLink asChild>
                    <Link to="/">Getting Started</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
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
                <div className="space-y-8">
                  <div className="text-center space-y-4 py-12">
                    <h1 className="text-4xl font-bold tracking-tight">
                      Welcome to our Digital Design System
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      A comprehensive collection of reusable components,
                      patterns, and guidelines built with shadcn/ui and Tailwind
                      CSS.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6">
                    <Card className="transition-shadow">
                      <CardHeader>
                        <CirclePlay className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Introduction</CardTitle>
                        <CardDescription>
                          What to expect from our Design System: reusable
                          components, clear guidelines, and scalable patterns
                          for building consistent, accessible user interfaces.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/identity">
                        <CardHeader>
                          <Fingerprint className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Brand Identity</CardTitle>
                          <CardDescription>
                            Understanding our brand's core principles, values,
                            and identity guidelines that define our brand
                            families.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/standards">
                        <CardHeader>
                          <Medal className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Brand Standards</CardTitle>
                          <CardDescription>
                            Logo guidelines, brand colors, and usage standards
                            for our brand families.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/personas">
                        <CardHeader>
                          <User className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Personas</CardTitle>
                          <CardDescription>
                            A description of our key user personas, their goals,
                            frustrations, and backgrounds. These archetypes help
                            guide design decisions and ensure our solutions
                            address real user needs.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/target">
                        <CardHeader>
                          <Target className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Target Audience</CardTitle>
                          <CardDescription>
                            Consumers most likely to benefit from our products
                            and services include demographics, behaviors, and
                            needs.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/voice-and-tone">
                        <CardHeader>
                          <MicVocal className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Voice & Tone</CardTitle>
                          <CardDescription>
                            Our brand's personality and communication style,
                            including how we speak to users, the language we
                            use, and the emotional tone we convey in all
                            communications.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/voice-and-tone">
                        <CardHeader>
                          <Image className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Imagery</CardTitle>
                          <CardDescription>
                            Acceptable imagery includes high-quality, relevant
                            photos, illustrations, and icons that align with our
                            brand's visual language.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/typography">
                        <CardHeader>
                          <Type className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Typography</CardTitle>
                          <CardDescription>
                            Font families, sizes, weights, and styles that
                            ensure readable and accessible text across all
                            platforms and devices.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/figma">
                        <CardHeader>
                          <SquareMousePointer className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Figma</CardTitle>
                          <CardDescription>
                            Collection of Figma resources, templates, and
                            components for designing with our brand and design
                            system.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/components">
                        <CardHeader>
                          <Blocks className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Components</CardTitle>
                          <CardDescription>
                            Set of reusable UI components built with shadcn/ui
                            and Tailwind CSS, designed for consistency and
                            accessibility.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/forms">
                        <CardHeader>
                          <ListTodo className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Forms</CardTitle>
                          <CardDescription>
                            Stylized form elements including inputs, selects,
                            checkboxes, radios, switches, and textareas for
                            collecting user data.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow">
                      <Link to="/patterns">
                        <CardHeader>
                          <Layers className="h-8 w-8 text-primary mb-2" />
                          <CardTitle>Patterns</CardTitle>
                          <CardDescription>
                            Examples include navigation bars, sidebars, modal
                            dialogs, drawers, tabs, accordions, and grid
                            layouts.
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
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
