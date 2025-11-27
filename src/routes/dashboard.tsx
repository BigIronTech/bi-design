import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Gavel,
  X,
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
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
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

export const Route = createFileRoute('/dashboard')({
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
    case 'In Progress':
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-002',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-003',
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
    title: '320 Acre Farm with Irrigation',
    category: 'Real Estate',
    startingBid: 2400000,
    currentBid: 2400000,
    bids: 0,
    endDate: '2025-12-05',
    status: 'pre-auction',
    auctionStatus: 'In Progress',
    location: 'Kansas City, MO',
    seller: 'Heartland Land Sales',
    salesRep: 'Jennifer Martinez',
  },
  {
    id: 'AUC-005',
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
  },
  {
    id: 'AUC-006',
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
  },
  {
    id: 'AUC-009',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-010',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-011',
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
    salesRep: 'Chris Davis',
  },
  {
    id: 'AUC-017',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-018',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-019',
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
    salesRep: 'David Thompson',
  },
  {
    id: 'AUC-022',
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
    title: '100 Head Registered Angus',
    category: 'Livestock',
    startingBid: 185000,
    currentBid: 185000,
    bids: 0,
    endDate: '2025-12-20',
    status: 'pre-auction',
    auctionStatus: 'In Progress',
    location: 'Green Bay, WI',
    seller: 'Bay Area Livestock',
    salesRep: 'Lisa Williams',
  },
  {
    id: 'AUC-024',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-026',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-027',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-034',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-035',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-042',
    title: '200 Head Feeder Cattle',
    category: 'Livestock',
    startingBid: 285000,
    currentBid: 285000,
    bids: 0,
    endDate: '2026-01-05',
    status: 'pre-auction',
    auctionStatus: 'In Progress',
    location: 'Eau Claire, WI',
    seller: 'Chippewa Valley Livestock',
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-043',
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
    salesRep: 'Mike Anderson',
  },
  {
    id: 'AUC-050',
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
    salesRep: 'Sarah Johnson',
  },
  {
    id: 'AUC-051',
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
function Dashboard() {
  const [activeTab, setActiveTab] = useState('live-auction')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filter states
  const [filterAuctionId, setFilterAuctionId] = useState('')
  const [filterTitle, setFilterTitle] = useState('')
  const [filterSalesRep, setFilterSalesRep] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')

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
    setFilterDateStart('')
    setFilterDateEnd('')
  }

  const hasActiveFilters =
    filterAuctionId ||
    filterTitle ||
    filterSalesRep ||
    filterDateStart ||
    filterDateEnd

  const filteredListings = auctionListings.filter(
    (listing) => listing.status === activeTab,
  )

  // Apply filters
  const filteredBySearch = filteredListings.filter((listing) => {
    // Filter by Auction ID
    if (
      filterAuctionId &&
      !listing.id.toLowerCase().includes(filterAuctionId.toLowerCase())
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
    if (filterDateStart || filterDateEnd) {
      const listingDate = new Date(listing.endDate)

      if (filterDateStart) {
        const startDate = new Date(filterDateStart)
        if (listingDate < startDate) return false
      }

      if (filterDateEnd) {
        const endDate = new Date(filterDateEnd)
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

  const stats = {
    'pre-auction': auctionListings.filter((l) => l.status === 'pre-auction')
      .length,
    'live-auction': auctionListings.filter((l) => l.status === 'live-auction')
      .length,
    'post-auction': auctionListings.filter((l) => l.status === 'post-auction')
      .length,
  }

  // Status tallies across all tabs
  const statusTallies = {
    pending: auctionListings.filter(
      (l) =>
        l.auctionStatus === 'Pending' ||
        l.auctionStatus === 'Queued' ||
        l.auctionStatus === 'Pending Payment' ||
        l.auctionStatus === 'Pending Pickup' ||
        l.auctionStatus === 'Submitted',
    ).length,
    needsAttention: auctionListings.filter(
      (l) => l.auctionStatus === 'Needs Attention',
    ).length,
    published: auctionListings.filter(
      (l) => l.auctionStatus === 'Published' || l.auctionStatus === 'Active',
    ).length,
    completed: auctionListings.filter((l) => l.auctionStatus === 'Completed')
      .length,
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboards</BreadcrumbLink>
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
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">
              Auction Insights
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pre-Auction
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats['pre-auction']}</div>
                <p className="text-xs text-muted-foreground">
                  Upcoming auctions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Live Auctions
                </CardTitle>
                <Gavel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats['live-auction']}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Post-Auction
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats['post-auction']}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed auctions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Auction Listings Table */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Browse Listings</CardTitle>
                  <CardDescription>
                    View and manage auction listings across all stages
                  </CardDescription>
                </div>
                {/* Status Tallies */}
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <Badge variant="warning" className="gap-1">
                    Pending
                    <span className="ml-1 font-semibold">
                      {statusTallies.pending}
                    </span>
                  </Badge>
                  <Badge variant="destructive" className="gap-1">
                    Needs Attention
                    <span className="ml-1 font-semibold">
                      {statusTallies.needsAttention}
                    </span>
                  </Badge>
                  <Badge variant="information" className="gap-1">
                    Published
                    <span className="ml-1 font-semibold">
                      {statusTallies.published}
                    </span>
                  </Badge>
                  <Badge variant="successful" className="gap-1">
                    Completed
                    <span className="ml-1 font-semibold">
                      {statusTallies.completed}
                    </span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pre-auction" className="gap-2">
                    Pre-Auction
                    <Badge
                      variant="secondary"
                      className="bg-gray-400 text-white dark:bg-gray-600 dark:text-white"
                    >
                      {stats['pre-auction']}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="live-auction" className="gap-2">
                    Live Auction
                    <Badge
                      variant="secondary"
                      className="bg-gray-400 text-white dark:bg-gray-600 dark:text-white"
                    >
                      {stats['live-auction']}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="post-auction" className="gap-2">
                    Post-Auction
                    <Badge
                      variant="secondary"
                      className="bg-gray-400 text-white dark:bg-gray-600 dark:text-white"
                    >
                      {stats['post-auction']}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-6">
                  {/* Filters Section */}
                  <div className="mb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <h3 className="text-sm font-medium">Filters</h3>
                      </div>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="filter-auction-id" className="text-xs">
                          Auction ID
                        </Label>
                        <Input
                          id="filter-auction-id"
                          placeholder="Search by ID..."
                          value={filterAuctionId}
                          onChange={(e) => setFilterAuctionId(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filter-title" className="text-xs">
                          Auction Title
                        </Label>
                        <Input
                          id="filter-title"
                          placeholder="Search by title..."
                          value={filterTitle}
                          onChange={(e) => setFilterTitle(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filter-sales-rep" className="text-xs">
                          Sales Rep
                        </Label>
                        <Input
                          id="filter-sales-rep"
                          placeholder="Search by rep..."
                          value={filterSalesRep}
                          onChange={(e) => setFilterSalesRep(e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Date Range</Label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={filterDateStart}
                            onChange={(e) => setFilterDateStart(e.target.value)}
                            className="h-9 text-xs"
                            placeholder="Start"
                          />
                          <Input
                            type="date"
                            value={filterDateEnd}
                            onChange={(e) => setFilterDateEnd(e.target.value)}
                            className="h-9 text-xs"
                            placeholder="End"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableTableHead
                            column="id"
                            label="Listing ID"
                            sortColumn={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort}
                          />
                          <SortableTableHead
                            column="title"
                            label="Title"
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
                                {listing.id}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {listing.title}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {listing.seller}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {listing.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={getStatusBadgeVariant(
                                    listing.auctionStatus,
                                  )}
                                >
                                  {listing.auctionStatus}
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
                              <TableCell>{listing.location}</TableCell>
                              <TableCell>{listing.salesRep}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
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
      </SidebarInset>
    </SidebarProvider>
  )
}
