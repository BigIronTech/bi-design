import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/typography')({
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
                  <BreadcrumbLink href="#">Visual Design</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Typography</BreadcrumbPage>
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
                      Typography
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Consistent text sizing and hierarchy are crucial for
                      creating a clear and organized user interface. By
                      establishing a well-defined typography scale, we can
                      ensure that headings, subheadings, body text, and other
                      textual elements are visually distinct and easy to read.
                      This not only enhances the overall aesthetic of the
                      application but also improves usability by guiding users'
                      attention and helping them quickly identify important
                      information. A consistent typography scale contributes to
                      a cohesive design language, reinforcing brand identity and
                      creating a more professional and polished appearance.
                    </p>
                  </div>
                  <Separator orientation="horizontal" className="my-6" />
                  {/* Typography */}
                  <div className="space-y-8">
                    <ComponentSection title="" description="">
                      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-3">
                              Font Family
                            </h2>
                            <p className="text-base my-3 ">
                              <strong>Plus Jakarta Sans</strong> is a modern,
                              clean, and highly legible sans-serif typeface. It
                              offers excellent readability across various screen
                              sizes and resolutions, making it ideal for digital
                              interfaces. The font's versatility allows it to be
                              used for both headings and body text, ensuring a
                              consistent typographic hierarchy throughout the
                              application.
                            </p>
                            <p>
                              <span className="font-bold">
                                Loading multiple weights and fonts from Google
                                can slow down the initial page load time.
                              </span>{' '}
                              To mitigate this, we only load one font family and
                              add others as fallbacks to improve perceived
                              performance.{' '}
                            </p>
                            <p
                              className={cn(
                                'text-md text-foreground pt-4 pb-0 mb-0',
                              )}
                            >
                              Fonts are shown in the following order (depending
                              on which fonts they have loaded on their machine):
                            </p>
                            <code className="text-sm text-muted-foreground mb-4">
                              font-sans (Plus Jakarta Sans, -apple-system,
                              BlinkMacSystemFont, 'Montserrat', 'Segoe UI',
                              'Roboto', 'Oxygen', 'Helvetica Neue', sans-serif)
                            </code>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h1 className="text-4xl font-bold tracking-tight">
                              Heading 1
                            </h1>
                            <code className="text-sm text-muted-foreground">
                              text-4xl font-bold tracking-tight — 36/40px
                            </code>
                          </div>
                          <div>
                            <h2 className="text-3xl font-semibold tracking-tight">
                              Heading 2
                            </h2>
                            <code className="text-sm text-muted-foreground">
                              text-3xl font-semibold tracking-tight — 30/36px
                            </code>
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold tracking-tight">
                              Heading 3
                            </h3>
                            <code className="text-sm text-muted-foreground">
                              text-2xl font-semibold tracking-tight — 24/32px
                            </code>
                          </div>
                          <div>
                            <h4 className="text-xl font-semibold tracking-tight">
                              Heading 4
                            </h4>
                            <code className="text-sm text-muted-foreground">
                              text-xl font-semibold tracking-tight — 20/28px
                            </code>
                          </div>
                          <div>
                            <p className="text-base">
                              Body text - The quick brown fox jumps over the
                              lazy dog.
                            </p>
                            <code className="text-sm text-muted-foreground">
                              text-base — 16/24px
                            </code>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Small text - Additional information and captions.
                            </p>
                            <code className="text-sm text-muted-foreground">
                              text-sm text-muted-foreground — 14/21px
                            </code>
                          </div>
                        </div>
                      </div>
                    </ComponentSection>
                    <Alert>
                      <Users className="h-6 w-6" />
                      <AlertTitle className="text-lg/5 font-medium mb-3">
                        Design with cleanliness and simplicity in mind
                      </AlertTitle>
                      <AlertDescription>
                        <p className="text-base mb-3">
                          Additionally, Plus Jakarta Sans has a contemporary
                          aesthetic that aligns well with modern design
                          principles, helping to convey a sense of
                          professionalism and trustworthiness in the user
                          interface. It has humanist proportions (less strictly
                          geometric), open counters, softer terminals, more
                          modulation and subtle calligraphic influence for{' '}
                          <strong>improved legibility</strong>.
                        </p>
                        <p>
                          Slightly lower or more moderate x-height with wider
                          letter spacing and proportions{' '}
                          <strong>
                            optimized for longer reading and UI clarity.
                          </strong>
                        </p>
                      </AlertDescription>
                    </Alert>
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
