import { create } from 'zustand'
import { BudgetQuery } from '@/types/budget'

// Constants for pagination and limits
export const DEFAULT_PAGE = '1'
export const DEFAULT_LIMIT = '10'

// Initial query state
export const budgetInitialQueries: BudgetQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  search: '',
  category: undefined,
  sortBy: 'created_at',
  sortOrder: 'desc',
}

// Store interface
interface BudgetStore {
  query: BudgetQuery
  setQuery: (updates: Partial<BudgetQuery>) => void
  resetQuery: () => void
  setPage: (page: string) => void
  setSearch: (search: string) => void
  setCategory: (category: BudgetQuery['category']) => void
  setSortBy: (sortBy: BudgetQuery['sortBy']) => void
  setSortOrder: (sortOrder: BudgetQuery['sortOrder']) => void
}

// Create the store
export const useBudgetStore = create<BudgetStore>((set) => ({
  query: budgetInitialQueries,
  
  setQuery: (updates) =>
    set((state) => ({
      query: { ...state.query, ...updates },
    })),

  resetQuery: () =>
    set(() => ({
      query: budgetInitialQueries,
    })),

  setPage: (page) =>
    set((state) => ({
      query: { ...state.query, page },
    })),

  setSearch: (search) =>
    set((state) => ({
      query: { ...state.query, search, page: DEFAULT_PAGE },
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
}))

// Selectors for easier access
export const useBudgetQuery = () => useBudgetStore((state) => state.query)
export const useBudgetActions = () => useBudgetStore((state) => ({
  setQuery: state.setQuery,
  resetQuery: state.resetQuery,
  setPage: state.setPage,
  setSearch: state.setSearch,
  setCategory: state.setCategory,
  setSortBy: state.setSortBy,
  setSortOrder: state.setSortOrder,
}))