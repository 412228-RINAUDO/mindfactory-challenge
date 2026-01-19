import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "@/components/PostForm";
import { LoadingState } from "@/components/LoadingState";
import { usePost, useUpdatePost } from "@/hooks/usePosts";

export function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id!);
  const { mutate: updatePost, isPending } = useUpdatePost();

  const handleSubmit = (data: { title: string; content: string }) => {
    updatePost(
      { id: id!, data },
      {
        onSuccess: () => {
          navigate(`/posts/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return <LoadingState message="Cargando post..." />;
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post no encontrado</p>
      </div>
    );
  }

  return (
    <PostForm
      initialTitle={post.title}
      initialContent={post.content}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      isEditing
    />
  );
}
