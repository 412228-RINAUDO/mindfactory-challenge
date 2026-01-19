import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { postService } from '@/services/postService'
import type { Post } from '@/interfaces/Post'

export function usePosts(page = 1, pageItems = 10) {
  return useQuery({
    queryKey: ['posts', page, pageItems],
    queryFn: () => postService.getAll(page, pageItems),
  })
}

export function useInfinitePosts(pageItems = 10) {
  return useInfiniteQuery({
    queryKey: ['posts', 'infinite', pageItems],
    queryFn: ({ pageParam = 1 }) => postService.getAll(pageParam, pageItems),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.page < lastPage.meta.totalPages) {
        return lastPage.meta.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
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

export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ postId, content }: { postId: string; content: string }) =>
      postService.createComment(postId, { content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useToggleLike() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ postId, isLiked }: { postId: string; isLiked: boolean }) => 
      postService.toggleLike(postId, isLiked),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
