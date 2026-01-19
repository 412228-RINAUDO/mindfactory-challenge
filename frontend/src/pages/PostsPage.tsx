import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/PostCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/contexts/AuthContext";
import type { Post } from "@/interfaces/Post";

export function PostsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const { data: response, isLoading, error } = usePosts(page, 5);

  useEffect(() => {
    if (response?.data) {
      setAllPosts(prev => {
        const newPosts = response.data.filter(
          post => !prev.some(p => p.id === post.id)
        );
        return [...prev, ...newPosts];
      });
    }
  }, [response?.data]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-balance">
          Ideas que vale la pena compartir
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl">
          Un espacio para escritores y pensadores que comparten sus perspectivas
          sobre diseño, tecnología y creatividad.
        </p>
        {!user?.id && !isLoading && (
          <Button size="lg" className="gap-2" asChild>
            <Link to="/login">
              <PenLine className="h-4 w-4" />
              Comenzar a escribir
            </Link>
          </Button>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-8">
          Publicaciones recientes
        </h2>

        {isLoading && page === 1 && <LoadingState message="Cargando posts..." />}

        {error && <ErrorState message="Error al cargar los posts" />}

        {allPosts.length > 0 && (
          <div className="space-y-6">
            {allPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!isLoading && allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              No hay publicaciones todavía
            </p>
            <p className="text-muted-foreground text-sm">
              {user?.id
                ? "Sé el primero en compartir algo"
                : "Inicia sesión para crear la primera publicación"}
            </p>
          </div>
        )}
        {response?.meta && page < response.meta.totalPages && (
          <div className="mt-10 flex justify-center">
            <Button 
              variant="outline" 
              className="gap-2 bg-transparent"
              onClick={() => setPage(prev => prev + 1)}
              disabled={isLoading}
            >
              {isLoading && page > 1 ? "Cargando..." : "Cargar más publicaciones"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
