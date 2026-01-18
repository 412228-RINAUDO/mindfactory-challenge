import { Link, useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import type { Post } from "@/interfaces/Post"
import { formatDate } from "@/lib/formatDate"

interface PostCardProps {
  post: Post
}


export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate()

  return (
    <article className="group p-6 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-border transition-all duration-200">
      <div 
        className="block cursor-pointer" 
        onClick={() => navigate(`/posts/${post.id}`)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-xl sm:text-2xl font-semibold group-hover:text-primary transition-colors text-balance">
            {post.title}
          </h3>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
        </div>
        <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
          {post.content}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link 
            to={`/profile/${post.user.id}`} 
            className="hover:text-foreground transition-colors"
          >
            {post.user.name}
          </Link>
          <span className="text-border">·</span>
          <time dateTime={post.created_at}>
            {formatDate(post.created_at)}
          </time>
        </div>
      </div>
    </article>
  )
}
