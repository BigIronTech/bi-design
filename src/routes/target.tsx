import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle,
  Monitor,
  Quote,
  Smartphone,
  Tablet,
  Users,
  XCircle,
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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/target')({
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

const targets = [
  {
    name: 'Chad R. Young',
    role: 'Land Buyer',
    age: 28,
    experience: 'Beginner',
    mobile: true,
    computer: true,
    tablet: true,
    quote:
      'Land is the key to success. I’m not just buying acres— I’m building a future, one field at a time.',
    goals: [
      'Both purchasing and renting more land',
      'Diversifying their agricultural products (e.g., crops, livestock, etc.)',
      'Growing the farming business and invest profits back into the farm ',
    ],
    frustrations: [
      'High operating costs',
      'Uncertain markets',
      'Labor shortages',
    ],
    bio: 'Farmers run their own businesses, and many of them, like any other industry, have their eyes on the horizon. The Expansionist is looking to the operation’s future and wants to expand the farming operation, primarily by obtaining more land.',
    trait: 'Expansionist',
    avatar: '/Farmer-1.jpg',
  },
  {
    name: 'Fred A. Wilkens',
    role: 'The Right Equipment',
    age: 38,
    experience: 'Intermediate',
    mobile: true,
    computer: true,
    tablet: true,
    quote:
      'It’s not just land, it’s an investment. Every acre should pay for itself and then some.',
    goals: [
      'Routinely evaluate the market for the prices of agricultural commodities',
      'Assess opportunity costs of various inputs',
      'Monitor inputs and outputs for measuring the technical efficiency of the farming operation',
    ],
    frustrations: [
      'Lack of data transparency',
      'Unpredictable external factors and high/rising costs',
      'Weather and volatile markets.',
    ],
    bio: 'The bottom line is the bottom line. This farmer makes vital decisions based on what will make the most profit and return on investment. Find the products and services that are going to improve their ROI and you’ll have a customer for life.',
    trait: 'ROI Focused',
    avatar: '/Farmer-2.jpg',
  },
  {
    name: 'Roy B. Biggins',
    role: 'Equipment & Cattle',
    age: 52,
    experience: 'Advanced',
    mobile: true,
    computer: true,
    tablet: false,
    quote:
      'I stick with what works. My dad ran green, I run green. I need equipment I trust, not just something new.',
    goals: [
      'The personal relationship is as important as the product itself',
      'Brand loyalty benefits the farm',
      'Continued business with the same company can provide cost savings and other benefits',
    ],
    frustrations: [
      'Perceived indifference of large corporations to their traditional loyalty',
      'New technology in their equipment',
      'Marketing through social media channels',
    ],
    bio: 'Once you win over a Brand Loyalist, you’ve got their business for the long haul. But, unfortunately, that also means that if they’re doing business with a competitor, getting them to switch to your product can be tricky.',
    trait: 'Brand Loyalist',
    avatar: '/Farmer-3.jpg',
  },
  {
    name: 'Bob W. Robertson',
    role: 'Frugal Farmer',
    age: 60,
    experience: 'Expert',
    mobile: true,
    computer: true,
    tablet: false,
    quote:
      'I don’t spend a dollar unless I know it’ll save me two. Fancy doesn’t grow crops— smart choices do.',
    goals: [
      'They look for good deals on equipment, seed, crop protection, etc.',
      'Will keep an eye out to cut unnecessary costs',
      'If possible, they’ll take a do-it-yourself approach to the bulk of their farm tasks',
    ],
    frustrations: [
      'Technology',
      'Cost of structures designed for large-scale operations',
      'Rising prices for seeds, feed, fertilizers, and fuel',
    ],
    bio: 'Frugal farmers are more likely to use generic inputs than look to see prices online. They are likely not early adopters of technology or anything that requires a long-term payback. They are also more likely to be hands-on in farm decisions or activities.',
    trait: 'Frugal',
    avatar: '/Farmer-4.jpg',
  },
]

const getTraitVariant = (trait: string) => {
  switch (trait) {
    case 'Frugal':
      return 'destructive'
    case 'Brand Loyalist':
      return 'default'
    case 'ROI Focused':
      return 'outline'
    case 'Expansionist':
      return 'secondary'
    default:
      return 'outline'
  }
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
                  <BreadcrumbPage>Target</BreadcrumbPage>
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
          <div className="x-full overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-8xl mx-auto">
            <div className="bg-background mb-8">
              <div className="text-foreground leading-relaxed text-base">
                <div className="space-y-8 p-4">
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
                        Target Audience Personas
                      </h1>
                      <p className="text-muted-foreground mt-2">
                        Key user archetypes that guide our design decisions
                      </p>
                    </div>

                    <div className="space-y-8">
                      <ComponentSection title=" " description="">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 py-0">
                          {targets.map((persona, index) => (
                            <Card
                              key={index}
                              className="overflow-hidden h-full pt-0"
                            >
                              <CardHeader className="pb-0 px-0">
                                <div className="flex flex-col items-center text-center space-y-3">
                                  <div
                                    className={`w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`}
                                  >
                                    <img
                                      src={persona.avatar}
                                      alt={persona.name}
                                      style={{ objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div>
                                    <CardTitle className="text-base leading-tight">
                                      {persona.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                      {persona.role}
                                    </CardDescription>
                                    <div className="flex justify-center mt-2">
                                      <Badge
                                        variant={getTraitVariant(persona.trait)}
                                        className="text-xs"
                                      >
                                        {persona.trait}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3 text-xs">
                                <div className="space-y-1">
                                  <div className="space-y-4 mb-4">
                                    {/* Quote Bubble */}
                                    <div className="relative bg-sky-500 p-2 rounded-2xl space-y-0 text-white shadow-lg">
                                      <div className="absolute top-2 left-2 text-3xl opacity-30 rotate-180">
                                        <Quote className="h-6 w-6" />
                                      </div>
                                      <div className="pl-7 pr-0">
                                        <p className="text-md font-medium quote leading-tight mb-4">
                                          {persona.quote}
                                        </p>
                                      </div>
                                      <div className="absolute bottom-2 right-2 text-3xl opacity-30">
                                        <Quote className="h-6 w-6" />
                                      </div>
                                      {/* Speech bubble tail */}
                                      <div className="absolute -top-2 left-8 w-4 h-4 bg-sky-500 transform rotate-45"></div>
                                    </div>
                                  </div>
                                  <p className="text-lg leading-relaxed">
                                    <strong>Age:</strong> {persona.age}
                                  </p>
                                  <p className="text-lg leading-relaxed">
                                    <strong>Sex:</strong> Male
                                  </p>
                                  <p className="text-lg leading-relaxed">
                                    <strong>Experience:</strong>{' '}
                                    {persona.experience}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground leading-relaxed text-lg">
                                    {persona.bio}
                                  </p>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-bold text-base dark:text-foreground text-gray-700 mb-4 flex items-center gap-1">
                                      Key Points / Goals
                                    </h5>
                                    <ul className="space-y-1 text-xl">
                                      {persona.goals
                                        .slice(0, 3)
                                        .map((goal, goalIndex) => (
                                          <li
                                            key={goalIndex}
                                            className="flex text-lg items-start gap-2 mb-2"
                                          >
                                            <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                                            <span className="text-sm leading-tight italic">
                                              {goal}
                                            </span>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-lg text-red-700 mb-2 flex items-center gap-1">
                                      Frustrations
                                    </h5>
                                    <ul className="space-y-1">
                                      {persona.frustrations
                                        .slice(0, 3)
                                        .map(
                                          (frustration, frustrationIndex) => (
                                            <li
                                              key={frustrationIndex}
                                              className="flex items-start gap-2"
                                            >
                                              <XCircle className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
                                              <span className="text-sm leading-tight italic">
                                                {frustration}
                                              </span>
                                            </li>
                                          ),
                                        )}
                                    </ul>
                                  </div>
                                  <hr className="my-4" />
                                  <h5 className="font-medium text-xs text-gray-700 dark:text-gray-400 mb-1 flex items-center gap-1">
                                    <Smartphone className="h-3 w-3" />
                                    Preferred Devices
                                  </h5>
                                  <div className="flex items-end gap-1">
                                    {persona.mobile ? (
                                      <Smartphone className="h-6 w-6 text-black  dark:text-foreground mt-1 flex-shrink-0  stroke-1" />
                                    ) : (
                                      <Smartphone className="h-6 w-6 text-gray-300 mt-1 flex-shrink-0  stroke-1" />
                                    )}
                                    {persona.tablet ? (
                                      <Tablet className="h-8 w-8 text-black dark:text-foreground kmt-1 flex-shrink-0  stroke-1" />
                                    ) : (
                                      <Tablet className="h-8 w-8 text-gray-300 dark:text-gray-700 mt-1 flex-shrink-0  stroke-1" />
                                    )}
                                    {persona.computer ? (
                                      <Monitor className="h-9 w-9 text-black dark:text-foreground mt-1 flex-shrink-0 stroke-1" />
                                    ) : (
                                      <Monitor className="h-9 w-9 text-gray-500 mt-1 flex-shrink-0 stroke-1" />
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ComponentSection>

                      <ComponentSection
                        title="Persona Usage Guidelines"
                        description="When and how personas should be used in the design process"
                      >
                        <Alert>
                          <Users className="h-4 w-4" />
                          <AlertTitle>Design with Personas in Mind</AlertTitle>
                          <AlertDescription>
                            These personas represent our core user base.
                            Reference them when making design decisions to
                            ensure we're building solutions that meet real user
                            needs and pain points.
                          </AlertDescription>
                        </Alert>
                      </ComponentSection>
                    </div>
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
