import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
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
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/personas')({
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
                  <BreadcrumbLink href="#">Audience</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Personas</BreadcrumbPage>
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
          <div className="overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-8xl mx-auto">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                        User Personas
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Key user archetypes that guide our design decisions
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`relative w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/expansionist.jpg"
                                alt="The Expansionist"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4">
                                3<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                The Expansionist
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              Farmers run their own businesses, and many of
                              them, like any other industry, have their eyes on
                              the horizon. The Expansionist is looking to the
                              operation’s future and wants to expand the farming
                              operation, primarily by obtaining more land. They
                              invest in long-term planning, equipment upgrades,
                              and workforce development to scale production
                              efficiently. This approach often involves securing
                              financing, negotiating land purchases or leases,
                              and adopting conservation practices that increase
                              soil health and productivity over time.
                              Expansionists also monitor market trends and
                              diversify crops or enterprises to spread risk and
                              capitalize on new opportunities.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some of the key things an Expansionist
                              believes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>Both purchasing and renting more land</li>
                              <li>
                                Diversifying their agricultural products (e.g.,
                                crops, livestock, etc.)
                              </li>
                              <li>
                                Growing the farming business and invest profits
                                back into the farm
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/brand-loyalist.jpg"
                                alt="The Brand Loyalist"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-lg -mt-4">
                                10<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                The Brand Loyalist
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              Never underestimate the power of a reputable
                              brand. That statement is especially true when
                              working with a Brand Loyalist. Once you win over a
                              Brand Loyalist, you’ve got their business for the
                              long haul. But, unfortunately, that also means
                              that if they’re doing business with a competitor,
                              getting them to switch to your product can be
                              tricky.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some of the key things a Brand Loyalist
                              believes:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>
                                The personal relationship is as important as the
                                product itself
                              </li>
                              <li>Brand loyalty benefits the farm </li>
                              <li>
                                Continued business with the same company can
                                provide cost savings and other benefits
                              </li>
                            </ul>
                            <p className="text-foreground leading-relaxed mt-2 text-lg">
                              If your sales team is up for a challenge, go after
                              the Brand Loyalist and see if you can convince
                              them to switch over to your products. And know
                              that if you do win them over, they won’t be going
                              anywhere for a long time.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/roi.jpg"
                                alt="Numbers-Focused/ROI"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4">
                                14<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                Numbers-Focused/ROI
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              The bottom line is the bottom line. This farmer
                              makes vital decisions based on what will make the
                              most profit and return on investment.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some examples of the Numbers-Focused
                              Farmer’s common day-to-day activities:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>
                                Routinely evaluate the market for the prices of
                                agricultural commodities
                              </li>
                              <li>Assess opportunity costs</li>
                              <li>
                                Monitor inputs and outputs for measuring the
                                technical efficiency of the farm
                              </li>
                              <li>
                                Analyzing and reviewing their financial data
                              </li>
                            </ul>
                            <p className="text-foreground leading-relaxed text-lg">
                              Marketing and selling to a Numbers-Focused Farmer
                              is simple and straightforward. Find the products
                              and services that are going to improve their ROI,
                              and hit that message home with the numbers to back
                              you up.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/sustainable.jpg"
                                alt="The Sustainable Farmer"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4">
                                23<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                The Sustainable Farmer
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              The Sustainable Farmer looks to the land. A
                              Sustainable Farmer is driven by the desire to
                              reduce environmental damage and keep the land in
                              optimal condition. They prioritize soil health,
                              water conservation, and biodiversity through
                              practices like cover cropping, reduced tillage,
                              integrated pest management, and rotational
                              grazing. Sustainable Farmers often balance
                              productivity with ecosystem services, investing in
                              renewable energy, habitat restoration, and carbon
                              sequestration practices. Their decisions consider
                              long-term resilience to climate variability,
                              community well-being, and often involve
                              certifications or participation in conservation
                              programs to verify and support sustainable
                              outcomes.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some of the things are Sustainable Farmer
                              might do:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>Maintaining crop diversity and rotations</li>
                              <li>Preventing soil erosion</li>
                              <li>Minimizing climate pollution</li>
                            </ul>
                            <p className="text-foreground leading-relaxed text-lg">
                              When it comes down to it, the Sustainable Farmer
                              believes in both their impact on the environment
                              and their own soil health and fertility. As a
                              result, they are more likely to use cover crops or
                              no-farming and use natural nutrients and
                              biological crop protection.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/agtech.jpg"
                                alt="The AgTech Leader"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4">
                                16<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                The AgTech Leader
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              They think often about the evolution of AgTech and
                              how it’s going to change the industry.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              This farmer isn’t just reacting to the changes in
                              technology — they’re on the front lines, focusing
                              on using every tool at their disposal to make
                              their operations more efficient and productive.
                              And with the right tech tools, they can save
                              themselves time and headaches in the process.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some of the things an AgTech Leader might
                              do:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>
                                They believe that adapting and innovating with
                                new technology is required for a farming
                                business to be successful
                              </li>
                              <li>
                                Technology has been a net positive for their
                                farming business and for the industry
                              </li>
                              <li>
                                Monitoring climate variables (precipitation
                                levels, soil temperature, etc.) improves
                                productivity and reduces costs
                              </li>
                            </ul>
                            <p className="text-foreground leading-relaxed text-lg">
                              If you have a high-tech product or need a market
                              of farmers that you know are innovative by nature,
                              this is the market to go after.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="overflow-hidden h-full pt-0 gap-2">
                        <CardHeader className="pb-3 px-0">
                          <div className="flex flex-col items-center text-center space-y-6">
                            <div
                              className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                            >
                              <img
                                src="/frugal.jpg"
                                alt="The Frugal Farmer"
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div className="relative">
                              <div className="absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4">
                                34<sub className="text-sm">%</sub>
                              </div>
                              <CardTitle className="text-sky-700 leading-tight">
                                The Frugal Farmer
                              </CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-xs">
                          <div className="space-y-2">
                            <p className="text-foreground leading-relaxed text-lg">
                              It’s no secret that being a farmer in today’s
                              economy is challenging. The Frugal Farmer is a
                              product of this environment.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              The Frugal Farmer is always looking for ways to
                              cut costs, whether that means finding cheaper
                              inputs, reducing labor costs, or optimizing their
                              operations to be more efficient. Every dollar
                              saved is a dollar that can be reinvested back into
                              the farm.
                            </p>
                            <p className="text-foreground leading-relaxed text-lg">
                              Here are some of the things a Frugal Farmer might
                              do:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-foreground text-base font-bold italic">
                              <li>
                                They look for good deals on equipment, seed,
                                crop protection, etc.
                              </li>
                              <li>
                                They will keep an eye out to cut unnecessary
                                costs
                              </li>
                              <li>
                                If possible, they’ll take a do-it-yourself
                                approach to the bulk of their farm tasks
                              </li>
                            </ul>
                            <p className="text-foreground leading-relaxed text-lg">
                              Frugal farmers are more likely to use generic
                              inputs than look to see prices online. They are
                              likely not early adopters of technology or
                              anything that requires a long-term payback. They
                              are also more likely to be hands-on in farm
                              decisions or activities.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <ComponentSection
                      title="Persona Usage Guidelines"
                      description="When and how personas should be used in the design process"
                    >
                      <Alert>
                        <Users className="h-4 w-4" />
                        <AlertTitle>Design with Personas in Mind</AlertTitle>
                        <AlertDescription>
                          These personas represent our core user base. Reference
                          them when making design decisions to ensure we're
                          building solutions that meet real user needs and pain
                          points.
                        </AlertDescription>
                      </Alert>
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
