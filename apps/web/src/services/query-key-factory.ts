import { TransactionQuery } from '@/types/transaction'
import { BudgetQuery } from '@/types/budget'
import { PotQuery } from '@/types/pot'

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
  },

  // Transactions
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (query: TransactionQuery) => [...queryKeys.transactions.lists(), query] as const,
    details: () => [...queryKeys.transactions.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.transactions.details(), id] as const,
    stats: () => [...queryKeys.transactions.all, 'stats'] as const,
    categories: () => [...queryKeys.transactions.all, 'categories'] as const,
  },

  // Budgets
  budgets: {
    all: ['budgets'] as const,
    lists: () => [...queryKeys.budgets.all, 'list'] as const,
    list: (query: BudgetQuery) => [...queryKeys.budgets.lists(), query] as const,
    details: () => [...queryKeys.budgets.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.budgets.details(), id] as const,
  },

  // Pots
  pots: {
    all: ['pots'] as const,
    lists: () => [...queryKeys.pots.all, 'list'] as const,
    list: (query: PotQuery) => [...queryKeys.pots.lists(), query] as const,
    details: () => [...queryKeys.pots.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.pots.details(), id] as const,
  },
} as const