import { useParams, Link, useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { usePost } from '@/hooks/usePosts'
import { formatDate } from '@/lib/formatDate'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/LoadingState'
import { BackLink } from '@/components/BackLink'
import { useAuth } from '@/contexts/AuthContext'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isLoading, error } = usePost(id!)
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const isOwner = currentUser?.id === post?.user.id

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return <LoadingState message="Cargando post..." />
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <BackLink to="/" label="Todos los posts" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <BackLink to="/" label="Todos los posts" />

      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-balance">
          {post.title}
        </h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link
              to={`/profile/${post.user.id}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              {post.user.name}
            </Link>
            <span className="text-border">·</span>
            <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
          </div>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => navigate(`/posts/${post.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Editar publicación
            </Button>
          )}
        </div>
      </header>

      <div className="prose-content text-lg text-foreground/90 leading-relaxed">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-6">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  )
}
