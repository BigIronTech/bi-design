import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import FindMySalesRep from '@/components/find-a-rep'
import BigIronHeader from '@/components/bigiron-header'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { ButtonToggle } from '@/components/button-toggle'

export const Route = createFileRoute('/find-a-rep')({
  component: FindMySalesRepPage,
})

function FindMySalesRepWrapper({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar()

  React.useEffect(() => {
    sidebar.setOpen(false)
  }, [])

  const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    sidebar.setOpen(true)
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="#"
                  onClick={handleBreadcrumbClick}
                  className="cursor-pointer"
                >
                  Dashboards
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Find My Sales Rep</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto h-5 flex items-center gap-2 px-3">
          <div className="md:block text-sm text-muted-foreground">
            <span className="px-2">v1.0.0</span>
          </div>
          <Separator orientation="vertical" />
          <ButtonToggle />
        </div>
      </header>

      {/* BigIron.com header preview */}
      <BigIronHeader />

      {children}
    </SidebarInset>
  )
}

function FindMySalesRepPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <FindMySalesRepWrapper>
        <main className="flex flex-1 flex-col gap-4 p-0 py-6 lg:gap-6 lg:p-6 lg:pb-8 bg-background w-full max-w-[1500px] mx-auto">
          <FindMySalesRep />
        </main>
      </FindMySalesRepWrapper>
    </SidebarProvider>
  )
}
