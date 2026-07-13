import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SalesForecastingDashboard from '@/components/sales-forecasting-dashboard'
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

export const Route = createFileRoute('/sales-forecasting')({
  component: SalesForecastingPage,
})

// Wrapper component to handle sidebar state
function SalesForecastingWrapper({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar()

  // Auto-close sidebar on mount, matching the other dashboard pages
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
                <BreadcrumbLink href="#" onClick={handleBreadcrumbClick}>
                  Dashboards
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Sales Forecasting</BreadcrumbPage>
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
      {children}
    </SidebarInset>
  )
}

function SalesForecastingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SalesForecastingWrapper>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-[#eceae5]">
          <SalesForecastingDashboard />
        </main>
      </SalesForecastingWrapper>
    </SidebarProvider>
  )
}
