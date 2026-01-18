import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Pencil } from 'lucide-react'
import { usePost } from '@/hooks/usePost'
import { formatDate } from '@/lib/formatDate'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Back to posts
        </Link>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>

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
              onClick={() => navigate(`/edit/${post.id}`)}
            >
              <Pencil className="h-4 w-4" />
              Edit post
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
