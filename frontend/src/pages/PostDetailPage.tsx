import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, Pencil, Send } from "lucide-react";
import { usePost, useCreateComment } from "@/hooks/usePosts";
import { formatDate } from "@/lib/formatDate";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingState } from "@/components/LoadingState";
import { BackLink } from "@/components/BackLink";
import { useAuth } from "@/contexts/AuthContext";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = usePost(id!);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.id === post?.user.id;
  const [newComment, setNewComment] = useState("");
  const { mutate: createComment, isPending: isCreatingComment } = useCreateComment();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    createComment(
      { postId: id, content: newComment },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingState message="Cargando post..." />;
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <BackLink to="/" label="Todos los posts" />
        <div className="text-center py-12">
          <p className="text-muted-foreground">Post no encontrado</p>
        </div>
      </div>
    );
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
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
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

      <div className="mt-12 pt-8 border-t border-border flex items-center gap-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            post.is_liked
              ? "border-primary bg-primary/10 text-primary"
              : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`h-5 w-5 ${post.is_liked ? "fill-primary" : ""}`} />
          <span className="font-medium">{post.likes_count}</span>
        </button>
      </div>

      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-xl font-semibold mb-8">Comments ({post.comments.length})</h2>

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser?.id ? "Write a comment..." : "Log in to comment"}
              disabled={!currentUser?.id}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="sm" 
                disabled={!currentUser?.id || !newComment.trim() || isCreatingComment} 
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isCreatingComment ? "Posting..." : "Post comment"}
              </Button>
            </div>
          </div>
        </form>


        {post.comments.length === 0 ? (
          <div className="py-12 text-center p-6 rounded-xl border border-border/50 bg-card/30">
            <p className="text-muted-foreground">
              Aún no hay comentarios. ¡Sé el primero en compartir tu opinión!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {post.comments.map((comment, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border/50 bg-card/30 hover:bg-card/50 hover:border-border transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Link
                      to={`/profile/${comment.user.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {comment.user.name}
                    </Link>
                    <time
                      dateTime={comment.created_at}
                      className="text-sm text-muted-foreground"
                    >
                      {formatDate(comment.created_at)}
                    </time>
                  </div>
                  <p className="text-foreground/90 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Load More Comments Button */}
            <div className="mt-8 flex justify-center">
              <Button variant="outline" className="gap-2 bg-transparent">
                Load more comments
              </Button>
            </div>
          </>
        )}
      </section>
    </article>
  );
}
