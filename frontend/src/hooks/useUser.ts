import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { notificationService } from '@/services/notificationService'
import type { UpdateUserDto } from '@/interfaces/User'

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id!),
    enabled: !!id,
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateUserDto) => userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', id] })
      notificationService.success('¡Perfil actualizado!', 'Tus cambios han sido guardados')
    },
    onError: (error) => {
      notificationService.handleError(error)
    },
  })
}
