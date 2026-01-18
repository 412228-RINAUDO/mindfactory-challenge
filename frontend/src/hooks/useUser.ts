import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  })
}
