// Mock data for IP Ban Management Dashboard

export interface AuditEntry {
  id: string
  timestamp: Date
  action: 'created' | 'modified' | 'unbanned' | 'expired'
  performedBy: User
  details: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface IPBan {
  id: string
  ipAddress: string
  status: 'active' | 'expired' | 'unbanned'
  banReason: BanReason
  customNotes?: string
  duration: BanDuration
  bannedAt: Date
  expiresAt: Date | null
  bannedBy: User
  lotNumber?: string
  bidderId?: string
  bidderName?: string
  duplicateOfBidderId?: string
  unbanDetails?: {
    unbannedAt: Date
    unbannedBy: User
    reason: string
  }
  auditLog: Array<AuditEntry>
}

export type BanReason =
  | 'failure_to_pay'
  | 'fraudulent_bidding'
  | 'bid_manipulation'
  | 'harassment'
  | 'duplicate_accounts'
  | 'multiple_account_abuse'
  | 'terms_violation'
  | 'chargeback_abuse'
  | 'suspicious_activity'
  | 'other'

export type BanDuration =
  | '1_day'
  | '1_week'
  | '1_month'
  | '6_months'
  | '1_year'
  | 'permanent'

export const banReasons = [
  {
    value: 'failure_to_pay',
    label: 'Failure to Pay',
    requiresLot: true,
    requiresBidder: true,
    requiresDuplicateAccount: false,
  },
  {
    value: 'fraudulent_bidding',
    label: 'Fraudulent Bidding',
    requiresLot: true,
    requiresBidder: true,
    requiresDuplicateAccount: false,
  },
  {
    value: 'bid_manipulation',
    label: 'Bid Manipulation',
    requiresLot: true,
    requiresBidder: true,
    requiresDuplicateAccount: false,
  },
  {
    value: 'harassment',
    label: 'Harassment',
    requiresLot: false,
    requiresBidder: false,
    requiresDuplicateAccount: false,
  },
  {
    value: 'duplicate_accounts',
    label: 'Duplicate Accounts',
    requiresLot: false,
    requiresBidder: true,
    requiresDuplicateAccount: true,
  },
  {
    value: 'multiple_account_abuse',
    label: 'Multiple Account Abuse',
    requiresLot: false,
    requiresBidder: true,
    requiresDuplicateAccount: false,
  },
  {
    value: 'terms_violation',
    label: 'Terms of Service Violation',
    requiresLot: false,
    requiresBidder: false,
    requiresDuplicateAccount: false,
  },
  {
    value: 'chargeback_abuse',
    label: 'Chargeback Abuse',
    requiresLot: true,
    requiresBidder: true,
    requiresDuplicateAccount: false,
  },
  {
    value: 'suspicious_activity',
    label: 'Suspicious Activity',
    requiresLot: false,
    requiresBidder: false,
    requiresDuplicateAccount: false,
  },
  {
    value: 'other',
    label: 'Other',
    requiresLot: false,
    requiresBidder: false,
    requiresDuplicateAccount: false,
  },
] as const

export const durationOptions = [
  { value: '1_day', label: '1 Day' },
  { value: '1_week', label: '1 Week' },
  { value: '1_month', label: '1 Month' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
  { value: 'permanent', label: 'Permanent' },
] as const

// Mock users
const users: Array<User> = [
  {
    id: 'u1',
    name: 'Jake Peters',
    email: 'jake.peters@bigiron.com',
    avatar: 'JP',
  },
  {
    id: 'u2',
    name: 'Sarah Johnson',
    email: 'sarah@bigiron.com',
    avatar: 'SJ',
  },
  {
    id: 'u3',
    name: 'Tom Anderson',
    email: 'tom@bigiron.com',
    avatar: 'TA',
  },
  {
    id: 'u4',
    name: 'Emily Chen',
    email: 'emily@bigiron.com',
    avatar: 'EC',
  },
  {
    id: 'u5',
    name: 'Michael Rodriguez',
    email: 'michael@bigiron.com',
    avatar: 'MR',
  },
]

export const currentUser = users[0]

// Mock IP ban data
export const ipBans: Array<IPBan> = [
  {
    id: 'ban1',
    ipAddress: '192.168.1.100',
    status: 'active',
    banReason: 'failure_to_pay',
    customNotes:
      'Won lot but refused payment after multiple attempts to contact.',
    duration: '6_months',
    bannedAt: new Date('2025-01-10T14:30:00'),
    expiresAt: new Date('2025-07-10T14:30:00'),
    bannedBy: users[0],
    lotNumber: 'TR4892',
    bidderId: '138492',
    bidderName: 'John Smith',
    auditLog: [
      {
        id: 'a1',
        timestamp: new Date('2025-01-10T14:30:00'),
        action: 'created',
        performedBy: users[0],
        details: 'IP banned for failure to pay on TR4892',
      },
      {
        id: 'a1b',
        timestamp: new Date('2025-01-11T09:15:00'),
        action: 'modified',
        performedBy: users[0],
        details: 'Updated custom notes with additional contact attempt details',
      },
    ],
  },
  {
    id: 'ban2',
    ipAddress: '10.45.23.156',
    status: 'active',
    banReason: 'fraudulent_bidding',
    customNotes:
      'Multiple shill bidding attempts detected across several auctions.',
    duration: '1_year',
    bannedAt: new Date('2025-01-08T09:15:00'),
    expiresAt: new Date('2026-01-08T09:15:00'),
    bannedBy: users[1],
    lotNumber: 'EQ4801',
    bidderId: '138401',
    bidderName: 'Mike Williams',
    auditLog: [
      {
        id: 'a2',
        timestamp: new Date('2025-01-08T09:15:00'),
        action: 'created',
        performedBy: users[1],
        details: 'IP banned for fraudulent bidding patterns',
      },
      {
        id: 'a2b',
        timestamp: new Date('2025-01-08T11:30:00'),
        action: 'modified',
        performedBy: users[1],
        details:
          'Extended ban duration from 6 months to 1 year after discovering additional violations',
      },
      {
        id: 'a2c',
        timestamp: new Date('2025-01-09T14:20:00'),
        action: 'modified',
        performedBy: users[2],
        details:
          'Added notes about coordinated bidding activity with other accounts',
      },
    ],
  },
  {
    id: 'ban3',
    ipAddress: '172.16.5.89',
    status: 'active',
    banReason: 'harassment',
    customNotes:
      'Repeated threatening messages to auction staff and other bidders.',
    duration: 'permanent',
    bannedAt: new Date('2025-01-05T16:45:00'),
    expiresAt: null,
    bannedBy: users[2],
    auditLog: [
      {
        id: 'a3',
        timestamp: new Date('2025-01-05T16:45:00'),
        action: 'created',
        performedBy: users[2],
        details: 'Permanent ban for harassment',
      },
      {
        id: 'a3b',
        timestamp: new Date('2025-01-05T17:00:00'),
        action: 'modified',
        performedBy: users[2],
        details:
          'Updated notes with specific incident reports from staff members',
      },
      {
        id: 'a3c',
        timestamp: new Date('2025-01-06T10:30:00'),
        action: 'modified',
        performedBy: users[1],
        details: 'Added reference to legal department notification',
      },
    ],
  },
  {
    id: 'ban4',
    ipAddress: '203.45.67.12',
    status: 'unbanned',
    banReason: 'suspicious_activity',
    customNotes: 'Unusual bidding patterns flagged by automated system.',
    duration: '1_week',
    bannedAt: new Date('2024-12-15T11:20:00'),
    expiresAt: new Date('2024-12-22T11:20:00'),
    bannedBy: users[1],
    unbanDetails: {
      unbannedAt: new Date('2024-12-18T14:30:00'),
      unbannedBy: users[2],
      reason: 'User verified identity and cleared of suspicious activity',
    },
    auditLog: [
      {
        id: 'a4',
        timestamp: new Date('2024-12-15T11:20:00'),
        action: 'created',
        performedBy: users[1],
        details: 'IP banned for suspicious activity',
      },
      {
        id: 'a4b',
        timestamp: new Date('2024-12-16T09:45:00'),
        action: 'modified',
        performedBy: users[1],
        details: 'User contacted support requesting review of ban',
      },
      {
        id: 'a4c',
        timestamp: new Date('2024-12-17T13:15:00'),
        action: 'modified',
        performedBy: users[2],
        details: 'Reviewed user verification documents submitted via email',
      },
      {
        id: 'a5',
        timestamp: new Date('2024-12-18T14:30:00'),
        action: 'unbanned',
        performedBy: users[2],
        details: 'User verified identity and cleared of suspicious activity',
      },
    ],
  },
  {
    id: 'ban5',
    ipAddress: '198.51.100.45',
    status: 'expired',
    banReason: 'bid_manipulation',
    customNotes:
      'Attempted to manipulate bid prices through coordinated actions.',
    duration: '1_month',
    bannedAt: new Date('2024-11-20T13:00:00'),
    expiresAt: new Date('2024-12-20T13:00:00'),
    bannedBy: users[0],
    lotNumber: 'CT4723',
    bidderId: '138210',
    bidderName: 'Lisa Chen',
    auditLog: [
      {
        id: 'a6',
        timestamp: new Date('2024-11-20T13:00:00'),
        action: 'created',
        performedBy: users[0],
        details: 'IP banned for bid manipulation on CT4723',
      },
      {
        id: 'a6b',
        timestamp: new Date('2024-11-21T10:30:00'),
        action: 'modified',
        performedBy: users[0],
        details:
          'Added evidence of coordinated bidding activity across multiple lots',
      },
      {
        id: 'a7',
        timestamp: new Date('2024-12-20T13:00:00'),
        action: 'expired',
        performedBy: {
          id: 'system',
          name: 'System',
          email: 'system@bigiron.com',
        },
        details: 'Ban expired automatically',
      },
    ],
  },
  {
    id: 'ban6',
    ipAddress: '45.123.67.89',
    status: 'active',
    banReason: 'duplicate_accounts',
    customNotes: 'User created multiple accounts to circumvent bidding limits.',
    duration: '1_year',
    bannedAt: new Date('2025-01-12T10:15:00'),
    expiresAt: new Date('2026-01-12T10:15:00'),
    bannedBy: users[1],
    bidderId: '145678',
    bidderName: 'Robert Davis',
    duplicateOfBidderId: '123456',
    auditLog: [
      {
        id: 'a8',
        timestamp: new Date('2025-01-12T10:15:00'),
        action: 'created',
        performedBy: users[1],
        details:
          'IP banned for duplicate accounts - account 145678 appears to be duplicate of 123456',
      },
      {
        id: 'a8b',
        timestamp: new Date('2025-01-12T11:45:00'),
        action: 'modified',
        performedBy: users[1],
        details:
          'Confirmed duplicate through matching payment methods and shipping addresses',
      },
      {
        id: 'a8c',
        timestamp: new Date('2025-01-12T14:20:00'),
        action: 'modified',
        performedBy: users[2],
        details: 'Both accounts flagged for additional review and monitoring',
      },
    ],
  },
  {
    id: 'ban7',
    ipAddress: '74.125.224.72',
    status: 'active',
    banReason: 'chargeback_abuse',
    customNotes:
      'Filed multiple chargebacks after receiving items in good condition.',
    duration: 'permanent',
    bannedAt: new Date('2025-01-09T15:20:00'),
    expiresAt: null,
    bannedBy: users[3],
    lotNumber: 'AG5621',
    bidderId: '142891',
    bidderName: 'Patricia Martinez',
    auditLog: [
      {
        id: 'a9',
        timestamp: new Date('2025-01-09T15:20:00'),
        action: 'created',
        performedBy: users[3],
        details: 'Permanent ban for repeated chargeback abuse on AG5621',
      },
      {
        id: 'a9b',
        timestamp: new Date('2025-01-09T16:45:00'),
        action: 'modified',
        performedBy: users[3],
        details: 'Documented 4 fraudulent chargebacks in past 6 months',
      },
    ],
  },
  {
    id: 'ban8',
    ipAddress: '157.240.22.35',
    status: 'active',
    banReason: 'terms_violation',
    customNotes:
      'Attempted to resell auction items before completing purchase.',
    duration: '6_months',
    bannedAt: new Date('2025-01-11T11:30:00'),
    expiresAt: new Date('2025-07-11T11:30:00'),
    bannedBy: users[4],
    auditLog: [
      {
        id: 'a10',
        timestamp: new Date('2025-01-11T11:30:00'),
        action: 'created',
        performedBy: users[4],
        details:
          'IP banned for terms of service violation - unauthorized resale',
      },
    ],
  },
  {
    id: 'ban9',
    ipAddress: '216.58.194.174',
    status: 'expired',
    banReason: 'suspicious_activity',
    customNotes: 'Multiple accounts bidding from same IP during live auction.',
    duration: '1_month',
    bannedAt: new Date('2024-11-28T09:00:00'),
    expiresAt: new Date('2024-12-28T09:00:00'),
    bannedBy: users[1],
    auditLog: [
      {
        id: 'a11',
        timestamp: new Date('2024-11-28T09:00:00'),
        action: 'created',
        performedBy: users[1],
        details: 'IP banned for suspicious activity - multiple concurrent bids',
      },
      {
        id: 'a11b',
        timestamp: new Date('2024-12-28T09:00:00'),
        action: 'expired',
        performedBy: {
          id: 'system',
          name: 'System',
          email: 'system@bigiron.com',
        },
        details: 'Ban expired automatically',
      },
    ],
  },
  {
    id: 'ban10',
    ipAddress: '104.244.42.129',
    status: 'active',
    banReason: 'multiple_account_abuse',
    customNotes: 'Created 7 accounts to manipulate auction outcomes.',
    duration: '1_year',
    bannedAt: new Date('2025-01-07T13:45:00'),
    expiresAt: new Date('2026-01-07T13:45:00'),
    bannedBy: users[2],
    bidderId: '149234',
    bidderName: 'David Thompson',
    auditLog: [
      {
        id: 'a12',
        timestamp: new Date('2025-01-07T13:45:00'),
        action: 'created',
        performedBy: users[2],
        details:
          'IP banned for creating multiple accounts - 7 accounts identified',
      },
      {
        id: 'a12b',
        timestamp: new Date('2025-01-07T14:00:00'),
        action: 'modified',
        performedBy: users[2],
        details: 'All associated accounts suspended pending investigation',
      },
    ],
  },
  {
    id: 'ban11',
    ipAddress: '140.82.112.4',
    status: 'unbanned',
    banReason: 'failure_to_pay',
    customNotes: 'Initially failed to pay but resolved after negotiation.',
    duration: '1_month',
    bannedAt: new Date('2024-10-15T10:20:00'),
    expiresAt: new Date('2025-01-15T10:20:00'),
    bannedBy: users[0],
    lotNumber: 'WH3421',
    bidderId: '135672',
    bidderName: 'Jennifer Wilson',
    unbanDetails: {
      unbannedAt: new Date('2024-11-03T16:30:00'),
      unbannedBy: users[0],
      reason: 'Payment completed in full, user showed good faith in resolution',
    },
    auditLog: [
      {
        id: 'a13',
        timestamp: new Date('2024-10-15T10:20:00'),
        action: 'created',
        performedBy: users[0],
        details: 'IP banned for failure to pay on WH3421',
      },
      {
        id: 'a13b',
        timestamp: new Date('2024-10-28T14:15:00'),
        action: 'modified',
        performedBy: users[0],
        details: 'User contacted to discuss payment plan',
      },
      {
        id: 'a13c',
        timestamp: new Date('2024-11-03T16:30:00'),
        action: 'unbanned',
        performedBy: users[0],
        details:
          'Payment completed in full, user showed good faith in resolution',
      },
    ],
  },
  {
    id: 'ban12',
    ipAddress: '13.107.42.14',
    status: 'active',
    banReason: 'fraudulent_bidding',
    customNotes:
      'Bid retraction pattern suggests intent to disrupt competitive bidding.',
    duration: '1_year',
    bannedAt: new Date('2025-01-13T08:15:00'),
    expiresAt: new Date('2026-01-13T08:15:00'),
    bannedBy: users[4],
    lotNumber: 'CG7821',
    bidderId: '147823',
    bidderName: 'Kevin Brown',
    auditLog: [
      {
        id: 'a14',
        timestamp: new Date('2025-01-13T08:15:00'),
        action: 'created',
        performedBy: users[4],
        details:
          'IP banned for fraudulent bidding - suspicious bid retractions on CG7821',
      },
    ],
  },
]
