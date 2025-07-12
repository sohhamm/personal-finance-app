import { useQuery } from '@tanstack/react-query'
import { BudgetService } from './budget.service'
import { queryKeys } from './query-key-factory'
import { useMutate } from './hooks/useMutate'
import { 
  BudgetQuery, 
  CreateBudgetRequest, 
  UpdateBudgetRequest
} from '@/types/budget'

const svc = new BudgetService()

// Queries
export const useGetBudgets = (query: BudgetQuery = {}) => {
  const res = useQuery({
    queryKey: queryKeys.budgets.list(query),
    queryFn: () => svc.getBudgets(query),
  })

  return {
    budgets: res.data ?? [],
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

export const useGetBudgetById = (id?: string) => {
  const res = useQuery({
    queryKey: queryKeys.budgets.detail(id ?? ''),
    queryFn: () => svc.getBudgetById(id!),
    enabled: !!id,
  })

  return {
    budget: res.data,
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

// Mutations
export const useCreateBudget = () => {
  return useMutate<any, CreateBudgetRequest>(
    svc.createBudget.bind(svc),
    [queryKeys.budgets.all],
    {
      successMessage: 'Budget created successfully',
      errorMessage: 'Failed to create budget',
    }
  )
}

export const useUpdateBudget = (id: string) => {
  return useMutate<any, UpdateBudgetRequest>(
    (payload) => svc.updateBudget(id, payload),
    [
      queryKeys.budgets.all,
      queryKeys.budgets.detail(id),
    ],
    {
      successMessage: 'Budget updated successfully',
      errorMessage: 'Failed to update budget',
    }
  )
}

export const useDeleteBudget = () => {
  return useMutate<void, string>(
    svc.deleteBudget.bind(svc),
    [queryKeys.budgets.all],
    {
      successMessage: 'Budget deleted successfully',
      errorMessage: 'Failed to delete budget',
    }
  )
}