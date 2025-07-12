import { create } from 'zustand'
import { TransactionQuery } from '@/types/transaction'

// Constants for pagination and limits
export const DEFAULT_PAGE = '1'
export const DEFAULT_LIMIT = '10'

// Initial query state
export const transactionInitialQueries: TransactionQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  search: '',
  category: undefined,
  sortBy: 'date',
  sortOrder: 'desc',
  startDate: '',
  endDate: '',
}

// Store interface
interface TransactionStore {
  query: TransactionQuery
  setQuery: (updates: Partial<TransactionQuery>) => void
  resetQuery: () => void
  setPage: (page: string) => void
  setSearch: (search: string) => void
  setCategory: (category: TransactionQuery['category']) => void
  setSortBy: (sortBy: TransactionQuery['sortBy']) => void
  setSortOrder: (sortOrder: TransactionQuery['sortOrder']) => void
  setDateRange: (startDate: string, endDate: string) => void
}

// Create the store
export const useTransactionStore = create<TransactionStore>((set) => ({
  query: transactionInitialQueries,
  
  setQuery: (updates) =>
    set((state) => ({
      query: { ...state.query, ...updates },
    })),

  resetQuery: () =>
    set(() => ({
      query: transactionInitialQueries,
    })),

  setPage: (page) =>
    set((state) => ({
      query: { ...state.query, page },
    })),

  setSearch: (search) =>
    set((state) => ({
      query: { ...state.query, search, page: DEFAULT_PAGE }, // Reset to first page on search
    })),

  setCategory: (category) =>
    set((state) => ({
      query: { ...state.query, category, page: DEFAULT_PAGE },
    })),

  setSortBy: (sortBy) =>
    set((state) => ({
      query: { ...state.query, sortBy },
    })),

  setSortOrder: (sortOrder) =>
    set((state) => ({
      query: { ...state.query, sortOrder },
    })),

  setDateRange: (startDate, endDate) =>
    set((state) => ({
      query: { ...state.query, startDate, endDate, page: DEFAULT_PAGE },
    })),
}))

// Selectors for easier access
export const useTransactionQuery = () => useTransactionStore((state) => state.query)
export const useTransactionActions = () => useTransactionStore((state) => ({
  setQuery: state.setQuery,
  resetQuery: state.resetQuery,
  setPage: state.setPage,
  setSearch: state.setSearch,
  setCategory: state.setCategory,
  setSortBy: state.setSortBy,
  setSortOrder: state.setSortOrder,
  setDateRange: state.setDateRange,
}))