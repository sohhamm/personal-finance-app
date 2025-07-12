import {useMutation, useQueryClient} from '@tanstack/react-query'

interface UseMutateOptions {
  onSuccess?: (data: any) => void
  onError?: (error: Error) => void
  invalidateQueries?: string[][]
  successMessage?: string
  errorMessage?: string
}

export const useMutate = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  invalidateKeys?: string[][] | string[],
  options?: UseMutateOptions,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: data => {
      // Invalidate queries if keys provided
      if (invalidateKeys) {
        if (Array.isArray(invalidateKeys[0])) {
          // Multiple query keys
          ;(invalidateKeys as string[][]).forEach(key => {
            queryClient.invalidateQueries({queryKey: key})
          })
        } else {
          // Single query key
          queryClient.invalidateQueries({queryKey: invalidateKeys as string[]})
        }
      }

      // Show success message if provided
      if (options?.successMessage) {
        console.log(options.successMessage) // Replace with your toast/notification system
      }

      // Call custom onSuccess if provided
      options?.onSuccess?.(data)
    },
    onError: error => {
      // Show error message if provided
      if (options?.errorMessage) {
        console.error(options.errorMessage, error) // Replace with your toast/notification system
      }

      // Call custom onError if provided
      options?.onError?.(error)
    },
  })
}
