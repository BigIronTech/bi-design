import * as React from 'react'
import { useEffect, useState } from 'react'

import { FileText } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

type Section = {
  id: string
  title: string
  level: number
}

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  sections: Array<Section>
}

export function SidebarRight({ sections, ...props }: SidebarRightProps) {
  const [activeSection, setActiveSection] = useState('introduction')

  // Simulate scroll behavior - in real app, use IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      // Add your scroll detection logic here
      // This would typically use IntersectionObserver API
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
  return (
    <Sidebar
      collapsible="none"
      className="sticky top-0 hidden h-svh border-l lg:flex"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border h-16 p-6">
        <div className="flex items-center gap-2 mb-4 pb-4">
          <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-400">
            On this page
          </h4>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        {/* Side Page Index */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="p-6">
              {/* Index List */}
              <nav className="space-y-1">
                {sections.map((section) => {
                  const isActive = activeSection === section.id
                  const isLevel2 = section.level === 2

                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`
                        w-full text-left cursor-pointer text-sm py-1 px-3 rounded-md transition-all duration-200
                        ${isLevel2 ? 'pl-6' : 'pl-3'}
                        ${
                          isActive
                            ? 'bg-sidebar-accent text-slate-700 dark:text-slate-400 font-medium'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{section.title}</span>
                      </div>
                    </button>
                  )
                })}
              </nav>

              {/* Footer Info */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any section to jump to it
                </p>
              </div>
            </div>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
