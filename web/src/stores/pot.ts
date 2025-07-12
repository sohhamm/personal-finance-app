import { create } from 'zustand'
import { PotQuery } from '@/types/pot'

// Constants for pagination and limits
export const DEFAULT_PAGE = '1'
export const DEFAULT_LIMIT = '10'

// Initial query state
export const potInitialQueries: PotQuery = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  search: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
}

// Store interface
interface PotStore {
  query: PotQuery
  setQuery: (updates: Partial<PotQuery>) => void
  resetQuery: () => void
  setPage: (page: string) => void
  setSearch: (search: string) => void
  setSortBy: (sortBy: PotQuery['sortBy']) => void
  setSortOrder: (sortOrder: PotQuery['sortOrder']) => void
}

// Create the store
export const usePotStore = create<PotStore>((set) => ({
  query: potInitialQueries,
  
  setQuery: (updates) =>
    set((state) => ({
      query: { ...state.query, ...updates },
    })),

  resetQuery: () =>
    set(() => ({
      query: potInitialQueries,
    })),

  setPage: (page) =>
    set((state) => ({
      query: { ...state.query, page },
    })),

  setSearch: (search) =>
    set((state) => ({
      query: { ...state.query, search, page: DEFAULT_PAGE },
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
export const usePotQuery = () => usePotStore((state) => state.query)
export const usePotActions = () => usePotStore((state) => ({
  setQuery: state.setQuery,
  resetQuery: state.resetQuery,
  setPage: state.setPage,
  setSearch: state.setSearch,
  setSortBy: state.setSortBy,
  setSortOrder: state.setSortOrder,
}))