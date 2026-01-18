import { useNavigate } from "react-router-dom";
import { PostForm } from "@/components/PostForm";
import { useCreatePost } from "@/hooks/usePosts";

export function CreatePostPage() {
  const navigate = useNavigate();
  const { mutate: createPost, isPending } = useCreatePost();

  const handleSubmit = (data: { title: string; content: string }) => {
    createPost(data, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  return <PostForm onSubmit={handleSubmit} isSubmitting={isPending} />;
}
