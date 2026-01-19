import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import type { Post } from '@/interfaces/Post'

export function usePosts(page = 1, pageItems = 10) {
  return useQuery({
    queryKey: ['posts', page, pageItems],
    queryFn: () => postService.getAll(page, pageItems),
  })
}

export function usePost(id: string) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => postService.getById(id),
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: postService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Post> }) =>
      postService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
