import { useQuery } from '@tanstack/react-query'
import { postService } from '@/services/postService'

export function usePost(id: string) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getById(id),
  })
}
