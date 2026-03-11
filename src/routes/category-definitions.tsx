import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Database,
  Edit2,
  EyeOff,
  Filter,
  FolderTree,
  Layers,
  List,
  LogOut,
  MoveDown,
  MoveUp,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/category-definitions')({
  component: CategoryDefinitions,
})

// ── Constants ──────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  'Agriculture',
  'Construction',
  'Transportation',
  'Collector Cars',
  'Recreation',
  'Forestry',
  'Real Estate',
  'Oil & Gas',
  'Miscellaneous',
]

const VERTICALS = [
  'Farm Equipment',
  'Construction Equipment',
  'Trucks & Trailers',
  'Collector Cars',
  'Recreation',
  'Forestry Equipment',
  'Real Estate',
  'Oil & Gas Equipment',
  'Shop Equipment',
  'Livestock',
  'Miscellaneous',
]

const AUCTION_EXTENSIONS = ['3 min', '5 min', '10 min', '15 min']
const PRIORITIES = ['Low', 'Medium', 'High']
const ATTRIBUTE_EDITORS = [
  'Checkbox',
  'Dropdown',
  'Hidden',
  'Text',
  'Text with Dropdown',
]
const FACET_OPTIONS = [
  'None',
  'Amount',
  'Auction',
  'Consignment',
  'County',
  'Diameter',
  'Height',
  'Horsepower',
  'Hours',
  'Length',
  'Make',
  'Miles',
  'Modal',
  'Rows',
  'Size',
  'Width',
  'Year',
]
const MIGRATION_OPTIONS = ['None', 'Migrate', 'Remove']

// ── Types ──────────────────────────────────────────────────────────────────────

interface Attribute {
  id: string
  name: string
  title: string
  editor: string
  displayOrder: number
  isOptional: boolean
  isSpecification: boolean
  notInDescription: boolean
  appendToDescription: boolean
  isChecklist?: boolean
  shouldHideOnSold?: boolean
  includeInNewChecklist?: boolean
  facet?: string | null
  prefix?: string
  value?: string
  suffix?: string
  units?: string
  unitsSeparator?: string
  isYesNo?: boolean
  omitYes?: boolean
  yesValue?: string
  omitNo?: boolean
  noValue?: string
  suppressSalebill?: boolean
  suppressNewspaper?: boolean
  values?: string
  notes?: string
  migration?: string
  isObsolete?: boolean
}

interface CategoryDefinition {
  id: string
  guid: string
  name: string
  title: string
  auctionOrder: number
  categoryDisplayOrder: number
  auctionExtension: string
  priority: string
  isObsolete: boolean
  legacyTitle: string
  vertical: string
  effectiveDate: string
  status: 'active' | 'inactive'
  heading: {
    level1: string
    displayOrder1: string
    level2: string
    displayOrder2: string
  }
  parentConfig: {
    displayName: string
    parent1: string
    parent2: string
    parentDisplayOrder: string
  }
  industries: { industry1: string; industry2: string }
}

interface AttrFormState {
  name: string
  title: string
  editor: string
  displayOrder: string
  isOptional: boolean
  appendToDescription: boolean
  notInDescription: boolean
  isSpecification: boolean
  isChecklist: boolean
  shouldHideOnSold: boolean
  includeInNewChecklist: boolean
  facet: string
  prefix: string
  value: string
  suffix: string
  units: string
  unitsSeparator: string
  isYesNo: boolean
  omitYes: boolean
  yesValue: string
  omitNo: boolean
  noValue: string
  suppressSalebill: boolean
  suppressNewspaper: boolean
  values: string
  notes: string
  migration: string
  [key: string]: string | boolean
}

interface CatFormState {
  name: string
  category: string
  title: string
  auctionOrder: string
  auctionExtension: string
  priority: string
  isObsolete: boolean
  legacyTitle: string
  vertical: string
  effectiveDate: string
  heading: {
    level1: string
    displayOrder1: string
    level2: string
    displayOrder2: string
  }
  parentConfig: {
    displayName: string
    parent1: string
    parent2: string
    parentDisplayOrder: string
  }
  industries: { industry1: string; industry2: string }
  categoryDisplayOrder: string
}

interface ChangeLogEntry {
  id: string
  categoryId: string
  field: string
  oldValue: string
  newValue: string
  user: string
  timestamp: Date
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const mockAttributes: Array<Attribute> = [
  {
    id: 'a1',
    name: 'Default Lot Type',
    title: 'Default Lot Type',
    editor: 'Select',
    displayOrder: 0,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a2',
    name: 'Year',
    title: 'Year',
    editor: 'Number',
    displayOrder: 10,
    isOptional: false,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: 'Year',
  },
  {
    id: 'a3',
    name: 'Make',
    title: 'Make',
    editor: 'Select',
    displayOrder: 20,
    isOptional: false,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: 'Make',
  },
  {
    id: 'a4',
    name: 'Model',
    title: 'Model',
    editor: 'Text',
    displayOrder: 30,
    isOptional: true,
    isSpecification: true,
    notInDescription: true,
    appendToDescription: false,
    facet: 'Model',
  },
  {
    id: 'a5',
    name: 'What',
    title: 'What',
    editor: 'Text',
    displayOrder: 40,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a6',
    name: 'Are you aware of any missing parts?',
    title: 'Are you aware of any missing parts?',
    editor: 'Select',
    displayOrder: 50,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a7',
    name: 'Is this unit for parts only?',
    title: 'Is this unit for parts only?',
    editor: 'Select',
    displayOrder: 60,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a8',
    name: 'Hours',
    title: 'Hours',
    editor: 'Number',
    displayOrder: 70,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: true,
    facet: 'Hours',
  },
  {
    id: 'a9',
    name: 'Horsepower',
    title: 'Horsepower',
    editor: 'Number',
    displayOrder: 80,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: 'Horsepower',
  },
  {
    id: 'a10',
    name: 'Miles',
    title: 'Miles',
    editor: 'Number',
    displayOrder: 90,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: 'Miles',
  },
  {
    id: 'a11',
    name: 'Serial Number',
    title: 'Serial Number',
    editor: 'Text',
    displayOrder: 100,
    isOptional: true,
    isSpecification: false,
    notInDescription: true,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a12',
    name: 'VIN',
    title: 'VIN',
    editor: 'Text',
    displayOrder: 110,
    isOptional: true,
    isSpecification: false,
    notInDescription: true,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a13',
    name: 'Seller Asset Number',
    title: 'Seller Asset Number',
    editor: 'Text',
    displayOrder: 120,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a14',
    name: 'Not Actual Miles',
    title: 'Not Actual Miles',
    editor: 'Checkbox',
    displayOrder: 130,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a15',
    name: 'Engine Make/Model (Primary)',
    title: 'Engine Make/Model (Primary)',
    editor: 'Text',
    displayOrder: 140,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a16',
    name: 'Fuel Type',
    title: 'Fuel Type',
    editor: 'Select',
    displayOrder: 150,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: 'Fuel Type',
  },
  {
    id: 'a17',
    name: 'Engine Cooled',
    title: 'Engine Cooled',
    editor: 'Select',
    displayOrder: 160,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a18',
    name: "BTU's per hour",
    title: "BTU's per hour",
    editor: 'Number',
    displayOrder: 180,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a19',
    name: 'Adjustable Flame Shaping',
    title: 'Adjustable Flame Shaping',
    editor: 'Checkbox',
    displayOrder: 190,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a20',
    name: 'Length',
    title: 'Length',
    editor: 'Number',
    displayOrder: 220,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a21',
    name: 'Diameter',
    title: 'Diameter',
    editor: 'Number',
    displayOrder: 230,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a22',
    name: 'Width',
    title: 'Width',
    editor: 'Number',
    displayOrder: 240,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a23',
    name: 'Height',
    title: 'Height',
    editor: 'Number',
    displayOrder: 250,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a24',
    name: 'Weight',
    title: 'Weight',
    editor: 'Number',
    displayOrder: 260,
    isOptional: true,
    isSpecification: true,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a25',
    name: 'Frame Material',
    title: 'Frame Material',
    editor: 'Select',
    displayOrder: 270,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a26',
    name: 'Monitors',
    title: 'Monitors',
    editor: 'Text',
    displayOrder: 280,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a27',
    name: 'Special Packages',
    title: 'Special Packages',
    editor: 'Text',
    displayOrder: 290,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a28',
    name: 'Hitch Type',
    title: 'Hitch Type',
    editor: 'Select',
    displayOrder: 340,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
  },
  {
    id: 'a29',
    name: 'Quantity',
    title: 'Quantity',
    editor: 'Number',
    displayOrder: 690,
    isOptional: true,
    isSpecification: false,
    notInDescription: false,
    appendToDescription: false,
    facet: null,
    isObsolete: true,
  },
]

const mockChangeLog: Array<ChangeLogEntry> = [
  {
    id: 'cl1',
    categoryId: 'c1',
    field: 'priority',
    oldValue: 'Low',
    newValue: 'Medium',
    user: 'jpeters',
    timestamp: new Date('2025-02-18T09:30:00'),
  },
  {
    id: 'cl2',
    categoryId: 'c1',
    field: 'auctionExtension',
    oldValue: '5 min',
    newValue: '3 min',
    user: 'jpeters',
    timestamp: new Date('2025-02-15T14:22:00'),
  },
  {
    id: 'cl3',
    categoryId: 'c4',
    field: 'vertical',
    oldValue: '',
    newValue: 'Construction Equipment',
    user: 'admin',
    timestamp: new Date('2025-02-10T11:15:00'),
  },
  {
    id: 'cl4',
    categoryId: 'c4',
    field: 'legacyTitle',
    oldValue: 'Asphalt - Pavers',
    newValue: 'Asphalt - Pavers (Legacy)',
    user: 'admin',
    timestamp: new Date('2025-02-05T16:40:00'),
  },
  {
    id: 'cl5',
    categoryId: 'c2',
    field: 'status',
    oldValue: 'active',
    newValue: 'inactive',
    user: 'mrodgers',
    timestamp: new Date('2025-01-30T08:05:00'),
  },
  {
    id: 'cl6',
    categoryId: 'c3',
    field: 'auctionOrder',
    oldValue: '2100',
    newValue: '2180',
    user: 'jpeters',
    timestamp: new Date('2025-01-28T13:55:00'),
  },
  {
    id: 'cl7',
    categoryId: 'c5',
    field: 'industry1',
    oldValue: 'Construction',
    newValue: 'Agriculture',
    user: 'admin',
    timestamp: new Date('2025-01-22T10:30:00'),
  },
  {
    id: 'cl8',
    categoryId: 'c1',
    field: 'isObsolete',
    oldValue: 'false',
    newValue: 'true',
    user: 'mrodgers',
    timestamp: new Date('2025-01-18T15:10:00'),
  },
  {
    id: 'cl9',
    categoryId: 'c6',
    field: 'name',
    oldValue: 'Rollers',
    newValue: 'Compaction Rollers',
    user: 'jpeters',
    timestamp: new Date('2025-01-14T09:00:00'),
  },
  {
    id: 'cl10',
    categoryId: 'c2',
    field: 'priority',
    oldValue: 'High',
    newValue: 'Medium',
    user: 'admin',
    timestamp: new Date('2025-01-10T11:45:00'),
  },
  {
    id: 'cl11',
    categoryId: 'c7',
    field: 'effectiveDate',
    oldValue: '',
    newValue: '2025-01-01',
    user: 'jpeters',
    timestamp: new Date('2024-12-30T14:20:00'),
  },
  {
    id: 'cl12',
    categoryId: 'c3',
    field: 'status',
    oldValue: 'inactive',
    newValue: 'active',
    user: 'admin',
    timestamp: new Date('2024-12-20T10:00:00'),
  },
]

const currentUser = {
  id: 'u1',
  name: 'J. Peters',
  email: 'jpeters@bigiron.com',
}

function deriveIndustry(group: string): string {
  if (!group) return ''
  if (
    [
      'Farm Equipment',
      'Harvest Equipment',
      'Haying Equipment / Feed',
      'Planting Equipment',
      'Tillage Equipment',
      'Strip Tillage Equipment',
      'Irrigation Equipment',
      'Fertilizer/Chemical Equipment',
      'Livestock Equipment',
      'Livestock',
      'Orchard / Vineyard Equipment',
    ].includes(group)
  )
    return 'Agriculture'
  if (
    [
      'Construction Equipment',
      'Asphalt / Paving Equipment',
      'Lifts',
      'Shop Equipment',
    ].includes(group)
  )
    return 'Construction'
  if (['Trucks', 'Trailers', 'Vehicles', 'Transportation'].includes(group))
    return 'Transportation'
  if (['Collector Cars'].includes(group)) return 'Collector Cars'
  if (['Recreational', 'Lawn & Garden'].includes(group)) return 'Recreation'
  if (['Forestry Equipment'].includes(group)) return 'Forestry'
  if (['Real Estate', 'Real Estate Property'].includes(group))
    return 'Real Estate'
  if (['Oil & Gas Equipment'].includes(group)) return 'Oil & Gas'
  return 'Miscellaneous'
}

function deriveVertical(group: string): string {
  if (
    [
      'Farm Equipment',
      'Harvest Equipment',
      'Haying Equipment / Feed',
      'Planting Equipment',
      'Tillage Equipment',
      'Strip Tillage Equipment',
      'Fertilizer/Chemical Equipment',
      'Orchard / Vineyard Equipment',
      'Irrigation Equipment',
      'Livestock Equipment',
      'Livestock',
    ].includes(group)
  )
    return 'Farm Equipment'
  if (
    ['Construction Equipment', 'Asphalt / Paving Equipment', 'Lifts'].includes(
      group,
    )
  )
    return 'Construction Equipment'
  if (['Trucks', 'Trailers', 'Vehicles', 'Transportation'].includes(group))
    return 'Trucks & Trailers'
  if (['Collector Cars'].includes(group)) return 'Collector Cars'
  if (['Recreational', 'Lawn & Garden'].includes(group)) return 'Recreation'
  if (['Forestry Equipment'].includes(group)) return 'Forestry Equipment'
  if (['Real Estate', 'Real Estate Property'].includes(group))
    return 'Real Estate'
  if (['Oil & Gas Equipment'].includes(group)) return 'Oil & Gas Equipment'
  if (['Shop Equipment'].includes(group)) return 'Shop Equipment'
  return 'Miscellaneous'
}

const RAW_TITLES = [
  'Asphalt / Paving Equipment : Burners',
  'Asphalt / Paving Equipment : Chippers',
  'Asphalt / Paving Equipment : Compactors',
  'Asphalt / Paving Equipment : Distributors/Tack Trucks',
  'Asphalt / Paving Equipment : Mills/Grinders',
  'Asphalt / Paving Equipment : Other Asphalt Equipment',
  'Asphalt / Paving Equipment : Parts - Asphalt Equipment',
  'Asphalt / Paving Equipment : Pavement Profilers',
  'Asphalt / Paving Equipment : Pavers',
  'Asphalt / Paving Equipment : Road Planers',
  'Asphalt / Paving Equipment : Rollers',
  'Asphalt / Paving Equipment : Sweeper/Broom Attachments',
  'Asphalt / Paving Equipment : Sweepers/Brooms (Self-Propelled)',
  'Asphalt / Paving Equipment : Tar Kettles',
  'Asphalt / Paving Equipment : Traffic Control Devices',
  'Asphalt / Paving Equipment : Trailer-Asphalt Insulated Bulk',
  'Cable Plows',
  'Collector Cars : Collector Car Memorabilia',
  'Collector Cars : Collector Car Parts',
  'Collector Cars : Collector Cars',
  'Collector Cars : Collector Pickups',
  'Collector Cars : Collector Trucks',
  'Collector Cars : Other Collector Cars',
  'Construction Equipment : Air Compressors (Portable)',
  'Construction Equipment : Backhoes',
  'Construction Equipment : Concrete Equipment',
  'Construction Equipment : Construction Attachments',
  'Construction Equipment : Construction Materials',
  'Construction Equipment : Cranes',
  'Construction Equipment : Crawler Tractors/Dozers',
  'Construction Equipment : Excavators',
  'Construction Equipment : Forklifts - Rough Terrain',
  'Construction Equipment : Mini Excavators',
  'Construction Equipment : Motor Graders',
  'Construction Equipment : Other Construction Equipment',
  'Construction Equipment : Parts - Construction Equipment',
  'Construction Equipment : Scrapers (Pull-type)',
  'Construction Equipment : Scrapers (Self-Propelled)',
  'Construction Equipment : Skid Steer Attachments',
  'Construction Equipment : Skid Steers',
  'Construction Equipment : Soil Compactors (Pull-type)',
  'Construction Equipment : Soil Compactors (Self-Propelled)',
  'Construction Equipment : Telehandlers',
  'Construction Equipment : Track Loaders',
  'Construction Equipment : Track Loaders - Compact',
  'Construction Equipment : Trenchers/Cable Plows/Rock Saws',
  'Construction Equipment : Wheel Loaders',
  'Farm Equipment : Blades (3 Pt)',
  'Farm Equipment : Box Scrapers',
  'Farm Equipment : Farm Equipment Attachments',
  'Farm Equipment : Farm Parts & Supplies',
  'Farm Equipment : Other Farm Equipment',
  'Farm Equipment : Parts - Farm Equipment',
  'Farm Equipment : Precision Farm Equipment',
  'Farm Equipment : Rotary Mowers/Shredders',
  'Farm Equipment : Skid Steers',
  'Farm Equipment : Stalk Choppers',
  'Fertilizer/Chemical Equipment : Anhydrous Ammonia Equipment',
  'Fertilizer/Chemical Equipment : Dry Fertilizer Spreaders (Pull-type)',
  'Fertilizer/Chemical Equipment : Floaters',
  'Fertilizer/Chemical Equipment : Liquid Fertilizer Application Equipment',
  'Fertilizer/Chemical Equipment : Other Fertiliz./Chemical Equip',
  'Fertilizer/Chemical Equipment : Sprayers (Pull-type)',
  'Fertilizer/Chemical Equipment : Sprayers (Self-Propelled)',
  'Forestry Equipment : Feller/Bunchers',
  'Forestry Equipment : Horizontal Grinders',
  'Forestry Equipment : Log Skidders',
  'Forestry Equipment : Saw Mills',
  'Forestry Equipment : Stump Grinders',
  'Harvest Equipment : Augers & Conveyors',
  'Harvest Equipment : Combine Headers',
  'Harvest Equipment : Combine Headers: Corn Head',
  'Harvest Equipment : Combines',
  'Harvest Equipment : Forage Harvesters (Self-Propel)',
  'Harvest Equipment : Forage Wagons',
  'Harvest Equipment : Grain Carts',
  'Harvest Equipment : Grain Dryers',
  'Harvest Equipment : Grain Storage (Bins)',
  'Harvest Equipment : Other Harvest Equipment',
  'Harvest Equipment : Parts - Harvest Equipment',
  'Haying Equipment / Feed : Balers - Round',
  'Haying Equipment / Feed : Balers - Square (Big)',
  'Haying Equipment / Feed : Disc Mowers',
  'Haying Equipment / Feed : Mower Conditioners/Windrowers',
  'Haying Equipment / Feed : Other Haying Equipment',
  'Haying Equipment / Feed : Parts - Haying Equipment',
  'Haying Equipment / Feed : Rakes/Mergers (Pull-type)',
  'Irrigation Equipment : Irrigation Pipe',
  'Irrigation Equipment : Irrigation Supplies & Parts',
  'Irrigation Equipment : Pivots',
  'Irrigation Equipment : Power Units',
  'Irrigation Equipment : Water Pumps - Portable',
  'Lawn & Garden : Golf Carts',
  'Lawn & Garden : Landscaping Equipment',
  'Lawn & Garden : Lawn & Garden Equipment',
  'Lawn & Garden : Turf Equipment',
  'Lifts : Lifts - Boom',
  'Lifts : Lifts - Scissor',
  'Lifts : Lifts - Vertical Mast',
  'Livestock : Bred Cows',
  'Livestock : Bulls',
  'Livestock : Feeder Cattle',
  'Livestock : Hogs',
  'Livestock : Open Heifer Replacements',
  'Livestock : Other Cattle',
  'Livestock : Pairs',
  'Livestock Equipment : Dairy Equipment',
  'Livestock Equipment : Feed Wagons',
  'Livestock Equipment : Fencing Equipment & Materials',
  'Livestock Equipment : Grinder Mixers',
  'Livestock Equipment : Livestock Handling Equipment',
  'Livestock Equipment : Manure Handling Equipment',
  'Livestock Equipment : Other Livestock Equipment',
  'Livestock Equipment : Parts - Livestock Equipment',
  'Loaders',
  'Miscellaneous : Buildings',
  'Miscellaneous : Collectibles',
  'Miscellaneous : Household',
  'Miscellaneous : Office Equipment & Materials',
  'Miscellaneous : Parts - Miscellaneous',
  'Miscellaneous : Tires/Rims',
  'Oil & Gas Equipment : Air Compressors',
  'Oil & Gas Equipment : Derricks',
  'Oil & Gas Equipment : Drilling Equipment',
  'Oil & Gas Equipment : Frac Tanks',
  'Oil & Gas Equipment : Mud Pumps',
  'Oil & Gas Equipment : Pipelayers',
  'Oil & Gas Equipment : Water Pumps',
  'Orchard / Vineyard Equipment : Orchard Harvesters',
  'Orchard / Vineyard Equipment : Orchard Tractors',
  'Planting Equipment : Air Seeders/Air Carts',
  'Planting Equipment : Drills',
  'Planting Equipment : Planters',
  'Planting Equipment : Row Crop Cultivators',
  'Real Estate : Commercial',
  'Real Estate : Farm & Ranch Land',
  'Real Estate : Residential',
  'Real Estate Property : Land',
  'Real Estate Property : Other Real Estate',
  'Recreational : ATVs',
  'Recreational : Boats',
  'Recreational : Motorcycles',
  'Recreational : UTVs',
  'Shop Equipment : Air Compressors (Shop)',
  'Shop Equipment : Generators',
  'Shop Equipment : Other Shop Equipment',
  'Shop Equipment : Welders',
  'Strip Tillage Equipment : Strip Till Units',
  'Tillage Equipment : Chisel Plows',
  'Tillage Equipment : Discs',
  'Tillage Equipment : Field Cultivators',
  'Tillage Equipment : Other Tillage Equipment',
  'Tillage Equipment : Subsoilers',
  'Tractors : 2WD Tractors',
  'Tractors : 4WD Tractors',
  'Tractors : Other Tractors',
  'Trailers : Flatbed Trailers',
  'Trailers : Grain Trailers',
  'Trailers : Livestock Trailers',
  'Trailers : Other Trailers',
  'Trailers : Truck Trailers',
  'Transportation : Other Transportation',
  'Trucks : Dump Trucks',
  'Trucks : Flatbed Trucks',
  'Trucks : Other Trucks',
  'Trucks : Semi Trucks',
  'Vehicles : Other Vehicles',
  'Vehicles : Pickup Trucks',
  'Vehicles : SUVs',
]

function seededGuid(seed: number): string {
  let s = seed
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s
  }
  const hex = (n: number) => (rand() % 16 ** n).toString(16).padStart(n, '0')
  return `${hex(8)}-${hex(4)}-e${hex(3)}-${hex(4)}-${hex(12)}`
}

function buildCategory(rawTitle: string, idx: number): CategoryDefinition {
  const parts = rawTitle.split(' : ')
  const group = parts.length > 1 ? parts[0] : rawTitle
  const sub = parts.length > 1 ? parts[1] : rawTitle
  const industry = deriveIndustry(group)
  const vertical = deriveVertical(group)
  return {
    id: `c${idx + 1}`,
    guid: seededGuid(idx + 1),
    name: sub,
    title: rawTitle,
    auctionOrder: (idx + 1) * 10,
    categoryDisplayOrder: (idx + 1) * 10,
    auctionExtension: '3 min',
    priority: idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low',
    isObsolete: false,
    legacyTitle: '',
    vertical,
    effectiveDate: '',
    status: idx % 7 === 6 ? 'inactive' : 'active',
    heading: {
      level1: group,
      displayOrder1: String((idx + 1) * 10),
      level2: sub,
      displayOrder2: '100',
    },
    parentConfig: {
      displayName: '',
      parent1: '',
      parent2: '',
      parentDisplayOrder: '0',
    },
    industries: { industry1: industry, industry2: industry },
  }
}

const categories: Array<CategoryDefinition> = RAW_TITLES.map(buildCategory)

// ── Empty form defaults ────────────────────────────────────────────────────────

const emptyCategoryForm: CatFormState = {
  name: '',
  category: '',
  title: '',
  auctionOrder: '',
  auctionExtension: '3 min',
  priority: 'Medium',
  isObsolete: false,
  legacyTitle: '',
  vertical: '',
  effectiveDate: '',
  heading: { level1: '', displayOrder1: '', level2: '', displayOrder2: '' },
  parentConfig: {
    displayName: '',
    parent1: '',
    parent2: '',
    parentDisplayOrder: '',
  },
  industries: { industry1: '', industry2: '' },
  categoryDisplayOrder: '',
}

const emptyAttrForm: AttrFormState = {
  name: '',
  title: '',
  editor: 'Text',
  displayOrder: '',
  isOptional: true,
  appendToDescription: false,
  notInDescription: false,
  isSpecification: false,
  isChecklist: false,
  shouldHideOnSold: false,
  includeInNewChecklist: false,
  facet: '',
  prefix: '',
  value: '',
  suffix: '',
  units: '',
  unitsSeparator: '',
  isYesNo: false,
  omitYes: false,
  yesValue: '',
  omitNo: false,
  noValue: '',
  suppressSalebill: false,
  suppressNewspaper: false,
  values: '',
  notes: '',
  migration: 'None',
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function AnimateExpand({
  open,
  children,
}: {
  open: boolean
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [height, setHeight] = React.useState(0)
  const [visible, setVisible] = React.useState(open)

  React.useEffect(() => {
    if (open) {
      setVisible(true)
      requestAnimationFrame(() => {
        if (ref.current) setHeight(ref.current.scrollHeight)
      })
    } else {
      setHeight(0)
      const t = setTimeout(() => setVisible(false), 280)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!visible && !open) return null

  return (
    <div
      style={{
        maxHeight: height,
        overflow: 'hidden',
        transition: 'max-height 280ms ease-in-out',
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
  faIcon,
}: {
  title: string
  subtitle?: string
  faIcon?: string
}) {
  return (
    <div className="flex items-start gap-3 pb-3 mb-4 border-b">
      {faIcon && (
        <div className="p-2 bg-muted rounded-lg mt-0.5 flex items-center justify-center w-8 h-8">
          <i className={`${faIcon} text-sm text-muted-foreground`} />
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

function CategoryTypeahead({
  value,
  onChange,
  allCategories,
}: {
  value: string
  onChange: (v: string) => void
  allCategories: Array<string>
}) {
  const [inputVal, setInputVal] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const listRef = React.useRef<HTMLDivElement>(null)
  const filtered = allCategories
    .filter((c) => c.toLowerCase().includes(inputVal.toLowerCase()))
    .slice(0, 8)

  const select = (cat: string) => {
    setInputVal(cat)
    onChange(cat)
    setOpen(false)
    setActiveIdx(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) {
      if (e.key === 'ArrowDown' && filtered.length > 0) {
        setOpen(true)
        setActiveIdx(0)
        e.preventDefault()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => {
        const next = Math.min(i + 1, filtered.length - 1)
        scrollIntoView(next)
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => {
        const prev = Math.max(i - 1, 0)
        scrollIntoView(prev)
        return prev
      })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && activeIdx < filtered.length)
        select(filtered[activeIdx])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const scrollIntoView = (idx: number) => {
    const el = listRef.current?.children[idx] as HTMLElement | undefined
    el?.scrollIntoView({ block: 'nearest' })
  }

  return (
    <div className="relative">
      <input
        value={inputVal}
        onChange={(e) => {
          setInputVal(e.target.value)
          onChange(e.target.value)
          setOpen(true)
          setActiveIdx(-1)
        }}
        onBlur={() =>
          setTimeout(() => {
            setOpen(false)
            setActiveIdx(-1)
          }, 150)
        }
        onKeyDown={handleKeyDown}
        placeholder="e.g. Farm Equipment"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-xl overflow-auto max-h-56"
        >
          {filtered.map((cat, i) => (
            <button
              key={cat}
              type="button"
              onMouseDown={() => select(cat)}
              onMouseEnter={() => setActiveIdx(i)}
              className={cn(
                'w-full text-left px-3 py-2 text-sm text-foreground transition-colors',
                i === activeIdx ? 'bg-accent' : 'hover:bg-accent',
              )}
            >
              {cat}
            </button>
          ))}
          {!allCategories.includes(inputVal) && inputVal.trim() && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t italic">
              Press Enter to create "{inputVal}" as a new category
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function CategoryForm({
  form,
  setForm,
  allCategoryGroups,
}: {
  form: CatFormState
  setForm: React.Dispatch<React.SetStateAction<CatFormState>>
  allCategoryGroups: Array<string>
}) {
  const f = (field: keyof CatFormState, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: val }))
  const fh = (field: string, val: string) =>
    setForm((prev) => ({ ...prev, heading: { ...prev.heading, [field]: val } }))
  const fp = (field: string, val: string) =>
    setForm((prev) => ({
      ...prev,
      parentConfig: { ...prev.parentConfig, [field]: val },
    }))
  const fi = (field: string, val: string) =>
    setForm((prev) => ({
      ...prev,
      industries: { ...prev.industries, [field]: val },
    }))

  const autoTitle =
    form.category && form.name
      ? `${form.category} : ${form.name}`
      : form.category || form.name || ''

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div>
        <SectionHeader
          title="Basic Information"
          subtitle="Core identifiers and configuration"
          faIcon="fa-regular fa-address-card"
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <CategoryTypeahead
              value={form.category}
              onChange={(val) => {
                f('category', val)
                f('title', `${val}${form.name ? ' : ' + form.name : ''}`)
              }}
              allCategories={allCategoryGroups}
            />
            <p className="text-xs text-muted-foreground">
              Choose existing or type to create new
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>
              Subcategory <span className="text-destructive">*</span>
            </Label>
            <input
              value={form.name}
              onChange={(e) => {
                f('name', e.target.value)
                f(
                  'title',
                  `${form.category ? form.category + ' : ' : ''}${e.target.value}`,
                )
              }}
              placeholder="e.g. Tractors"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Title</Label>
            <input
              value={autoTitle}
              readOnly
              className="flex h-9 w-full rounded-md border border-input bg-muted px-3 py-1 text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated — read only
            </p>
          </div>
          <div className="space-y-1.5">
            <Label>Auction Order</Label>
            <input
              type="number"
              value={form.auctionOrder}
              onChange={(e) => f('auctionOrder', e.target.value)}
              placeholder="e.g. 1000"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Category Display Order</Label>
            <input
              type="number"
              value={form.categoryDisplayOrder}
              onChange={(e) => f('categoryDisplayOrder', e.target.value)}
              placeholder="e.g. 1970"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Auction Extension</Label>
            <div className="relative">
              <select
                value={form.auctionExtension}
                onChange={(e) => f('auctionExtension', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
              >
                {AUCTION_EXTENSIONS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <div className="relative">
              <select
                value={form.priority}
                onChange={(e) => f('priority', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
              >
                {PRIORITIES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Vertical</Label>
            <div className="relative">
              <select
                value={form.vertical}
                onChange={(e) => f('vertical', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
              >
                <option value="">Select vertical...</option>
                {VERTICALS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Effective Date</Label>
            <input
              type="date"
              value={form.effectiveDate || ''}
              onChange={(e) => f('effectiveDate', e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>Legacy Title</Label>
            <input
              value={form.legacyTitle}
              onChange={(e) => f('legacyTitle', e.target.value)}
              placeholder="e.g. Farm - Tractors"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Heading */}
      <div>
        <SectionHeader
          title="Heading"
          subtitle="Controls grouping in dropdown selection on sales site."
          faIcon="fa-solid fa-table"
        />
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: 'Level 1',
              key: 'level1',
              placeholder: 'e.g. Asphalt / Paving Equipment',
              hint: 'Primary heading group',
            },
            {
              label: 'Display Order 1',
              key: 'displayOrder1',
              placeholder: '230',
              type: 'number',
            },
            {
              label: 'Level 2',
              key: 'level2',
              placeholder: 'e.g. Burners',
              hint: 'Secondary heading group',
            },
            {
              label: 'Display Order 2',
              key: 'displayOrder2',
              placeholder: '100',
              type: 'number',
            },
          ].map(({ label, key, placeholder, hint, type }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <input
                type={type || 'text'}
                value={(form.heading as Record<string, string>)[key]}
                onChange={(e) => fh(key, e.target.value)}
                placeholder={placeholder}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Parent Config */}
      <div>
        <SectionHeader
          title="Parent Configuration"
          subtitle="Used for auction site display, grouping and ordering."
          faIcon="fa-solid fa-sitemap"
        />
        <div className="grid grid-cols-2 gap-4">
          {[
            {
              label: 'Display Name',
              key: 'displayName',
              placeholder: 'Display Name',
            },
            {
              label: 'Parent Display Order',
              key: 'parentDisplayOrder',
              placeholder: '0',
              type: 'number',
            },
            {
              label: 'Parent 1',
              key: 'parent1',
              placeholder: 'First level category',
              hint: 'First level category',
            },
            {
              label: 'Parent 2',
              key: 'parent2',
              placeholder: 'Second level category',
              hint: 'Second level category',
            },
          ].map(({ label, key, placeholder, hint, type }) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <input
                type={type || 'text'}
                value={(form.parentConfig as Record<string, string>)[key]}
                onChange={(e) => fp(key, e.target.value)}
                placeholder={placeholder}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <SectionHeader
          title="Industries"
          subtitle="Industries appear in the side navigation bar. A subcategory may belong to 1 or 2 industries."
          faIcon="fa-solid fa-industry"
        />
        <div className="grid grid-cols-2 gap-4">
          {['industry1', 'industry2'].map((key, i) => (
            <div key={key} className="space-y-1.5">
              <Label>Industry {i + 1}</Label>
              <div className="relative">
                <select
                  value={(form.industries as Record<string, string>)[key]}
                  onChange={(e) => fi(key, e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none"
                >
                  <option value="">None</option>
                  {INDUSTRIES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const selectCls =
  'flex h-9 w-full rounded-md border border-input bg-background pl-3 pr-8 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring appearance-none'
const inputCls =
  'flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<string>
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectCls}
        >
          {options.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  )
}

function AttributeForm({
  form,
  setForm,
}: {
  form: AttrFormState
  setForm: React.Dispatch<React.SetStateAction<AttrFormState>>
}) {
  const f = (field: string, val: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: val }))

  const flagFields: Array<[string, string]> = [
    ['isOptional', 'Is Optional?'],
    ['appendToDescription', 'Append to Description?'],
    ['notInDescription', 'Not in Description?'],
    ['isSpecification', 'Is Specification?'],
    ['isChecklist', 'Is Checklist?'],
    ['shouldHideOnSold', 'Should Hide on Sold?'],
    ['includeInNewChecklist', 'Include in New Checklist?'],
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>
            Name <span className="text-destructive">*</span>
          </Label>
          <input
            value={form.name}
            onChange={(e) => f('name', e.target.value)}
            placeholder="e.g. Model"
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Title <span className="text-destructive">*</span>
          </Label>
          <input
            value={form.title}
            onChange={(e) => f('title', e.target.value)}
            placeholder="e.g. Model"
            className={inputCls}
          />
        </div>
        <SelectField
          label="Editor"
          required
          value={form.editor}
          onChange={(v) => f('editor', v)}
          options={ATTRIBUTE_EDITORS}
        />
        <div className="space-y-1.5">
          <Label>Display Order</Label>
          <input
            type="number"
            value={form.displayOrder}
            onChange={(e) => f('displayOrder', e.target.value)}
            placeholder="30"
            className={inputCls}
          />
        </div>
      </div>

      <div className="p-3 bg-muted/50 rounded-lg border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Flags
        </p>
        <div className="grid grid-cols-2 gap-2">
          {flagFields.map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <Checkbox
                id={`attr-${key}`}
                checked={form[key] as boolean}
                onCheckedChange={(val) => f(key, !!val)}
              />
              <label htmlFor={`attr-${key}`} className="text-sm cursor-pointer">
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SelectField
          label="Facet"
          value={form.facet || 'None'}
          onChange={(v) => f('facet', v)}
          options={FACET_OPTIONS}
        />
        {(
          ['prefix', 'value', 'suffix', 'units', 'unitsSeparator'] as const
        ).map((k) => (
          <div key={k} className="space-y-1.5">
            <Label>
              {k === 'unitsSeparator'
                ? 'Units Separator'
                : k.charAt(0).toUpperCase() + k.slice(1)}
            </Label>
            <input
              value={form[k] as string}
              onChange={(e) => f(k, e.target.value)}
              className={inputCls}
            />
          </div>
        ))}
      </div>

      <div className="p-3 bg-muted/50 rounded-lg border space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Yes / No
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="attr-isYesNo"
                checked={form.isYesNo}
                onCheckedChange={(val) => f('isYesNo', !!val)}
              />
              <label htmlFor="attr-isYesNo" className="text-sm cursor-pointer">
                Is Yes/No?
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="attr-omitYes"
                checked={form.omitYes}
                onCheckedChange={(val) => f('omitYes', !!val)}
              />
              <label htmlFor="attr-omitYes" className="text-sm cursor-pointer">
                Omit Yes?
              </label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Yes Value</Label>
              <input
                value={form.yesValue}
                onChange={(e) => f('yesValue', e.target.value)}
                placeholder="YesValue"
                className={inputCls}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 invisible">
              {/* spacer */}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="attr-omitNo"
                checked={form.omitNo}
                onCheckedChange={(val) => f('omitNo', !!val)}
              />
              <label htmlFor="attr-omitNo" className="text-sm cursor-pointer">
                Omit No?
              </label>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">No Value</Label>
              <input
                value={form.noValue}
                onChange={(e) => f('noValue', e.target.value)}
                placeholder="NoValue"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="attr-suppressSalebill"
            checked={form.suppressSalebill}
            onCheckedChange={(val) => f('suppressSalebill', !!val)}
          />
          <label
            htmlFor="attr-suppressSalebill"
            className="text-sm cursor-pointer"
          >
            Suppress Salebill?
          </label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="attr-suppressNewspaper"
            checked={form.suppressNewspaper}
            onCheckedChange={(val) => f('suppressNewspaper', !!val)}
          />
          <label
            htmlFor="attr-suppressNewspaper"
            className="text-sm cursor-pointer"
          >
            Suppress Newspaper?
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Values</Label>
        <Textarea
          value={form.values}
          onChange={(e) => f('values', e.target.value)}
          placeholder="Comma-separated list of allowed values"
          rows={2}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Notes</Label>
        <Textarea
          value={form.notes}
          onChange={(e) => f('notes', e.target.value)}
          placeholder="e.g. Model. For example, '4440' or 'F-150'"
          rows={2}
        />
      </div>

      <SelectField
        label="Migration"
        value={form.migration || 'None'}
        onChange={(v) => f('migration', v)}
        options={MIGRATION_OPTIONS}
      />
    </div>
  )
}

// ── Dashboard Wrapper ──────────────────────────────────────────────────────────

function DashboardWrapper({ children }: { children: React.ReactNode }) {
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
                <BreadcrumbLink href="#" onClick={handleBreadcrumbClick}>
                  Dashboards
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Category Definitions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto h-5 flex items-center gap-2 px-3">
          <span className="hidden md:block text-sm text-muted-foreground px-2">
            v1.0.0
          </span>
          <Separator orientation="vertical" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8">
                <span className="text-sm font-medium">{currentUser.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {currentUser.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" />
          <ButtonToggle />
        </div>
      </header>
      {children}
    </SidebarInset>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

function CategoryDefinitions() {
  // Load Font Awesome
  React.useEffect(() => {
    if (!document.getElementById('fa-cdn')) {
      const link = document.createElement('link')
      link.id = 'fa-cdn'
      link.rel = 'stylesheet'
      link.href =
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
      document.head.appendChild(link)
    }
  }, [])

  const catTableRef = useRef<HTMLDivElement>(null)
  const attrTableRef = useRef<HTMLDivElement>(null)
  const allAttrTableRef = useRef<HTMLDivElement>(null)
  const [cats, setCats] = useState<Array<CategoryDefinition>>(categories)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive'>(
    'active',
  )
  const [industryFilter, setIndustryFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [sortCol, setSortCol] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [attrSortCol, setAttrSortCol] = useState<
    'name' | 'displayOrder' | null
  >(null)
  const [attrSortDir, setAttrSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 20

  // Modals
  const [showCreate, setShowCreate] = useState(false)
  const [editingCat, setEditingCat] = useState<CategoryDefinition | null>(null)
  const [catForm, setCatForm] = useState<CatFormState>(emptyCategoryForm)
  const [deletingCat, setDeletingCat] = useState<CategoryDefinition | null>(
    null,
  )
  const [deletingAttr, setDeletingAttr] = useState<Attribute | null>(null)
  const [attrsCat, setAttrsCat] = useState<CategoryDefinition | null>(null)
  const [attrs, setAttrs] = useState<Array<Attribute>>(mockAttributes)
  const [editingAttr, setEditingAttr] = useState<
    Attribute | { id: string } | null
  >(null)
  const [attrForm, setAttrForm] = useState<AttrFormState>(emptyAttrForm)
  const [changeLogCat, setChangeLogCat] = useState<{
    id: string | null
    name: string
  } | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showAllAttrs, setShowAllAttrs] = useState(false)
  const [toggleConfirm, setToggleConfirm] = useState<{
    cat: CategoryDefinition
    newStatus: 'active' | 'inactive'
  } | null>(null)

  const uniqueGroups = useMemo(
    () => [...new Set(cats.map((c) => c.heading.level1))].sort(),
    [cats],
  )

  const stats = useMemo(
    () => ({
      total: cats.length,
      groups: new Set(cats.map((c) => c.heading.level1)).size,
      active: cats.filter((c) => c.status === 'active' && !c.isObsolete).length,
      inactive: cats.filter((c) => c.status === 'inactive' || c.isObsolete)
        .length,
    }),
    [cats],
  )

  const filtered = useMemo(() => {
    let result = cats.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.industries.industry1.toLowerCase().includes(search.toLowerCase())
      const matchStatus =
        statusFilter === 'active'
          ? c.status === 'active' && !c.isObsolete
          : c.status === 'inactive' || c.isObsolete
      const matchIndustry =
        !industryFilter ||
        c.industries.industry1 === industryFilter ||
        c.industries.industry2 === industryFilter
      const matchGroup = !groupFilter || c.heading.level1 === groupFilter
      return matchSearch && matchStatus && matchIndustry && matchGroup
    })
    if (sortCol) {
      result = [...result].sort((a, b) => {
        let av = '',
          bv = ''
        switch (sortCol) {
          case 'name':
            av = a.name
            bv = b.name
            break
          case 'category':
            av = a.heading.level1
            bv = b.heading.level1
            break
          case 'order':
            av = String(a.auctionOrder)
            bv = String(b.auctionOrder)
            break
          case 'industry':
            av = a.industries.industry1
            bv = b.industries.industry1
            break
          case 'priority':
            av = a.priority
            bv = b.priority
            break
          default:
            return 0
        }
        if (av < bv) return sortDir === 'asc' ? -1 : 1
        if (av > bv) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [
    cats,
    search,
    statusFilter,
    industryFilter,
    groupFilter,
    sortCol,
    sortDir,
  ])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const handleAttrSort = (col: 'name' | 'displayOrder') => {
    if (attrSortCol === col)
      setAttrSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setAttrSortCol(col)
      setAttrSortDir('asc')
    }
  }

  const sortedAttrs = useMemo(() => {
    if (!attrSortCol) return attrs
    return [...attrs].sort((a, b) => {
      const av = attrSortCol === 'name' ? a.name.toLowerCase() : a.displayOrder
      const bv = attrSortCol === 'name' ? b.name.toLowerCase() : b.displayOrder
      if (av < bv) return attrSortDir === 'asc' ? -1 : 1
      if (av > bv) return attrSortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [attrs, attrSortCol, attrSortDir])

  const handleCreateCategory = () => {
    if (!catForm.name || !catForm.title) {
      alert('Name and Title are required')
      return
    }
    setCats((prev) => [
      {
        ...catForm,
        id: `c${Date.now()}`,
        guid: seededGuid(Date.now()),
        status: 'active',
        auctionOrder: Number(catForm.auctionOrder),
        categoryDisplayOrder: Number(catForm.categoryDisplayOrder),
      } as CategoryDefinition,
      ...prev,
    ])
    setShowCreate(false)
    setCatForm(emptyCategoryForm)
  }

  const handleSaveEdit = () => {
    setCats((prev) =>
      prev.map((c) =>
        c.id === editingCat?.id
          ? ({
              ...c,
              ...catForm,
              auctionOrder: Number(catForm.auctionOrder),
              categoryDisplayOrder: Number(catForm.categoryDisplayOrder),
            } as CategoryDefinition)
          : c,
      ),
    )
    setEditingCat(null)
    setCatForm(emptyCategoryForm)
  }

  const handleDelete = () => {
    setCats((prev) => prev.filter((c) => c.id !== deletingCat?.id))
    setDeletingCat(null)
  }

  const handleToggleStatus = () => {
    if (!toggleConfirm) return
    setCats((prev) =>
      prev.map((c) =>
        c.id === toggleConfirm.cat.id
          ? { ...c, status: toggleConfirm.newStatus, isObsolete: false }
          : c,
      ),
    )
    setToggleConfirm(null)
  }

  const openEdit = (cat: CategoryDefinition) => {
    setEditingCat(cat)
    setCatForm({
      ...cat,
      category: cat.heading.level1,
      auctionOrder: String(cat.auctionOrder),
      categoryDisplayOrder: String(cat.categoryDisplayOrder),
      effectiveDate: cat.effectiveDate || '',
    })
  }

  const handleSaveAttr = () => {
    if (!attrForm.name || !attrForm.title) {
      alert('Name and Title are required')
      return
    }
    if (editingAttr && editingAttr.id !== 'new') {
      setAttrs((prev) =>
        prev.map((a) =>
          a.id === editingAttr.id
            ? ({
                ...a,
                ...attrForm,
                displayOrder: Number(attrForm.displayOrder),
              } as Attribute)
            : a,
        ),
      )
    } else {
      setAttrs((prev) => [
        ...prev,
        {
          ...attrForm,
          id: `a${Date.now()}`,
          displayOrder: Number(attrForm.displayOrder),
        } as Attribute,
      ])
    }
    setEditingAttr(null)
    setAttrForm(emptyAttrForm)
  }

  const openEditAttr = (attr: Attribute) => {
    setEditingAttr(attr)
    setAttrForm({
      ...attr,
      displayOrder: String(attr.displayOrder),
    } as AttrFormState)
  }

  const changeLog = mockChangeLog.filter(
    (e) =>
      !changeLogCat ||
      changeLogCat.id === null ||
      e.categoryId === changeLogCat.id,
  )
  const activeFiltersCount = [search, industryFilter, groupFilter].filter(
    Boolean,
  ).length

  const SortHead = ({ col, label }: { col: string; label: string }) => (
    <TableHead>
      <button
        onClick={() => handleSort(col)}
        className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
      >
        {label}
        <ArrowUpDown
          className={cn(
            'h-4 w-4',
            sortCol === col ? 'text-foreground' : 'text-muted-foreground',
          )}
        />
      </button>
    </TableHead>
  )

  const AttrSortHead = ({
    col,
    label,
  }: {
    col: 'name' | 'displayOrder'
    label: string
  }) => (
    <TableHead>
      <button
        onClick={() => handleAttrSort(col)}
        className="flex items-center gap-1 hover:text-foreground transition-colors font-medium"
      >
        {label}
        <ArrowUpDown
          className={cn(
            'h-4 w-4',
            attrSortCol === col ? 'text-foreground' : 'text-muted-foreground',
          )}
        />
      </button>
    </TableHead>
  )

  return (
    <SidebarProvider>
      <AppSidebar />
      <DashboardWrapper>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-sidebar">
          {/* ── CHANGE 1: Smaller heading on mobile ── */}
          <h1 className="text-base font-semibold sm:text-xl md:text-2xl">
            Category Definitions
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Categories', value: stats.groups, icon: Layers },
              {
                label: 'Total Subcategories',
                value: stats.total,
                icon: FolderTree,
              },
              { label: 'Active', value: stats.active, icon: CheckCircle },
              { label: 'Inactive', value: stats.inactive, icon: EyeOff },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="pb-2">
                  <CardDescription className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main table card */}
          <Card>
            <CardHeader>
              {/* ── CHANGE 2: Responsive button layout ──
                  Mobile:  Title + description
                           Change Log | All Attributes  (full-width row)
                           Add Subcategory              (full-width row)
                  Desktop: Title + description  |  [Change Log] [All Attributes] [Add Subcategory]
              */}
              <div className="flex flex-col gap-3">
                {/* Row 1: title + desktop buttons */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle>Category Records</CardTitle>
                    <CardDescription>
                      Manage category definitions, attributes, and display
                      settings
                    </CardDescription>
                  </div>
                  {/* Desktop: all three buttons in a row */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChangeLogCat({ id: null, name: 'All' })}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Change Log
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllAttrs(true)}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      All Attributes
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCatForm(emptyCategoryForm)
                        setShowCreate(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>
                </div>
                {/* Mobile: Change Log + All Attributes */}
                <div className="flex items-center gap-2 sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setChangeLogCat({ id: null, name: 'All' })}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Change Log
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowAllAttrs(true)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    All Attributes
                  </Button>
                </div>
                {/* Mobile: Add Subcategory */}
                <div className="sm:hidden">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setCatForm(emptyCategoryForm)
                      setShowCreate(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subcategory
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as 'active' | 'inactive')
                  setPage(1)
                }}
              >
                <div className="flex flex-col gap-4">
                  {/* Search + Filters */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                          }}
                          placeholder="Search by name, title, or industry..."
                          className="pl-9 bg-background"
                        />
                      </div>
                      <Button
                        variant={
                          showFilters || activeFiltersCount > 0
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-1 rounded-full text-xs"
                          >
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </div>

                    {/* ── CHANGE 3: Animated filter panel using CSS grid trick ── */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateRows: showFilters ? '1fr' : '0fr',
                        transition: 'grid-template-rows 250ms ease-in-out',
                      }}
                    >
                      <div style={{ overflow: 'hidden' }}>
                        <div className="flex flex-wrap items-end gap-3 p-3 bg-muted/40 rounded-lg border mt-1">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Industry
                            </label>
                            <Select
                              value={industryFilter}
                              onValueChange={(v) => {
                                setIndustryFilter(v === '_all' ? '' : v)
                                setPage(1)
                              }}
                            >
                              <SelectTrigger className="w-40 h-8 text-xs">
                                <SelectValue placeholder="All Industries" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="_all">
                                  All Industries
                                </SelectItem>
                                {INDUSTRIES.map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">
                              Category
                            </label>
                            <Select
                              value={groupFilter}
                              onValueChange={(v) => {
                                setGroupFilter(v === '_all' ? '' : v)
                                setPage(1)
                              }}
                            >
                              <SelectTrigger className="w-56 h-8 text-xs">
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="_all">
                                  All Categories
                                </SelectItem>
                                {uniqueGroups.map((v) => (
                                  <SelectItem key={v} value={v}>
                                    {v}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearch('')
                              setIndustryFilter('')
                              setGroupFilter('')
                              setStatusFilter('active')
                              setPage(1)
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Active filter badges */}
                    {(search || industryFilter || groupFilter) && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {search && (
                          <Badge
                            variant="secondary"
                            className="gap-2 pl-3 pr-2"
                          >
                            Search: {search}
                            <button
                              onClick={() => setSearch('')}
                              className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {industryFilter && (
                          <Badge
                            variant="secondary"
                            className="gap-2 pl-3 pr-2"
                          >
                            Industry: {industryFilter}
                            <button
                              onClick={() => setIndustryFilter('')}
                              className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {groupFilter && (
                          <Badge
                            variant="secondary"
                            className="gap-2 pl-3 pr-2"
                          >
                            Category: {groupFilter}
                            <button
                              onClick={() => setGroupFilter('')}
                              className="hover:bg-muted-foreground/20 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tabs */}
                  <TabsList className="rounded-[12px] w-fit">
                    <TabsTrigger
                      value="active"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      Active
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {stats.active}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="inactive"
                      className="gap-2 cursor-pointer rounded-[10px]"
                    >
                      Inactive
                      <Badge
                        variant="secondary"
                        className="ml-1 rounded-full bg-muted text-muted-foreground font-semibold"
                      >
                        {stats.inactive}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={statusFilter} className="mt-0">
                  <div
                    ref={catTableRef}
                    className="rounded-md border overflow-x-auto"
                  >
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <SortHead col="name" label="Subcategory" />
                          <SortHead col="category" label="Category" />
                          <SortHead col="industry" label="Industry" />
                          <SortHead col="priority" label="Priority" />
                          <SortHead col="order" label="Order" />
                          <TableHead>Status</TableHead>
                          <TableHead className="sticky right-0 bg-muted text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginated.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center h-24 text-muted-foreground"
                            >
                              No categories found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginated.map((cat) => (
                            <TableRow key={cat.id}>
                              <TableCell className="font-medium">
                                {cat.name}
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-muted-foreground truncate block max-w-[200px]">
                                  {cat.heading.level1}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {cat.industries.industry1 && (
                                    <Badge variant="secondary">
                                      {cat.industries.industry1}
                                    </Badge>
                                  )}
                                  {cat.industries.industry2 &&
                                    cat.industries.industry2 !==
                                      cat.industries.industry1 && (
                                      <Badge variant="secondary">
                                        {cat.industries.industry2}
                                      </Badge>
                                    )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span
                                  className={cn(
                                    'text-xs font-medium',
                                    cat.priority === 'High'
                                      ? 'text-destructive'
                                      : cat.priority === 'Medium'
                                        ? 'text-amber-600'
                                        : 'text-muted-foreground',
                                  )}
                                >
                                  {cat.priority}
                                </span>
                              </TableCell>
                              <TableCell className="tabular-nums text-muted-foreground">
                                {cat.auctionOrder}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider delayDuration={600}>
                                  <Tooltip delayDuration={700}>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() =>
                                          setToggleConfirm({
                                            cat,
                                            newStatus:
                                              cat.status === 'active'
                                                ? 'inactive'
                                                : 'active',
                                          })
                                        }
                                        className="cursor-pointer"
                                      >
                                        <Badge
                                          variant="secondary"
                                          className={cn(
                                            'gap-1',
                                            cat.status === 'active' &&
                                              'bg-green-600 text-white border-green-600 hover:bg-green-700',
                                          )}
                                        >
                                          {cat.status === 'active' ? (
                                            <>
                                              <CheckCircle className="h-3 w-3" />
                                              Active
                                            </>
                                          ) : (
                                            <>
                                              <EyeOff className="h-3 w-3" />
                                              Inactive
                                            </>
                                          )}
                                        </Badge>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {cat.status === 'active'
                                        ? 'Click to deactivate'
                                        : 'Click to activate'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell className="sticky right-0 bg-background text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                                <div className="flex items-center justify-end gap-1">
                                  <TooltipProvider delayDuration={600}>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => openEdit(cat)}
                                          className="h-7 w-7 p-0"
                                        >
                                          <Edit2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Edit Subcategory
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setAttrsCat(cat)}
                                          className="h-7 w-7 p-0"
                                        >
                                          <List className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Manage Attributes
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setChangeLogCat(cat)}
                                          className="h-7 w-7 p-0"
                                        >
                                          <Clock className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        View Change Log
                                      </TooltipContent>
                                    </Tooltip>
                                    <Tooltip delayDuration={700}>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setDeletingCat(cat)}
                                          className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Delete Category
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      Showing{' '}
                      {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
                      {Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
                      {filtered.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        ← Prev
                      </Button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const p =
                            page <= 3
                              ? i + 1
                              : page >= totalPages - 2
                                ? totalPages - 4 + i
                                : page - 2 + i
                          if (p < 1 || p > totalPages) return null
                          return (
                            <Button
                              key={p}
                              variant={p === page ? 'default' : 'ghost'}
                              size="sm"
                              onClick={() => setPage(p)}
                              className="w-8 h-8 p-0"
                            >
                              {p}
                            </Button>
                          )
                        },
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                      >
                        Next →
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </DashboardWrapper>

      {/* ── Create Category Dialog ── */}
      <Dialog
        open={showCreate}
        onOpenChange={(o) => !o && setShowCreate(false)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Subcategory</DialogTitle>
            <DialogDescription>
              Create a new subcategory definition
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            form={catForm}
            setForm={setCatForm}
            allCategoryGroups={uniqueGroups}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory}>Create Subcategory</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Category Dialog ── */}
      <Dialog
        open={!!editingCat}
        onOpenChange={(o) => !o && setEditingCat(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit — {editingCat?.name}</DialogTitle>
            {editingCat?.guid && (
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center font-mono text-[11px] bg-gray-900 text-gray-100 rounded px-2 py-0.5 tracking-wide select-all">
                  {editingCat.guid}
                </span>
              </div>
            )}
            <DialogDescription>
              Update subcategory definition details
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            form={catForm}
            setForm={setCatForm}
            allCategoryGroups={uniqueGroups}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCat(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog
        open={!!deletingCat}
        onOpenChange={(o) => !o && setDeletingCat(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-2">
            <div className="p-3 bg-destructive/10 rounded-xl shrink-0 self-start">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium !mb-0">
                Are you sure you want to delete "{deletingCat?.name}"?
              </p>
              <p className="text-sm text-muted-foreground">
                All associated data including attributes will be removed.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCat(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Attribute Confirm ── */}
      <Dialog
        open={!!deletingAttr}
        onOpenChange={(o) => !o && setDeletingAttr(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Attribute</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 py-2">
            <div className="p-3 bg-destructive/10 rounded-xl shrink-0 self-start">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium !mb-0">
                Are you sure you want to delete "{deletingAttr?.name}"?
              </p>
              <p className="text-sm text-muted-foreground">
                This attribute will be removed from all categories.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAttr(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setAttrs((a) => a.filter((x) => x.id !== deletingAttr?.id))
                setDeletingAttr(null)
              }}
            >
              Delete Attribute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Toggle Status Confirm ── */}
      <Dialog
        open={!!toggleConfirm}
        onOpenChange={(o) => !o && setToggleConfirm(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
          </DialogHeader>
          {toggleConfirm && (
            <>
              <div className="flex gap-4 py-2">
                <div
                  className={cn(
                    'p-3 rounded-xl shrink-0',
                    toggleConfirm.newStatus === 'inactive'
                      ? 'bg-amber-50'
                      : 'bg-green-50',
                  )}
                >
                  {toggleConfirm.newStatus === 'inactive' ? (
                    <EyeOff className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">
                    {toggleConfirm.newStatus === 'inactive'
                      ? `Deactivate "${toggleConfirm.cat.name}"?`
                      : `Activate "${toggleConfirm.cat.name}"?`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {toggleConfirm.newStatus === 'inactive'
                      ? 'This subcategory will no longer be available for new listings.'
                      : 'This subcategory will become available for new listings.'}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setToggleConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant={
                    toggleConfirm.newStatus === 'inactive'
                      ? 'destructive'
                      : 'default'
                  }
                  onClick={handleToggleStatus}
                >
                  {toggleConfirm.newStatus === 'inactive'
                    ? 'Deactivate'
                    : 'Activate'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Attributes Modal (per-category) ── */}
      <Dialog
        open={!!attrsCat}
        onOpenChange={(o) => {
          if (!o) {
            setAttrsCat(null)
            setEditingAttr(null)
            setAttrForm(emptyAttrForm)
          }
        }}
      >
        <DialogContent className="!max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>Attributes — {attrsCat?.name}</DialogTitle>
            <DialogDescription>
              {attrs.length} attributes configured
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Manage attributes for this category. Attributes define the
                fields shown when listing items.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditingAttr({ id: 'new' })
                  setAttrForm(emptyAttrForm)
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Attribute
              </Button>
            </div>

            {editingAttr?.id === 'new' && (
              <div className="border border-amber-200 dark:border-amber-700/50 rounded-lg bg-amber-50/60 dark:bg-amber-900/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200 dark:border-amber-700/50">
                  <span className="text-sm font-semibold">New Attribute</span>
                  <button
                    onClick={() => {
                      setEditingAttr(null)
                      setAttrForm(emptyAttrForm)
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <AttributeForm form={attrForm} setForm={setAttrForm} />
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-amber-200 dark:border-amber-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAttr(null)
                        setAttrForm(emptyAttrForm)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveAttr}>
                      Save Attribute
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={attrTableRef}
              className="rounded-md border overflow-x-auto"
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <AttrSortHead col="name" label="Name" />
                    <TableHead>Editor</TableHead>
                    <AttrSortHead col="displayOrder" label="Order" />
                    <TableHead>Flags</TableHead>
                    <TableHead className="sticky right-0 bg-muted text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAttrs.map((attr) => (
                    <React.Fragment key={attr.id}>
                      <TableRow
                        className={cn(
                          editingAttr &&
                            'id' in editingAttr &&
                            editingAttr.id === attr.id
                            ? 'bg-amber-50 dark:bg-amber-900/10'
                            : '',
                        )}
                      >
                        <TableCell>
                          <span className="font-medium text-sm">
                            {attr.name}
                          </span>
                          {attr.isObsolete && (
                            <span className="ml-2 text-xs text-muted-foreground italic">
                              (obsolete)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{attr.editor}</Badge>
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {attr.displayOrder}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {attr.isOptional && (
                              <Badge variant="secondary" className="text-xs">
                                Optional
                              </Badge>
                            )}
                            {attr.isSpecification && (
                              <Badge variant="secondary" className="text-xs">
                                Spec
                              </Badge>
                            )}
                            {attr.notInDescription && (
                              <Badge variant="secondary" className="text-xs">
                                No Desc
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="sticky right-0 bg-background text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                          <TooltipProvider delayDuration={600}>
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      editingAttr &&
                                      'id' in editingAttr &&
                                      editingAttr.id === attr.id
                                        ? (setEditingAttr(null),
                                          setAttrForm(emptyAttrForm))
                                        : openEditAttr(attr)
                                    }
                                    className={cn(
                                      'h-6 w-6 p-0',
                                      editingAttr &&
                                        'id' in editingAttr &&
                                        editingAttr.id === attr.id
                                        ? 'text-amber-600 bg-amber-100'
                                        : '',
                                    )}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {editingAttr &&
                                  'id' in editingAttr &&
                                  editingAttr.id === attr.id
                                    ? 'Collapse'
                                    : 'Edit'}
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeletingAttr(attr)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <MoveUp className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Move Up</TooltipContent>
                              </Tooltip>
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                  >
                                    <MoveDown className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Move Down</TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={5} className="p-0 border-0">
                          <AnimateExpand
                            open={
                              !!(
                                editingAttr &&
                                'id' in editingAttr &&
                                editingAttr.id === attr.id
                              )
                            }
                          >
                            <div className="bg-amber-50/60 dark:bg-amber-900/10 px-4 py-4 border-b-2 border-amber-200 dark:border-amber-700/50">
                              <AttributeForm
                                form={attrForm}
                                setForm={setAttrForm}
                              />
                              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-amber-200 dark:border-amber-700/40">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingAttr(null)
                                    setAttrForm(emptyAttrForm)
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={handleSaveAttr}>
                                  Save Attribute
                                </Button>
                              </div>
                            </div>
                          </AnimateExpand>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="px-6 py-4 border-t shrink-0 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setAttrsCat(null)
                setEditingAttr(null)
                setAttrForm(emptyAttrForm)
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── All Attributes Modal ── */}
      <Dialog
        open={showAllAttrs}
        onOpenChange={(o) => {
          if (!o) {
            setShowAllAttrs(false)
            setEditingAttr(null)
            setAttrForm(emptyAttrForm)
          }
        }}
      >
        <DialogContent className="!max-w-5xl max-h-[85vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
            <DialogTitle>All Attributes</DialogTitle>
            <DialogDescription>
              {attrs.length} attributes across all categories
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                All available attributes that can be assigned to category
                definitions.
              </p>
              <Button
                size="sm"
                onClick={() => {
                  setEditingAttr({ id: 'new' })
                  setAttrForm(emptyAttrForm)
                }}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Attribute
              </Button>
            </div>

            {editingAttr?.id === 'new' && (
              <div className="border border-amber-200 dark:border-amber-700/50 rounded-lg bg-amber-50/60 dark:bg-amber-900/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-amber-200 dark:border-amber-700/50">
                  <span className="text-sm font-semibold">New Attribute</span>
                  <button
                    onClick={() => {
                      setEditingAttr(null)
                      setAttrForm(emptyAttrForm)
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <AttributeForm form={attrForm} setForm={setAttrForm} />
                  <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-amber-200 dark:border-amber-700/50">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAttr(null)
                        setAttrForm(emptyAttrForm)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveAttr}>
                      Save Attribute
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div
              ref={allAttrTableRef}
              className="rounded-md border overflow-x-auto"
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  <TableRow>
                    <AttrSortHead col="name" label="Name" />
                    <TableHead>Editor</TableHead>
                    <AttrSortHead col="displayOrder" label="Order" />
                    <TableHead>Flags</TableHead>
                    <TableHead className="sticky right-0 bg-muted text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedAttrs.map((attr) => (
                    <React.Fragment key={attr.id}>
                      <TableRow
                        className={cn(
                          editingAttr &&
                            'id' in editingAttr &&
                            editingAttr.id === attr.id
                            ? 'bg-amber-50 dark:bg-amber-900/10'
                            : '',
                        )}
                      >
                        <TableCell>
                          <span className="font-medium text-sm">
                            {attr.name}
                          </span>
                          {attr.isObsolete && (
                            <span className="ml-2 text-xs text-muted-foreground italic">
                              (obsolete)
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{attr.editor}</Badge>
                        </TableCell>
                        <TableCell className="tabular-nums text-muted-foreground">
                          {attr.displayOrder}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {attr.isOptional && (
                              <Badge variant="secondary" className="text-xs">
                                Optional
                              </Badge>
                            )}
                            {attr.isSpecification && (
                              <Badge variant="secondary" className="text-xs">
                                Spec
                              </Badge>
                            )}
                            {attr.notInDescription && (
                              <Badge variant="secondary" className="text-xs">
                                No Desc
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="sticky right-0 bg-background text-right whitespace-nowrap w-px after:absolute after:inset-y-0 after:left-0 after:w-px after:bg-border">
                          <TooltipProvider delayDuration={600}>
                            <div className="flex items-center justify-end gap-1">
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      editingAttr &&
                                      'id' in editingAttr &&
                                      editingAttr.id === attr.id
                                        ? (setEditingAttr(null),
                                          setAttrForm(emptyAttrForm))
                                        : openEditAttr(attr)
                                    }
                                    className={cn(
                                      'h-6 w-6 p-0',
                                      editingAttr &&
                                        'id' in editingAttr &&
                                        editingAttr.id === attr.id
                                        ? 'text-amber-600 bg-amber-100'
                                        : '',
                                    )}
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {editingAttr &&
                                  'id' in editingAttr &&
                                  editingAttr.id === attr.id
                                    ? 'Collapse'
                                    : 'Edit'}
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip delayDuration={700}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeletingAttr(attr)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete</TooltipContent>
                              </Tooltip>
                            </div>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                      <TableRow className="border-0">
                        <TableCell colSpan={6} className="p-0 border-0">
                          <AnimateExpand
                            open={
                              !!(
                                editingAttr &&
                                'id' in editingAttr &&
                                editingAttr.id === attr.id
                              )
                            }
                          >
                            <div className="bg-amber-50/60 dark:bg-amber-900/10 px-4 py-4 border-b-2 border-amber-200 dark:border-amber-700/50">
                              <AttributeForm
                                form={attrForm}
                                setForm={setAttrForm}
                              />
                              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-amber-200 dark:border-amber-700/40">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingAttr(null)
                                    setAttrForm(emptyAttrForm)
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button size="sm" onClick={handleSaveAttr}>
                                  Save Attribute
                                </Button>
                              </div>
                            </div>
                          </AnimateExpand>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="px-6 py-4 border-t shrink-0 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowAllAttrs(false)
                setEditingAttr(null)
                setAttrForm(emptyAttrForm)
              }}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Change Log Modal ── */}
      <Dialog
        open={!!changeLogCat}
        onOpenChange={(o) => !o && setChangeLogCat(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {changeLogCat?.id
                ? `Change Log — ${changeLogCat.name}`
                : 'Change Log — All Categories'}
            </DialogTitle>
            <DialogDescription>Audit trail of modifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {changeLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No changes recorded
              </p>
            ) : (
              changeLog.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg border"
                >
                  <div className="p-2 bg-foreground/10 rounded-lg shrink-0">
                    <RotateCcw className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">
                        {cats.find((c) => c.id === entry.categoryId)?.name ||
                          entry.categoryId}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                        {entry.field}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="line-through text-destructive">
                        {entry.oldValue || '(empty)'}
                      </span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-green-600 font-medium">
                        {entry.newValue || '(empty)'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        by{' '}
                        <span className="font-medium text-foreground">
                          {entry.user}
                        </span>
                      </span>
                      <span>{entry.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeLogCat(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
