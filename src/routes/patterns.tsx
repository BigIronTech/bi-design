import { createFileRoute } from '@tanstack/react-router'

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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
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

export const Route = createFileRoute('/patterns')({
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
                      Layout Patterns
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Common UI patterns and compositions. Use these patterns to
                      organize content, guide user flow, and provide consistent
                      interaction across your application. Each pattern should
                      be responsive, accessible, and easy to customize for
                      different use cases.
                    </p>
                  </div>

                  <Separator />

                  {/* Patterns */}
                  <div className="space-y-8">
                    <ComponentSection title=" " description=" ">
                      <ComponentDemo title="Header Pattern">
                        <div className="border rounded-lg p-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">
                                Page Title
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Page description
                              </p>
                            </div>
                            <Button>Primary Action</Button>
                          </div>
                        </div>
                      </ComponentDemo>

                      <ComponentDemo title="Stats Grid">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            {
                              label: 'Total Users',
                              value: '2,345',
                              change: '+12%',
                            },
                            {
                              label: 'Revenue',
                              value: '$45,678',
                              change: '+8%',
                            },
                            { label: 'Growth', value: '23%', change: '+3%' },
                          ].map((stat, index) => (
                            <Card key={index}>
                              <CardHeader className="pb-2">
                                <CardDescription>{stat.label}</CardDescription>
                                <CardTitle className="text-2xl">
                                  {stat.value}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <Badge variant="secondary">{stat.change}</Badge>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-900 mb-3">
                              Quick Stats
                            </h3>
                            <p className="text-3xl font-semibold text-gray-900 mb-1">
                              2,340
                            </p>
                            <p className="text-sm text-gray-500">Total items</p>
                          </div>
                          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-900 mb-3">
                              Recent Activity
                            </h3>
                            <p className="text-3xl font-semibold text-gray-900 mb-1">
                              12
                            </p>
                            <p className="text-sm text-gray-500">This week</p>
                          </div>
                          <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-medium text-gray-900 mb-3">
                              Performance
                            </h3>
                            <p className="text-3xl font-semibold text-gray-900 mb-1">
                              98%
                            </p>
                            <p className="text-sm text-gray-500">
                              Success rate
                            </p>
                          </div>
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
