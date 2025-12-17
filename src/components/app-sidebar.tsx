import * as React from 'react'
import { Link, useMatchRoute } from '@tanstack/react-router'

import { Bolt, CirclePlay, Code, Paintbrush, Users } from 'lucide-react'
import bigironLogo from '/bigiron.svg'
import bigironLogoDark from '/bigiron-dark.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'

// These are the pages that will appear in the sidebar navigation
const navItems = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    to: '/',
    icon: CirclePlay,
    subItems: [{ id: 'overview', label: 'Overview', to: '/' }],
  },
  {
    id: 'brand',
    label: 'Brand',
    to: '/identity',
    icon: Bolt,
    subItems: [
      { id: 'identity', label: 'Identity', to: '/identity' },
      { id: 'standards', label: 'Standards', to: '/standards' },
    ],
  },
  {
    id: 'audience',
    label: 'Audience',
    to: '/personas',
    icon: Users,
    subItems: [
      { id: 'personas', label: 'Personas', to: '/personas' },
      { id: 'target', label: 'Target', to: '/target' },
      { id: 'voice-and-tone', label: 'Voice & Tone', to: '/voice-and-tone' },
    ],
  },
  {
    id: 'visual-design',
    label: 'Visual Design',
    to: '/imagery',
    icon: Paintbrush,
    subItems: [
      { id: 'imagery', label: 'Imagery', to: '/imagery' },
      { id: 'typography', label: 'Typography', to: '/typography' },
      { id: 'figma', label: 'Figma', to: '/figma' },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    to: '/elements',
    icon: Code,
    subItems: [
      { id: 'elements', label: 'Elements', to: '/elements' },
      { id: 'forms', label: 'Forms', to: '/forms' },
      { id: 'patterns', label: 'Patterns', to: '/patterns' },
    ],
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    to: '/dashboard',
    icon: CirclePlay,
    subItems: [
      { id: 'auction-insights', label: 'Auction Cockpit', to: '/dashboard' },
    ],
  },
]

const ThemedImage = () => {
  return (
    <picture>
      <source srcSet={bigironLogoDark} media="(prefers-color-scheme: dark)" />
      <img src={bigironLogo} alt="My image" width={300} height={300} />
    </picture>
  )
}

export default ThemedImage

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const matchRoute = useMatchRoute()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex flex-row items-center gap-2 leading-none">
                  <div className="w-28 h-8 dark:text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.1"
                      viewBox="0 0 348 116.43"
                      fill="currentColor"
                    >
                      <path
                        className="fill-brand-bi-primary dark:fill-brand-bi-primary-dark"
                        d="M348,87.31h-19v-33.32c0-4.89-3.29-9.82-9.5-9.82-5.58,0-9.5,4.17-9.5,8.64v34.5h-19V29.31h18l.16,7.96s5.24-8.91,17.98-8.91c17.57,0,20.86,15.36,20.86,20.46v38.5h0ZM268.37,29.44h-22.73l-17.5,17.5v23.73l16.5,16.5h24.73l16.5-16.5.16-22.89s-17.66-18.34-17.66-18.34ZM257.04,72.74c-7.81,0-14.15-6.33-14.15-14.15s6.33-14.15,14.15-14.15,14.15,6.33,14.15,14.15-6.33,14.15-14.15,14.15ZM167,2.31v85h20.04V2.31h-20.04ZM193,29.81v57.5h19v-30.94c0-9.37,9.72-14.69,15.03-14.53,5.65-5.68,10.06-10.44,11.34-11.79-9.55-3.92-19.1-3.07-26.36,4.26v-4.6l-19,.1h0Z"
                      />
                      <path
                        className="fill-brand-bi-secondary dark:fill-brand-bi-secondary-dark"
                        d="M26.48,2.31c21.14,0,24.41,2.78,26.86,4.17,11.09,6.27,13.32,23.96,3.18,31.85-2.83,2.2-8.52,4.98-8.52,4.98,0,0,18.49,2.87,18.49,20.87s-18.2,23.13-25.99,23.13H0V2.31h26.48ZM19,36.31h15.5c5.31,0,9.61-4.5,9.55-9s-4.67-9-10.81-9h-14.24s0,18,0,18ZM19,71.31h18.94c6.37,0,10.53-4.75,10.27-9.5s-4.16-9.5-12.31-9.5h-16.9s0,19,0,19ZM72,29.31v58h18V29.31h-18ZM81.29,0c-5.83,0-10.56,4.73-10.56,10.56s4.73,10.56,10.56,10.56,10.56-4.73,10.56-10.56S87.13,0,81.29,0ZM158,83.81V28.31h-16v8c-14.06-14.89-37.58-10.76-44.78,8.72-4.63,12.54-2.63,28.71,8.27,37.29,10.06,7.93,25.17,8.25,34.51-1.01,1.73,13.48-5.89,19.11-15.47,19.11-13.58,0-19.27-7.38-19.27-7.38l-10.25,14.77s6.6,8.62,28.67,8.62c34.8,0,34.32-24.42,34.32-32.63h0ZM127.22,72.37c-8.02,0-14.53-6.5-14.53-14.53s6.5-14.53,14.53-14.53,14.53,6.5,14.53,14.53-6.5,14.53-14.53,14.53Z"
                      />
                    </svg>
                  </div>
                  <span className="text-muted-foreground text-3xl/relaxed pb-0.5 text-bold">
                    Design
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const IconComponent = item.icon

              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild className="hover:bg-transparent">
                    <div className="flex items-center text-xs font-medium uppercase tracking-wider">
                      <IconComponent className="w-3.5 h-3.5" />
                      {item.label}
                    </div>
                  </SidebarMenuButton>
                  {item.subItems.length ? (
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={!!matchRoute({ to: subItem.to })}
                          >
                            <Link
                              to={subItem.to}
                              className={
                                matchRoute({ to: subItem.to })
                                  ? 'active-link'
                                  : ''
                              }
                            >
                              {subItem.label}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
