import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-xl border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-[oklab(0.768999_0.0640533_0.176752)] bg-[oklab(0.768999_0.0640533_0.176752)]/10 text-[oklab(0.668999_0.0640533_0.176752)] [a&]:hover:bg-[oklab(0.768999_0.0640533_0.176752)]/20 dark:border-[oklab(0.768999_0.0640533_0.176752)] dark:text-[oklab(0.868999_0.0640533_0.176752)]',
        secondary:
          'border-border bg-secondary/50 text-secondary-foreground [a&]:hover:bg-secondary dark:border-secondary-foreground/40 dark:bg-secondary/20 dark:text-secondary-foreground',
        destructive:
          'border-destructive/20 bg-destructive/10 text-destructive [a&]:hover:bg-destructive/20 dark:border-destructive dark:text-destructive',
        outline:
          'border-border bg-background text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground dark:border-foreground/40 dark:bg-background dark:text-foreground dark:hover:bg-accent dark:[a&]:hover:text-accent-foreground',
        location:
          'border-transparent bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 [a&]:hover:bg-blue-400/80 dark:text-emerald-400',
        draft:
          'border-transparent bg-sky-200 text-sky-700 [a&]:hover:bg-blue-300/80 dark:bg-sky-900/40 dark:text-sky-400',
        archived:
          'border-transparent bg-gray-100 text-muted-foreground [a&]:hover:bg-gray-100/80',
        successful:
          'border-emerald-200 bg-emerald-100 text-emerald-700 :hover:bg-emerald-200/20 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/40',
        warning:
          'border-amber-200 bg-amber-100 text-amber-700 [a&]:hover:bg-amber-200/20 dark:border-amber-800 dark:text-amber-400 dark:bg-amber-900/40',
        neutral:
          'border-gray-200 bg-gray-100 text-gray-700 [a&]:hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300',
        information:
          'border-sky-200 bg-sky-100 text-sky-700 [a&]:hover:bg-sky-600/20 dark:border-sky-800 dark:text-sky-400 dark:bg-sky-900/40',
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
