import { Link } from "react-router-dom"
import { PenLine } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/PostCard"
import type { Post } from "@/interfaces/Post"

const mockPosts: Post[] = [
  {
    id: "1",
    title: "The Future of Design Systems",
    excerpt: "Exploring how design systems are evolving to meet the needs of modern web applications and the tools that make them possible.",
    authorId: "user1",
    authorName: "Sarah Chen",
    createdAt: "2024-01-15T10:00:00Z",
    likes: ["1", "2", "3"],
    commentsCount: 5
  },
  {
    id: "2",
    title: "Building Better User Experiences",
    excerpt: "A deep dive into the principles of user-centered design and how to apply them in your next project.",
    authorId: "user2",
    authorName: "Alex Rivera",
    createdAt: "2024-01-14T15:30:00Z",
    likes: ["1", "2"],
    commentsCount: 3
  },
  {
    id: "3",
    title: "The Art of Minimalism in Web Design",
    excerpt: "Less is more. Discover how minimalist design principles can create powerful and memorable user experiences.",
    authorId: "user3",
    authorName: "Jordan Lee",
    createdAt: "2024-01-13T09:15:00Z",
    likes: ["1"],
    commentsCount: 8
  }
]

interface PostsPageProps {
  isAuthenticated?: boolean
}

export function PostsPage({ isAuthenticated = false }: PostsPageProps) {
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
        <div className="space-y-6">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  )
}
