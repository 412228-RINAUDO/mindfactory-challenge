import { Link } from "react-router-dom"
import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/PostCard"
import { usePosts } from "@/hooks/usePosts"

interface PostsPageProps {
  isAuthenticated?: boolean
}

export function PostsPage({ isAuthenticated = false }: PostsPageProps) {
  const { data: response, isLoading, error } = usePosts()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
          Ideas worth sharing
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          A space for writers and thinkers to share their perspectives on design, technology, and creativity.
        </p>
        {!isAuthenticated && (
          <Button size="lg" className="gap-2" asChild>
            <Link to="/login">
              <PenLine className="h-4 w-4" />
              Start writing
            </Link>
          </Button>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
          Recent Posts
        </h2>
        
        {isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            Loading posts...
          </div>
        )}
        
        {error && (
          <div className="text-center py-12 text-destructive">
            Error loading posts: {error.message}
          </div>
        )}
        
        {response?.data && (
          <div className="space-y-6">
            {response.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
