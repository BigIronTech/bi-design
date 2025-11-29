import { createFileRoute } from '@tanstack/react-router'
import React, { useState } from 'react'
import {
  ArrowUpDown,
  CalendarIcon,
  CheckCircle2,
  Clock,
  Eye,
  Gavel,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import type { DateRange } from 'react-day-picker'
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
  useSidebar,
} from '@/components/ui/sidebar'
import { ButtonToggle } from '@/components/button-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

export const Route = createFileRoute('/dashboards-old')({
  component: Dashboard,
})

// Helper function to get badge variant and custom classes based on status
const getStatusBadgeVariant = (
  status: string,
):
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'successful'
  | 'warning'
  | 'neutral'
  | 'information' => {
  switch (status) {
    case 'Needs Attention':
      return 'destructive'
    case 'Active':
    case 'Completed':
    case 'Published':
      return 'successful'
    case 'Pending':
    case 'Pending Payment':
    case 'Pending Pickup':
    case 'In Ops Hands':
      return 'warning'
    case 'Queued':
    case 'Submitted':
      return 'secondary'
    default:
      return 'outline'
  }
}

// Sortable table header component
interface SortableTableHeadProps {
  column: string
  label: string
  sortColumn: string | null
  sortDirection: 'asc' | 'desc'
  onSort: (column: string) => void
  className?: string
}

const SortableTableHead = ({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const isActive = sortColumn === column

  return (
    <TableHead className={className}>
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
      >
        {label}
        <ArrowUpDown
          className={`h-4 w-4 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
        />
      </button>
    </TableHead>
  )
}

// Mock auction data
const auctionListings = [
  {
    id: 'AUC-001',
    auctionName: 'WWA',
    title: 'John Deere 8320R Tractor',
    category: 'Equipment',
    startingBid: 125000,
    currentBid: 145000,
    bids: 24,
    endDate: '2025-12-01',
    status: 'pre-auction',
    auctionStatus: 'Published',
    location: 'Des Moines, IA',
    seller: 'Johnson Farm Equipment',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-002',
    auctionName: 'Midwest Ag Solutions',
    title: 'Case IH Combine Harvester',
    category: 'Equipment',
    startingBid: 89000,
    currentBid: 112000,
    bids: 18,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Omaha, NE',
    seller: 'Midwest Ag Solutions',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-003',
    auctionName: 'WWA',
    title: 'New Holland T7.315 Tractor',
    category: 'Equipment',
    startingBid: 95000,
    currentBid: 98500,
    bids: 12,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Wichita, KS',
    seller: 'Plains Equipment',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-004',
    auctionName: 'Heartland Land Sales',
    title: '320 Acre Farm with Irrigation',
    category: 'Real Estate',
    startingBid: 2400000,
    currentBid: 0,
    bids: 0,
    endDate: '2025-12-05',
    status: 'pre-auction',
    auctionStatus: 'In Ops Hands',
    location: 'Kansas City, MO',
    seller: 'Heartland Land Sales',
    salesRep: 'Jennifer Martinez',
    opsHandler: 'Maria Rodriguez',
    opsETA: '2025-11-30',
  },
  {
    id: 'AUC-005',
    auctionName: 'Northern Plains Equipment',
    title: 'AGCO Fendt 1050 Vario',
    category: 'Equipment',
    startingBid: 185000,
    currentBid: 205000,
    bids: 31,
    endDate: '2025-11-20',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Sioux Falls, SD',
    seller: 'Northern Plains Equipment',
    salesRep: 'David Thompson',
    winnerName: 'John Mitchell',
    winnerBidderId: 'BID-10423',
    winnerPhone: '555-0198',
    winnerEmail: 'john.mitchell@email.com',
  },
  {
    id: 'AUC-006',
    winnerName: 'Sarah Thompson',
    winnerBidderId: 'BID-10891',
    winnerPhone: '555-0234',
    winnerEmail: 'sarah.thompson@email.com',
    auctionName: 'WWA',
    title: 'John Deere S790 Combine',
    category: 'Equipment',
    startingBid: 235000,
    currentBid: 268000,
    bids: 42,
    endDate: '2025-11-22',
    status: 'post-auction',
    auctionStatus: 'Pending Payment',
    location: 'Springfield, IL',
    seller: 'Midwest Harvesters Inc',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-007',
    winnerName: 'Patricia Garcia',
    winnerBidderId: 'BID-10567',
    winnerPhone: '555-0345',
    winnerEmail: 'patricia.garcia@email.com',
    auctionName: 'Great Lakes Livestock',
    title: '50 Head Angus Cattle',
    category: 'Livestock',
    startingBid: 85000,
    currentBid: 92000,
    bids: 19,
    endDate: '2025-11-27',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Madison, WI',
    seller: 'Great Lakes Livestock',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-008',
    auctionName: 'WWA',
    title: 'Versatile 4WD 610 Tractor',
    category: 'Equipment',
    startingBid: 145000,
    currentBid: 145000,
    bids: 0,
    endDate: '2025-12-10',
    status: 'pre-auction',
    auctionStatus: 'Queued',
    location: 'Fargo, ND',
    seller: 'Dakota Farm Supply',
    salesRep: 'Chris Davis',
    opsETA: '2025-12-02',
  },
  {
    id: 'AUC-009',
    auctionName: 'Prairie Equipment Co',
    title: 'Claas Lexion 780 Combine',
    category: 'Equipment',
    startingBid: 195000,
    currentBid: 215000,
    bids: 28,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Lincoln, NE',
    seller: 'Prairie Equipment Co',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-010',
    auctionName: 'Classic Auto Auctions',
    title: '1967 Ford Mustang Fastback',
    category: 'Collector Cars',
    startingBid: 68000,
    currentBid: 68000,
    bids: 0,
    endDate: '2025-12-08',
    status: 'pre-auction',
    auctionStatus: 'Submitted',
    location: 'Cedar Rapids, IA',
    seller: 'Classic Auto Auctions',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-011',
    winnerName: 'Robert Chen',
    winnerBidderId: 'BID-11256',
    winnerPhone: '555-0445',
    winnerEmail: 'robert.chen@email.com',
    auctionName: 'WWA',
    title: 'John Deere 9620R Tractor',
    category: 'Equipment',
    startingBid: 225000,
    currentBid: 248000,
    bids: 35,
    endDate: '2025-11-23',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Topeka, KS',
    seller: 'Sunflower Equipment',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-012',
    winnerName: 'Mark Taylor',
    winnerBidderId: 'BID-11123',
    winnerPhone: '555-0678',
    winnerEmail: 'mark.taylor@email.com',
    auctionName: 'Central Kansas Ag',
    title: 'New Holland CR10.90 Combine',
    category: 'Equipment',
    startingBid: 285000,
    currentBid: 312000,
    bids: 41,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Salina, KS',
    seller: 'Central Kansas Ag',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-013',
    auctionName: 'Show-Me Land Co',
    title: '160 Acre Tillable Farmland',
    category: 'Real Estate',
    startingBid: 1280000,
    currentBid: 1280000,
    bids: 0,
    endDate: '2025-12-12',
    status: 'pre-auction',
    auctionStatus: 'Pending',
    location: 'Columbia, MO',
    seller: 'Show-Me Land Co',
    salesRep: 'David Thompson',
  },
  {
    id: 'AUC-014',
    auctionName: 'WWA',
    title: 'Gleaner S98 Combine',
    category: 'Equipment',
    startingBid: 178000,
    currentBid: 192000,
    bids: 23,
    endDate: '2025-11-21',
    status: 'post-auction',
    auctionStatus: 'Pending Pickup',
    location: 'Peoria, IL',
    seller: 'Illinois Harvest Equipment',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-015',
    auctionName: 'Red River Livestock',
    title: '75 Head Hereford Cattle',
    category: 'Livestock',
    startingBid: 120000,
    currentBid: 128000,
    bids: 16,
    endDate: '2025-11-30',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Grand Forks, ND',
    seller: 'Red River Livestock',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-016',
    winnerName: 'Emily Rodriguez',
    winnerBidderId: 'BID-11789',
    winnerPhone: '555-0667',
    winnerEmail: 'emily.rodriguez@email.com',
    auctionName: 'WWA',
    title: 'John Deere 6175R Tractor',
    category: 'Equipment',
    startingBid: 115000,
    currentBid: 115000,
    bids: 0,
    endDate: '2025-12-15',
    status: 'pre-auction',
    auctionStatus: 'Needs Attention',
    location: 'Waterloo, IA',
    seller: 'Hawkeye Tractor',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-017',
    winnerName: 'Jessica White',
    winnerBidderId: 'BID-11598',
    winnerPhone: '555-0901',
    winnerEmail: 'jessica.white@email.com',
    auctionName: 'Central Illinois Ag',
    title: 'Case IH Axial-Flow 9250',
    category: 'Equipment',
    startingBid: 265000,
    currentBid: 298000,
    bids: 38,
    endDate: '2025-11-24',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Decatur, IL',
    seller: 'Central Illinois Ag',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-018',
    auctionName: 'Classic Auto Gallery',
    title: '1969 Chevrolet Camaro SS',
    category: 'Collector Cars',
    startingBid: 82000,
    currentBid: 89000,
    bids: 14,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Mankato, MN',
    seller: 'Classic Auto Gallery',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-019',
    auctionName: 'WWA',
    title: 'AGCO Ideal 9T Combine',
    category: 'Equipment',
    startingBid: 315000,
    currentBid: 315000,
    bids: 0,
    endDate: '2025-12-18',
    status: 'pre-auction',
    auctionStatus: 'Published',
    location: 'Rapid City, SD',
    seller: 'Black Hills Equipment',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-020',
    auctionName: 'Wheat State Equipment',
    title: 'John Deere 8R 410 Tractor',
    category: 'Equipment',
    startingBid: 385000,
    currentBid: 412000,
    bids: 29,
    endDate: '2025-11-27',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Hutchinson, KS',
    seller: 'Wheat State Equipment',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-021',
    winnerName: 'Michael Johnson',
    winnerBidderId: 'BID-12234',
    winnerPhone: '555-0889',
    winnerEmail: 'michael.johnson@email.com',
    auctionName: 'Western Kansas Realty',
    title: 'Commercial Building with 5 Acres',
    category: 'Real Estate',
    startingBid: 895000,
    currentBid: 945000,
    bids: 33,
    endDate: '2025-11-25',
    status: 'post-auction',
    auctionStatus: 'Needs Attention',
    location: 'Dodge City, KS',
    seller: 'Western Kansas Realty',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-022',
    winnerName: 'Daniel Harris',
    winnerBidderId: 'BID-12045',
    winnerPhone: '555-0234',
    winnerEmail: 'daniel.harris@email.com',
    auctionName: 'WWA',
    title: 'Kubota M6S-111 Tractor',
    category: 'Equipment',
    startingBid: 68000,
    currentBid: 72000,
    bids: 8,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Pending',
    location: 'Jefferson City, MO',
    seller: 'Capital City Equipment',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-023',
    auctionName: 'Bay Area Livestock',
    title: '100 Head Registered Angus',
    category: 'Livestock',
    startingBid: 185000,
    currentBid: 0,
    bids: 0,
    endDate: '2025-12-20',
    status: 'pre-auction',
    auctionStatus: 'In Ops Hands',
    location: 'Green Bay, WI',
    seller: 'Bay Area Livestock',
    salesRep: 'Lisa Williams',
    opsHandler: 'James Chen',
    opsETA: '2025-12-03',
  },
  {
    id: 'AUC-024',
    auctionName: 'Northern Illinois Harvest',
    title: 'John Deere S770 Combine',
    category: 'Equipment',
    startingBid: 218000,
    currentBid: 245000,
    bids: 26,
    endDate: '2025-11-26',
    status: 'post-auction',
    auctionStatus: 'Pending Payment',
    location: 'Rockford, IL',
    seller: 'Northern Illinois Harvest',
    salesRep: 'Chris Davis',
  },
  {
    id: 'AUC-025',
    auctionName: 'WWA',
    title: '1970 Plymouth Barracuda',
    category: 'Collector Cars',
    startingBid: 95000,
    currentBid: 102000,
    bids: 17,
    endDate: '2025-11-30',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Bismarck, ND',
    seller: 'Capital Classic Cars',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-026',
    opsETA: '2025-12-15',
    winnerName: 'Jennifer Davis',
    winnerBidderId: 'BID-12678',
    winnerPhone: '555-0123',
    winnerEmail: 'jennifer.davis@email.com',
    auctionName: 'Dakota Power Equipment',
    title: 'AGCO Challenger MT875E',
    category: 'Equipment',
    startingBid: 265000,
    currentBid: 265000,
    bids: 0,
    endDate: '2025-12-22',
    status: 'pre-auction',
    auctionStatus: 'Queued',
    location: 'Pierre, SD',
    seller: 'Dakota Power Equipment',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-027',
    auctionName: 'WWA',
    title: 'New Holland CR9.90 Combine',
    category: 'Equipment',
    startingBid: 295000,
    currentBid: 322000,
    bids: 37,
    endDate: '2025-11-27',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Ames, IA',
    seller: 'Cyclone Ag Equipment',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-028',
    auctionName: 'North Star Land Company',
    title: '240 Acre Ranch with Home',
    category: 'Real Estate',
    startingBid: 1850000,
    currentBid: 1925000,
    bids: 21,
    endDate: '2025-11-23',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'St. Cloud, MN',
    seller: 'North Star Land Company',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-029',
    auctionName: 'WWA',
    title: 'John Deere 7310R Tractor',
    category: 'Equipment',
    startingBid: 135000,
    currentBid: 148000,
    bids: 15,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Needs Attention',
    location: 'Sioux City, IA',
    seller: 'Siouxland Tractor',
    salesRep: 'David Thompson',
  },
  {
    id: 'AUC-030',
    auctionName: 'Hub City Equipment',
    title: 'Case IH Steiger 620 Quad',
    category: 'Equipment',
    startingBid: 385000,
    currentBid: 385000,
    bids: 0,
    endDate: '2025-12-25',
    status: 'pre-auction',
    auctionStatus: 'Submitted',
    location: 'Aberdeen, SD',
    seller: 'Hub City Equipment',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-031',
    winnerName: 'David Martinez',
    winnerBidderId: 'BID-13045',
    winnerPhone: '555-0456',
    winnerEmail: 'david.martinez@email.com',
    auctionName: 'Twin City Classic Cars',
    title: '1965 Corvette Stingray',
    category: 'Collector Cars',
    startingBid: 125000,
    currentBid: 138000,
    bids: 19,
    endDate: '2025-11-22',
    status: 'post-auction',
    auctionStatus: 'Pending Pickup',
    location: 'Bloomington, IL',
    seller: 'Twin City Classic Cars',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-032',
    auctionName: 'WWA',
    title: 'Kubota M7-152 Tractor',
    category: 'Equipment',
    startingBid: 72000,
    currentBid: 78000,
    bids: 11,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'La Crosse, WI',
    seller: 'River Valley Equipment',
    salesRep: 'Chris Davis',
  },
  {
    id: 'AUC-033',
    auctionName: 'Bluffs Livestock',
    title: '60 Head Black Angus Bulls',
    category: 'Livestock',
    startingBid: 145000,
    currentBid: 145000,
    bids: 0,
    endDate: '2025-12-28',
    status: 'pre-auction',
    auctionStatus: 'Pending',
    location: 'Council Bluffs, IA',
    seller: 'Bluffs Livestock',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-034',
    auctionName: 'WWA',
    title: 'New Holland T8.435 Tractor',
    category: 'Equipment',
    startingBid: 285000,
    currentBid: 308000,
    bids: 30,
    endDate: '2025-11-24',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Garden City, KS',
    seller: 'Southwest Kansas Ag',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-035',
    auctionName: 'Southeast Minnesota Ag',
    title: 'Case IH Optum 300 CVX',
    category: 'Equipment',
    startingBid: 165000,
    currentBid: 178000,
    bids: 20,
    endDate: '2025-11-30',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Rochester, MN',
    seller: 'Southeast Minnesota Ag',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-036',
    winnerName: 'Lisa Anderson',
    winnerBidderId: 'BID-13512',
    winnerPhone: '555-0789',
    winnerEmail: 'lisa.anderson@email.com',
    auctionName: 'Jackrabbit Land Sales',
    title: 'Grain Storage Facility - 10 Acres',
    category: 'Real Estate',
    startingBid: 1450000,
    currentBid: 1450000,
    bids: 0,
    endDate: '2025-12-30',
    status: 'pre-auction',
    auctionStatus: 'Published',
    location: 'Brookings, SD',
    seller: 'Jackrabbit Land Sales',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-037',
    auctionName: 'WWA',
    title: 'AGCO Fendt 942 Vario',
    category: 'Equipment',
    startingBid: 225000,
    currentBid: 252000,
    bids: 27,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Hays, KS',
    seller: 'High Plains Tractors',
    salesRep: 'David Thompson',
  },
  {
    id: 'AUC-038',
    auctionName: 'Fighting Illini Classics',
    title: '1972 Chevrolet Chevelle SS',
    category: 'Collector Cars',
    startingBid: 78000,
    currentBid: 89000,
    bids: 24,
    endDate: '2025-11-25',
    status: 'post-auction',
    auctionStatus: 'Pending Payment',
    location: 'Champaign, IL',
    seller: 'Fighting Illini Classics',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-039',
    auctionName: 'WWA',
    title: 'Versatile 375 Tractor',
    category: 'Equipment',
    startingBid: 125000,
    currentBid: 125000,
    bids: 0,
    endDate: '2026-01-02',
    status: 'pre-auction',
    auctionStatus: 'Needs Attention',
    location: 'Minot, ND',
    seller: 'Magic City Equipment',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-040',
    auctionName: 'River City Tractors',
    title: 'John Deere 6155R Tractor',
    category: 'Equipment',
    startingBid: 105000,
    currentBid: 115000,
    bids: 13,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Dubuque, IA',
    seller: 'River City Tractors',
    salesRep: 'Chris Davis',
  },
  {
    id: 'AUC-041',
    winnerName: 'Thomas Wilson',
    winnerBidderId: 'BID-13890',
    winnerPhone: '555-0234',
    winnerEmail: 'thomas.wilson@email.com',
    auctionName: 'WWA',
    title: 'Case IH Axial-Flow 8250',
    category: 'Equipment',
    startingBid: 245000,
    currentBid: 278000,
    bids: 32,
    endDate: '2025-11-26',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Quincy, IL',
    seller: 'River Bend Equipment',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-042',
    auctionName: 'WWA',
    title: '200 Head Feeder Cattle',
    category: 'Livestock',
    startingBid: 285000,
    currentBid: 0,
    bids: 0,
    endDate: '2026-01-05',
    status: 'pre-auction',
    auctionStatus: 'In Ops Hands',
    location: 'Eau Claire, WI',
    seller: 'Chippewa Valley Livestock',
    salesRep: 'Jake Peters',
    opsHandler: 'David Park',
    opsETA: '2025-12-10',
  },
  {
    id: 'AUC-043',
    auctionName: 'Ozark Equipment',
    title: 'Kubota M8-231 Tractor',
    category: 'Equipment',
    startingBid: 98000,
    currentBid: 108000,
    bids: 16,
    endDate: '2025-11-27',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Springfield, MO',
    seller: 'Ozark Equipment',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-044',
    auctionName: 'WWA',
    title: 'John Deere S780 Combine',
    category: 'Equipment',
    startingBid: 228000,
    currentBid: 258000,
    bids: 29,
    endDate: '2025-11-23',
    status: 'post-auction',
    auctionStatus: 'Pending Pickup',
    location: 'Moline, IL',
    seller: 'Quad Cities Harvest',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-045',
    auctionName: 'Corn Palace Classic Cars',
    title: '1968 Dodge Charger R/T',
    category: 'Collector Cars',
    startingBid: 115000,
    currentBid: 126000,
    bids: 22,
    endDate: '2025-11-30',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Mitchell, SD',
    seller: 'Corn Palace Classic Cars',
    salesRep: 'David Thompson',
  },
  {
    id: 'AUC-046',
    opsETA: '2025-12-28',
    winnerName: 'Amanda Brown',
    winnerBidderId: 'BID-14267',
    winnerPhone: '555-0567',
    winnerEmail: 'amanda.brown@email.com',
    auctionName: 'WWA',
    title: 'Versatile 520DT Tractor',
    category: 'Equipment',
    startingBid: 165000,
    currentBid: 165000,
    bids: 0,
    endDate: '2026-01-08',
    status: 'pre-auction',
    auctionStatus: 'Queued',
    location: 'Williston, ND',
    seller: 'Badlands Equipment',
    salesRep: 'Robert Garcia',
  },
  {
    id: 'AUC-047',
    auctionName: 'Webster County Equipment',
    title: 'Case IH Magnum 340',
    category: 'Equipment',
    startingBid: 155000,
    currentBid: 172000,
    bids: 18,
    endDate: '2025-11-28',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Fort Dodge, IA',
    seller: 'Webster County Equipment',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-048',
    auctionName: 'WWA',
    title: 'New Holland CR8.90 Combine',
    category: 'Equipment',
    startingBid: 268000,
    currentBid: 295000,
    bids: 34,
    endDate: '2025-11-24',
    status: 'post-auction',
    auctionStatus: 'Completed',
    location: 'Normal, IL',
    seller: 'Heartland Harvest',
    salesRep: 'Chris Davis',
  },
  {
    id: 'AUC-049',
    auctionName: 'Fox Valley Land Company',
    title: '480 Acre Irrigated Farm',
    category: 'Real Estate',
    startingBid: 3850000,
    currentBid: 3850000,
    bids: 0,
    endDate: '2026-01-10',
    status: 'pre-auction',
    auctionStatus: 'Submitted',
    location: 'Appleton, WI',
    seller: 'Fox Valley Land Company',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-050',
    auctionName: 'WWA',
    title: 'John Deere 9520R Tractor',
    category: 'Equipment',
    startingBid: 195000,
    currentBid: 218000,
    bids: 25,
    endDate: '2025-11-29',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Ottumwa, IA',
    seller: 'Southeast Iowa Equipment',
    salesRep: 'Jake Peters',
  },
  {
    id: 'AUC-051',
    winnerName: 'Christopher Lee',
    winnerBidderId: 'BID-14623',
    winnerPhone: '555-0890',
    winnerEmail: 'christopher.lee@email.com',
    auctionName: 'Southern Illinois Classics',
    title: '1971 Ford Mustang Mach 1',
    category: 'Collector Cars',
    startingBid: 72000,
    currentBid: 85000,
    bids: 21,
    endDate: '2025-11-21',
    status: 'post-auction',
    auctionStatus: 'Needs Attention',
    location: 'Carbondale, IL',
    seller: 'Southern Illinois Classics',
    salesRep: 'Tom Richardson',
  },
  {
    id: 'AUC-052',
    auctionName: 'WWA',
    title: 'Kubota M6-141 Tractor',
    category: 'Equipment',
    startingBid: 75000,
    currentBid: 75000,
    bids: 0,
    endDate: '2026-01-12',
    status: 'pre-auction',
    auctionStatus: 'Published',
    location: 'Wausau, WI',
    seller: 'Marathon County Equipment',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-053',
    auctionName: 'Southwest Harvest Equipment',
    title: 'AGCO Ideal 10T Combine',
    category: 'Equipment',
    startingBid: 335000,
    currentBid: 368000,
    bids: 40,
    endDate: '2025-11-27',
    status: 'live-auction',
    auctionStatus: 'Active',
    location: 'Liberal, KS',
    seller: 'Southwest Harvest Equipment',
    salesRep: 'David Thompson',
  },
]
// Component to truncate text and show full text in tooltip
const TruncatedCell = ({
  text,
  maxLength = 20,
}: {
  text: string
  maxLength?: number
}) => {
  const shouldTruncate = text && text.length > maxLength
  const truncatedText = shouldTruncate
    ? `${text.substring(0, maxLength)}...`
    : text

  if (!shouldTruncate) {
    return <>{text}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help">{truncatedText}</span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}

// Wrapper component to handle sidebar state (must be inside SidebarProvider)
function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar()

  // Auto-close sidebar on mount only (only for dashboards)
  React.useEffect(() => {
    sidebar.setOpen(false)
  }, []) // Empty dependency array - only run once on mount

  const handleBreadcrumbClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    sidebar.setOpen(true)
  }

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            {/* SidebarTrigger automatically toggles sidebar open/closed */}
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
                  <BreadcrumbPage>Auction Insights</BreadcrumbPage>
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
        {children}
      </SidebarInset>
    </>
  )
}

function Dashboard() {
  const [activeTab, setActiveTab] = useState('live-auction')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter states
  const [filterAuctionId, setFilterAuctionId] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterSalesRep, setFilterSalesRep] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Modal state
  const [selectedListing, setSelectedListing] = useState<
    (typeof auctionListings)[0] | null
  >(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openListingModal = (listing: (typeof auctionListings)[0]) => {
    setSelectedListing(listing)
    setIsModalOpen(true)
  }

  const closeListingModal = () => {
    setIsModalOpen(false)
    setSelectedListing(null)
  }

  const getActionSuggestion = (status: string) => {
    switch (status) {
      case 'Submitted':
        return {
          suggestion:
            'This listing has been submitted and is awaiting review. Please review the details and approve for publication.',
          action: 'Review & Approve',
        }
      case 'Pending':
        return {
          suggestion:
            'This listing is pending final approval. Review the information and move to published when ready.',
          action: 'Approve Listing',
        }
      case 'Queued':
        return {
          suggestion:
            'This listing is queued for publication. It will automatically go live on the scheduled date. Operations is expected to begin review on the ETA date.',
          action: 'Edit Schedule',
        }
      case 'In Ops Hands':
        return {
          suggestion:
            'This listing is currently being reviewed by the operations team. Double check that all details are correct.',
          action: 'Review Details',
        }
      case 'Needs Attention':
        return {
          suggestion:
            'This listing requires immediate attention. There may be missing information or issues that need to be resolved.',
          action: 'Resolve Issues',
        }
      case 'Published':
        return {
          suggestion:
            'This listing is published and ready to go live. It will begin accepting bids on the scheduled date.',
          action: 'View Public Page',
        }
      case 'Active':
        return {
          suggestion:
            'This auction is currently live and accepting bids. Monitor bidding activity and respond to inquiries.',
          action: 'Monitor Auction',
        }
      case 'Pending Payment':
        return {
          suggestion:
            'This auction has ended. The winning bidder needs to complete payment before pickup can be scheduled.',
          action: 'Send Payment Reminder',
        }
      case 'Pending Pickup':
        return {
          suggestion:
            'Payment has been received. Coordinate with the buyer to schedule pickup of the item.',
          action: 'Schedule Pickup',
        }
      case 'Completed':
        return {
          suggestion:
            'This auction has been completed successfully. All payment and pickup have been finalized.',
          action: 'View Final Report',
        }
      default:
        return {
          suggestion: 'Review this listing for any required actions.',
          action: 'View Details',
        }
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to ascending
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const clearFilters = () => {
    setFilterAuctionId('')
    setFilterTitle('')
    setFilterSalesRep('')
    setDateRange(undefined)
  }

  const hasActiveFilters =
    filterAuctionId ||
    filterTitle ||
    filterSalesRep ||
    dateRange?.from ||
    dateRange?.to

  // Get unique values for filter dropdowns
  const uniqueAuctionNames = [
    ...new Set(auctionListings.map((l) => l.auctionName)),
  ].sort()
  const uniqueTitles = [...new Set(auctionListings.map((l) => l.title))].sort()
  const uniqueSalesReps = [
    ...new Set(auctionListings.map((l) => l.salesRep)),
  ].sort()

  const filteredListings = auctionListings.filter(
    (listing) => listing.status === activeTab,
  )

  // Apply filters without tab filtering (for cross-tab stats)
  const allFilteredListings = auctionListings.filter((listing) => {
    // Filter by Auction Name
    if (
      filterAuctionId &&
      !listing.auctionName.toLowerCase().includes(filterAuctionId.toLowerCase())
    ) {
      return false
    }

    // Filter by Title
    if (
      filterTitle &&
      !listing.title.toLowerCase().includes(filterTitle.toLowerCase())
    ) {
      return false
    }

    // Filter by Sales Rep
    if (
      filterSalesRep &&
      !listing.salesRep.toLowerCase().includes(filterSalesRep.toLowerCase())
    ) {
      return false
    }

    // Filter by Date Range
    if (dateRange?.from || dateRange?.to) {
      const listingDate = new Date(listing.endDate)

      if (dateRange.from) {
        const startDate = new Date(dateRange.from)
        startDate.setHours(0, 0, 0, 0)
        if (listingDate < startDate) return false
      }

      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (listingDate > endDate) return false
      }
    }

    return true
  })

  // Apply filters to current tab
  const filteredBySearch = filteredListings.filter((listing) => {
    // Filter by Auction Name
    if (
      filterAuctionId &&
      !listing.auctionName.toLowerCase().includes(filterAuctionId.toLowerCase())
    ) {
      return false
    }

    // Filter by Title
    if (
      filterTitle &&
      !listing.title.toLowerCase().includes(filterTitle.toLowerCase())
    ) {
      return false
    }

    // Filter by Sales Rep
    if (
      filterSalesRep &&
      !listing.salesRep.toLowerCase().includes(filterSalesRep.toLowerCase())
    ) {
      return false
    }

    // Filter by Date Range
    if (dateRange?.from || dateRange?.to) {
      const listingDate = new Date(listing.endDate)

      if (dateRange.from) {
        const startDate = new Date(dateRange.from)
        startDate.setHours(0, 0, 0, 0)
        if (listingDate < startDate) return false
      }

      if (dateRange.to) {
        const endDate = new Date(dateRange.to)
        endDate.setHours(23, 59, 59, 999)
        if (listingDate > endDate) return false
      }
    }

    return true
  })

  // Sort the filtered listings
  const sortedListings = [...filteredBySearch].sort((a, b) => {
    if (!sortColumn) return 0

    let aValue: any
    let bValue: any

    switch (sortColumn) {
      case 'id':
        aValue = a.id
        bValue = b.id
        break
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      case 'status':
        aValue = a.auctionStatus
        bValue = b.auctionStatus
        break
      case 'openingBid':
        aValue = a.startingBid
        bValue = b.startingBid
        break
      case 'currentBid':
      case 'winningBid':
        aValue = a.currentBid
        bValue = b.currentBid
        break
      case 'bids':
        aValue = a.bids
        bValue = b.bids
        break
      case 'endDate':
      case 'scheduledDate':
        aValue = new Date(a.endDate).getTime()
        bValue = new Date(b.endDate).getTime()
        break
      case 'location':
        aValue = a.location.toLowerCase()
        bValue = b.location.toLowerCase()
        break
      case 'salesRep':
        aValue = a.salesRep.toLowerCase()
        bValue = b.salesRep.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Jake's personal stats for top cards
  const jakeStats = {
    'pre-auction': auctionListings.filter(
      (l) => l.status === 'pre-auction' && l.salesRep === 'Jake Peters',
    ).length,
    'live-auction': auctionListings.filter(
      (l) => l.status === 'live-auction' && l.salesRep === 'Jake Peters',
    ).length,
    'post-auction': auctionListings.filter(
      (l) => l.status === 'post-auction' && l.salesRep === 'Jake Peters',
    ).length,
  }

  // All stats for tabs
  const stats = {
    'pre-auction': auctionListings.filter((l) => l.status === 'pre-auction')
      .length,
    'live-auction': auctionListings.filter((l) => l.status === 'live-auction')
      .length,
    'post-auction': auctionListings.filter((l) => l.status === 'post-auction')
      .length,
  }

  // Filtered stats for tabs (based on applied filters across all tabs)
  const filteredStats = {
    'pre-auction': allFilteredListings.filter((l) => l.status === 'pre-auction')
      .length,
    'live-auction': allFilteredListings.filter(
      (l) => l.status === 'live-auction',
    ).length,
    'post-auction': allFilteredListings.filter(
      (l) => l.status === 'post-auction',
    ).length,
  }

  // Status tallies across all tabs (based on filtered results)
  const statusTallies = {
    pending: allFilteredListings.filter(
      (l) =>
        l.auctionStatus === 'Pending' ||
        l.auctionStatus === 'Queued' ||
        l.auctionStatus === 'Pending Payment' ||
        l.auctionStatus === 'Pending Pickup' ||
        l.auctionStatus === 'Submitted',
    ).length,
    needsAttention: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Needs Attention',
    ).length,
    published: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Published' || l.auctionStatus === 'Active',
    ).length,
    completed: allFilteredListings.filter(
      (l) => l.auctionStatus === 'Completed',
    ).length,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardWrapper>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-sidebar">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">
              Auction Insights
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <h2 className="text-base font-semibold">
                  Hello Jake, take action on your items
                </h2>
                <p className="text-sm text-muted-foreground">
                  You have{' '}
                  <span className="font-semibold">
                    {
                      auctionListings.filter(
                        (l) =>
                          l.salesRep === 'Jake Peters' &&
                          l.status === 'pre-auction',
                      ).length
                    }{' '}
                    items currently in Pre-Auction
                  </span>{' '}
                  and{' '}
                  <span className="font-semibold">
                    {
                      auctionListings.filter(
                        (l) =>
                          l.salesRep === 'Jake Peters' &&
                          l.auctionStatus === 'Needs Attention',
                      ).length
                    }{' '}
                    items that need your immediate attention
                  </span>
                </p>
              </div>
              <Separator
                orientation="vertical"
                className="min-h-12 w-px bg-foreground/30"
              />
              <div className="flex h-12 w-12 min-h-12 min-w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
                JP
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Pre-Auction
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['pre-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Upcoming auctions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('pre-auction')
                      setFilterSalesRep('Jake Peters')
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Live Auctions
                </CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['live-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Currently active
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('live-auction')
                      setFilterSalesRep('Jake Peters')
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Post-Auction
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-row mt-auto justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">
                      {jakeStats['post-auction']}
                    </div>
                    <div className="flex items-end justify-between mt-1">
                      <p className="text-xs text-muted-foreground mb-0">
                        Completed auctions
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => {
                      setActiveTab('post-auction')
                      setFilterSalesRep('Jake Peters')
                    }}
                  >
                    Show Me
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Auction Listings Table */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Browse Listings</CardTitle>
                  <CardDescription>
                    View and manage auction listings across all stages
                  </CardDescription>
                </div>
                <Button variant="outline">HubSpot</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value={activeTab} className="mt-0">
                  {/* Filters Section */}
                  <div className="mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Separator className="flex-1" />
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 text-xs ml-4"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2 min-w-[200px]">
                        <Label htmlFor="filter-auction-id" className="text-xs">
                          Auction
                        </Label>
                        <div className="relative">
                          <Input
                            id="filter-auction-id"
                            placeholder="Search by auction..."
                            value={filterAuctionId}
                            onChange={(e) => setFilterAuctionId(e.target.value)}
                            className="h-9 pr-8"
                            list="auction-names"
                          />
                          {filterAuctionId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFilterAuctionId('')}
                              className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <datalist id="auction-names">
                          {uniqueAuctionNames.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2 min-w-[200px]">
                        <Label htmlFor="filter-title" className="text-xs">
                          Auction Title
                        </Label>
                        <div className="relative">
                          <Input
                            id="filter-title"
                            placeholder="Search by title..."
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                            className="h-9 pr-8"
                            list="auction-titles"
                          />
                          {filterTitle && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFilterTitle('')}
                              className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <datalist id="auction-titles">
                          {uniqueTitles.map((title) => (
                            <option key={title} value={title} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2 min-w-[200px]">
                        <Label htmlFor="filter-sales-rep" className="text-xs">
                          Sales Rep
                        </Label>
                        <div className="relative">
                          <Input
                            id="filter-sales-rep"
                            placeholder="Search by rep..."
                            value={filterSalesRep}
                            onChange={(e) => setFilterSalesRep(e.target.value)}
                            className="h-9 pr-8"
                            list="sales-reps"
                          />
                          {filterSalesRep && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFilterSalesRep('')}
                              className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <datalist id="sales-reps">
                          {uniqueSalesReps.map((rep) => (
                            <option key={rep} value={rep} />
                          ))}
                        </datalist>
                      </div>
                      <div className="space-y-2 min-w-[200px]">
                        <Label className="text-xs">Date Range</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full h-9 justify-start text-left font-normal text-xs',
                                !dateRange && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {dateRange?.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                                    {format(dateRange.to, 'LLL dd, y')}
                                  </>
                                ) : (
                                  format(dateRange.from, 'LLL dd, y')
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                              {dateRange?.from && (
                                <X
                                  className="ml-auto h-3 w-3"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDateRange(undefined)
                                  }}
                                />
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange?.from}
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>

                  {/* Tabs and Status Tallies - Moved below filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <TabsList className="rounded-xl w-full lg:w-auto">
                      <TabsTrigger
                        value="pre-auction"
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Pre-Auction
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['pre-auction']
                            : stats['pre-auction']}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="live-auction"
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Live Auction
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['live-auction']
                            : stats['live-auction']}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="post-auction"
                        className="gap-2 cursor-pointer rounded-xl flex-1 lg:flex-initial"
                      >
                        Post-Auction
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: hasActiveFilters
                              ? 'hsl(48 96% 53%)'
                              : 'color-mix(in oklab, var(--muted-foreground) 30%, transparent)',
                          }}
                          className={
                            hasActiveFilters ? 'text-black' : 'text-foreground'
                          }
                        >
                          {hasActiveFilters
                            ? filteredStats['post-auction']
                            : stats['post-auction']}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                    {/* Status Tallies */}
                    <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="warning"
                              className="gap-1 cursor-help"
                            >
                              Pending
                              <span className="ml-1 font-semibold">
                                {statusTallies.pending}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Includes Pending, Queued, Pending Payment and
                            Pending Pickup
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="destructive"
                              className="gap-1 cursor-help"
                            >
                              Needs Attention
                              <span className="ml-1 font-semibold">
                                {statusTallies.needsAttention}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Includes Pre, Live and Post-Auction
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="information"
                              className="gap-1 cursor-help"
                            >
                              Published
                              <span className="ml-1 font-semibold">
                                {statusTallies.published}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            All approved auctions that are ready to go Live
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="successful"
                              className="gap-1 cursor-help"
                            >
                              Completed
                              <span className="ml-1 font-semibold">
                                {statusTallies.completed}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            All auctions that have finished, paid and picked up
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <SortableTableHead
                            column="id"
                            label="Auction"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="title"
                            label="Item Name"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="category"
                            label="Category"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="status"
                            label="Status"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          {activeTab !== 'post-auction' && (
                            <SortableTableHead
                              column="openingBid"
                              label="Opening Bid"
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                            />
                          )}
                          {activeTab !== 'pre-auction' && (
                            <SortableTableHead
                              column={
                                activeTab === 'post-auction'
                                  ? 'winningBid'
                                  : 'currentBid'
                              }
                              label={
                                activeTab === 'post-auction'
                                  ? 'Winning Bid'
                                  : 'Current Bid'
                              }
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                            />
                          )}
                          {activeTab !== 'pre-auction' && (
                            <SortableTableHead
                              column="bids"
                              label="Bids"
                              sortColumn={sortColumn}
                              sortDirection={sortDirection}
                              onSort={handleSort}
                              className="text-center"
                            />
                          )}
                          <SortableTableHead
                            column={
                              activeTab === 'pre-auction'
                                ? 'scheduledDate'
                                : 'endDate'
                            }
                            label={
                              activeTab === 'pre-auction'
                                ? 'Scheduled Date'
                                : 'End Date'
                            }
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="location"
                            label="Location"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="salesRep"
                            label="Sales Rep"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedListings.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={11}
                              className="text-center h-24 text-muted-foreground"
                            >
                              {hasActiveFilters
                                ? 'No listings match your filter criteria'
                                : 'No listings found in this category'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          sortedListings.map((listing) => (
                            <TableRow key={listing.id}>
                              <TableCell className="font-medium">
                                <TooltipProvider>
                                  <TruncatedCell text={listing.auctionName} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    <TooltipProvider>
                                      <TruncatedCell text={listing.title} />
                                    </TooltipProvider>
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    <TooltipProvider>
                                      <TruncatedCell text={listing.seller} />
                                    </TooltipProvider>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  <TooltipProvider>
                                    <TruncatedCell text={listing.category} />
                                  </TooltipProvider>
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    listing.auctionStatus,
                                  )}
                                >
                                  <TooltipProvider>
                                    <TruncatedCell
                                      text={listing.auctionStatus}
                                    />
                                  </TooltipProvider>
                                </Badge>
                              </TableCell>
                              {activeTab !== 'post-auction' && (
                                <TableCell>
                                  {formatCurrency(listing.startingBid)}
                                </TableCell>
                              )}
                              {activeTab !== 'pre-auction' && (
                                <TableCell className="font-semibold">
                                  {formatCurrency(listing.currentBid)}
                                </TableCell>
                              )}
                              {activeTab !== 'pre-auction' && (
                                <TableCell className="text-center">
                                  {listing.bids}
                                </TableCell>
                              )}
                              <TableCell>
                                {formatDate(listing.endDate)}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <TruncatedCell text={listing.location} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <TruncatedCell text={listing.salesRep} />
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openListingModal(listing)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View details</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </DashboardWrapper>

      {/* Listing Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedListing && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedListing.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedListing.id} • {selectedListing.auctionName} •{' '}
                  {selectedListing.category}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status Badge */}
                <div>
                  <Badge
                    variant={getStatusBadgeVariant(
                      selectedListing.auctionStatus,
                    )}
                  >
                    {selectedListing.auctionStatus}
                  </Badge>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Opening Bid
                    </Label>
                    <p className="text-lg font-semibold">
                      {formatCurrency(selectedListing.startingBid)}
                    </p>
                  </div>

                  {/* Current Bid / Winning Bid - only for Live and Post */}
                  {selectedListing.status !== 'pre-auction' && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        {selectedListing.status === 'post-auction'
                          ? 'Winning Bid'
                          : 'Current Bid'}
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedListing.currentBid === 0 ? (
                          <span className="text-muted-foreground text-sm">
                            Not yet available
                          </span>
                        ) : (
                          formatCurrency(selectedListing.currentBid)
                        )}
                      </p>
                    </div>
                  )}

                  {/* Total Bids - only for Live and Post */}
                  {selectedListing.status !== 'pre-auction' && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Total Bids
                      </Label>
                      <p className="text-lg font-semibold">
                        {selectedListing.bids}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      {selectedListing.status === 'pre-auction'
                        ? 'Scheduled Date'
                        : 'End Date'}
                    </Label>
                    <p className="text-lg font-semibold">
                      {formatDate(selectedListing.endDate)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Location
                    </Label>
                    <p className="text-base">{selectedListing.location}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Sales Rep
                    </Label>
                    <p className="text-base">{selectedListing.salesRep}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Seller
                    </Label>
                    <p className="text-base">{selectedListing.seller}</p>
                  </div>

                  {/* Operations Handler - only for In Ops Hands */}
                  {selectedListing.auctionStatus === 'In Ops Hands' &&
                    selectedListing.opsHandler && (
                      <>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Operations Handler
                          </Label>
                          <p className="text-base font-medium">
                            {selectedListing.opsHandler}
                          </p>
                        </div>
                        {selectedListing.opsETA && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">
                              Expected Completion
                            </Label>
                            <p className="text-base font-medium">
                              {formatDate(selectedListing.opsETA)}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                  {/* Operations ETA - only for Queued */}
                  {selectedListing.auctionStatus === 'Queued' &&
                    selectedListing.opsETA && (
                      <div className="space-y-1 col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          Operations Review Starts
                        </Label>
                        <p className="text-base font-medium">
                          {formatDate(selectedListing.opsETA)}
                        </p>
                      </div>
                    )}

                  {/* Winner Information - only for Post-Auction */}
                  {selectedListing.status === 'post-auction' &&
                    selectedListing.winnerName && (
                      <>
                        <div className="space-y-1 col-span-2">
                          <Separator />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Winning Bidder
                          </Label>
                          <p className="text-base font-medium">
                            {selectedListing.winnerName}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Bidder ID
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerBidderId}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Phone
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerPhone}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Email
                          </Label>
                          <p className="text-base">
                            {selectedListing.winnerEmail}
                          </p>
                        </div>
                      </>
                    )}
                </div>

                <Separator />

                {/* Action Suggestion */}
                <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                      <svg
                        className="h-4 w-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <Label className="text-sm font-semibold">
                        Recommended Action
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {
                          getActionSuggestion(selectedListing.auctionStatus)
                            .suggestion
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={closeListingModal}>
                  Close
                </Button>
                <Button onClick={closeListingModal}>
                  {getActionSuggestion(selectedListing.auctionStatus).action}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
