import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground font-medium hover:bg-yellow-500 cursor-pointer active:outline-none active:ring-2 active:ring-primary active:ring-offset-2 active:ring-primary/80',
        destructive:
          'bg-destructive text-white font-bold hover:bg-red-700 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 cursor-pointer active:outline-none active:ring-2 active:ring-red-300 active:ring-offset-2 active:ring-offset-red-50',
        outline:
          'border border-neutral-400 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer active:outline-none active:ring-2 active:ring-secondary active:ring-offset-2 active:ring-neutral-300',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-neutral-200 cursor-pointer active:outline-none active:ring-2 active:ring-secondary active:ring-offset-2 active:ring-neutral-300',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 cursor-pointer active:outline-none active:ring-2 active:ring-secondary active:ring-offset-2 active:ring-neutral-300',
        link: 'text-sky-600 underline-offset-4 hover:underline cursor-pointer active:outline-none active:ring-2 active:ring-sky-500 active:ring-offset-2 active:ring-offset-sky-50',
        successful:
          'bg-emerald-600 text-white font-bold hover:bg-emerald-700 focus-visible:ring-emerald-500/20 dark:focus-visible:ring-emerald-400/40 cursor-pointer active:outline-none active:ring-2 active:ring-emerald-300 active:ring-offset-2 active:ring-offset-emerald-50',
        warning:
          'bg-amber-500 text-white font-bold hover:bg-amber-600 focus-visible:ring-amber-500/20 dark:focus-visible:ring-amber-400/40 cursor-pointer active:outline-none active:ring-2 active:ring-amber-300 active:ring-offset-2 active:ring-offset-amber-50',
        info: 'bg-sky-500 text-white font-bold hover:bg-sky-600 focus-visible:ring-sky-500/20 dark:focus-visible:ring-sky-400/40 cursor-pointer active:outline-none active:ring-2 active:ring-sky-300 active:ring-offset-2 active:ring-offset-sky-50',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3 text-xs',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-lg px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
