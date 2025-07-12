import { useQuery } from '@tanstack/react-query'
import { PotService } from './pot.service'
import { queryKeys } from './query-key-factory'
import { useMutate } from './hooks/useMutate'
import { 
  PotQuery, 
  CreatePotRequest, 
  UpdatePotRequest,
  PotTransactionRequest
} from '@/types/pot'

const svc = new PotService()

// Queries
export const useGetPots = (query: PotQuery = {}) => {
  const res = useQuery({
    queryKey: queryKeys.pots.list(query),
    queryFn: () => svc.getPots(query),
  })

  return {
    pots: res.data ?? [],
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

export const useGetPotById = (id?: string) => {
  const res = useQuery({
    queryKey: queryKeys.pots.detail(id ?? ''),
    queryFn: () => svc.getPotById(id!),
    enabled: !!id,
  })

  return {
    pot: res.data,
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

// Mutations
export const useCreatePot = () => {
  return useMutate<any, CreatePotRequest>(
    svc.createPot.bind(svc),
    [queryKeys.pots.all],
    {
      successMessage: 'Pot created successfully',
      errorMessage: 'Failed to create pot',
    }
  )
}

export const useUpdatePot = (id: string) => {
  return useMutate<any, UpdatePotRequest>(
    (payload) => svc.updatePot(id, payload),
    [
      queryKeys.pots.all,
      queryKeys.pots.detail(id),
    ],
    {
      successMessage: 'Pot updated successfully',
      errorMessage: 'Failed to update pot',
    }
  )
}

export const useDeletePot = () => {
  return useMutate<void, string>(
    svc.deletePot.bind(svc),
    [queryKeys.pots.all],
    {
      successMessage: 'Pot deleted successfully',
      errorMessage: 'Failed to delete pot',
    }
  )
}

export const useAddToPot = (id: string) => {
  return useMutate<any, PotTransactionRequest>(
    (payload) => svc.addToPot(id, payload),
    [
      queryKeys.pots.all,
      queryKeys.pots.detail(id),
    ],
    {
      successMessage: 'Amount added to pot successfully',
      errorMessage: 'Failed to add amount to pot',
    }
  )
}

export const useWithdrawFromPot = (id: string) => {
  return useMutate<any, PotTransactionRequest>(
    (payload) => svc.withdrawFromPot(id, payload),
    [
      queryKeys.pots.all,
      queryKeys.pots.detail(id),
    ],
    {
      successMessage: 'Amount withdrawn from pot successfully',
      errorMessage: 'Failed to withdraw amount from pot',
    }
  )
}