import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-2xl border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        location:
          'border-transparent bg-green-600 text-background [a&]:hover:bg-blue-400/80',
        draft:
          'border-transparent bg-blue-200 text-foreground [a&]:hover:bg-blue-300/80',
        archived:
          'border-transparent bg-gray-100 text-muted-foreground [a&]:hover:bg-gray-100/80',
        successful:
          'border-transparent bg-[oklch(0.627_0.194_149.214)] text-white [a&]:hover:bg-[oklch(0.627_0.194_149.214)]/80 dark:bg-[oklch(0.627_0.194_149.214)] dark:text-white dark:[a&]:hover:bg-[oklch(0.627_0.194_149.214)]/80',
        warning:
          'border-transparent bg-[oklab(0.768999_0.0640533_0.176752)] text-black [a&]:hover:bg-[oklab(0.768999_0.0640533_0.176752)]/80 dark:bg-[oklab(0.768999_0.0640533_0.176752)] dark:text-black dark:[a&]:hover:bg-[oklab(0.768999_0.0640533_0.176752)]/80',
        neutral:
          'border-transparent bg-black text-white [a&]:hover:bg-black/80 dark:bg-black dark:text-white dark:[a&]:hover:bg-black/80',
        information:
          'border-transparent bg-blue-600 text-white [a&]:hover:bg-blue-600/80 dark:bg-blue-600 dark:text-white dark:[a&]:hover:bg-blue-600/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
