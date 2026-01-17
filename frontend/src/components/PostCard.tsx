import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"
import type { Post } from "@/interfaces/Post"

interface PostCardProps {
  post: Post
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return "Today"
  if (diffInDays === 1) return "Yesterday"
  if (diffInDays < 7) return `${diffInDays} days ago`
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate()

  return (
    <article className="group p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-border transition-all duration-200">
      <div 
        className="block cursor-pointer" 
        onClick={() => navigate(`/post/${post.id}`)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-primary transition-colors text-balance">
            {post.title}
          </h3>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {post.excerpt}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link 
            to={`/profile/${post.authorId}`} 
            className="hover:text-foreground transition-colors"
          >
            {post.authorName}
          </Link>
          <span className="text-border">·</span>
          <time dateTime={post.createdAt}>
            {formatDate(post.createdAt)}
          </time>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4" />
            {post.likes.length}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {post.commentsCount}
          </span>
        </div>
      </div>
    </article>
  )
}
