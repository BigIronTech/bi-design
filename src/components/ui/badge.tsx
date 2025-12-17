import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-lg border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-[oklab(0.768999_0.0640533_0.176752)] bg-[oklab(0.768999_0.0640533_0.176752)]/10 text-[oklab(0.668999_0.0640533_0.176752)] [a&]:hover:bg-[oklab(0.768999_0.0640533_0.176752)]/20 dark:border-[oklab(0.768999_0.0640533_0.176752)] dark:text-[oklab(0.868999_0.0640533_0.176752)]',
        secondary:
          'border-border bg-secondary/50 text-secondary-foreground [a&]:hover:bg-secondary',
        destructive:
          'border-destructive bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20 dark:border-destructive dark:text-destructive',
        outline:
          'border-border bg-background text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        location:
          'border-transparent bg-green-600 text-background [a&]:hover:bg-blue-400/80',
        draft:
          'border-transparent bg-blue-200 text-foreground [a&]:hover:bg-blue-300/80',
        archived:
          'border-transparent bg-gray-100 text-muted-foreground [a&]:hover:bg-gray-100/80',
        brand:
          'border-[oklch(0.627_0.194_149.214)] bg-[oklch(0.627_0.194_149.214)]/10 text-[oklch(0.527_0.194_149.214)] [a&]:hover:bg-[oklch(0.627_0.194_149.214)]/20 dark:border-[oklch(0.627_0.194_149.214)] dark:text-[oklch(0.727_0.194_149.214)]',
        warning:
          'border-[oklab(0.768999_0.0640533_0.176752)] bg-[oklab(0.768999_0.0640533_0.176752)]/10 text-[oklab(0.668999_0.0640533_0.176752)] [a&]:hover:bg-[oklab(0.768999_0.0640533_0.176752)]/20 dark:border-[oklab(0.768999_0.0640533_0.176752)] dark:text-[oklab(0.868999_0.0640533_0.176752)]',
        neutral:
          'border-gray-300 bg-gray-100 text-gray-700 [a&]:hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
        information:
          'border-blue-600 bg-blue-600/10 text-blue-700 [a&]:hover:bg-blue-600/20 dark:border-blue-500 dark:text-blue-400',
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
