import React, { useState } from 'react'
import { AlertCircle, DollarSign, Gavel, TrendingUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BidModalProps {
  isOpen: boolean
  onClose: () => void
  item: {
    id: string
    title: string
    currentBid: number
    startingBid: number
    bids: number
    endDate: string
    category: string
    seller: string
    location: string
  } | null
  onSubmit: (bidAmount: number) => void
}

export function BidModal({ isOpen, onClose, item, onSubmit }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setBidAmount('')
      setError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!item) return null

  const minBid = item.currentBid > 0 ? item.currentBid + 100 : item.startingBid
  const suggestedBids = [minBid, minBid + 500, minBid + 1000, minBid + 2500]

  const validateBid = (amount: number): string | null => {
    if (!amount || amount <= 0) {
      return 'Please enter a valid bid amount'
    }
    if (amount < minBid) {
      return `Bid must be at least ${formatCurrency(minBid)}`
    }
    return null
  }

  const handleSubmit = async () => {
    const amount = parseFloat(bidAmount.replace(/[^0-9.]/g, ''))
    const validationError = validateBid(amount)

    if (validationError) {
      setError(validationError)
      return
    }

    setError('')
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit(amount)
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString())
    setError('')
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
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Gavel className="h-6 w-6 text-primary" />
            Place Your Bid
          </DialogTitle>
          <DialogDescription>
            Review the item details and enter your bid amount
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Item Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <p className="font-medium">{item.category}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Location
                </Label>
                <p className="font-medium">{item.location}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Seller</Label>
                <p className="font-medium">{item.seller}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Auction Ends
                </Label>
                <p className="font-medium">{formatDate(item.endDate)}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Bid Information */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Label className="text-xs text-muted-foreground">
                Starting Bid
              </Label>
              <p className="text-lg font-bold mt-1">
                {formatCurrency(item.startingBid)}
              </p>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <Label className="text-xs text-muted-foreground">
                Current Bid
              </Label>
              <p className="text-lg font-bold mt-1 text-primary">
                {item.currentBid > 0
                  ? formatCurrency(item.currentBid)
                  : 'No bids yet'}
              </p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Label className="text-xs text-muted-foreground">
                Total Bids
              </Label>
              <p className="text-lg font-bold mt-1">{item.bids}</p>
            </div>
          </div>

          {/* Bid Amount Input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bid-amount" className="text-sm font-semibold">
                Your Bid Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="bid-amount"
                  type="text"
                  placeholder="0.00"
                  value={bidAmount}
                  onChange={(e) => {
                    setBidAmount(e.target.value)
                    setError('')
                  }}
                  className="pl-10 text-lg font-semibold h-12"
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum bid:{' '}
                <span className="font-semibold">{formatCurrency(minBid)}</span>
              </p>
            </div>

            {/* Quick Bid Buttons */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Quick bid amounts:
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {suggestedBids.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickBid(amount)}
                    className="w-full"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Info Alert */}
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Bidding Tips:</strong> Your bid is binding. Make sure
                you're ready to purchase if you win. Bids cannot be retracted
                once placed.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Placing Bid...
              </>
            ) : (
              <>
                <Gavel className="h-4 w-4 mr-2" />
                Place Bid
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
