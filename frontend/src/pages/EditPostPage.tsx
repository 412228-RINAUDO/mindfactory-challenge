import { useNavigate, useParams } from "react-router-dom";
import { PostForm } from "@/components/PostForm";
import { usePost, useUpdatePost } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";

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
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Post not found</p>
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
