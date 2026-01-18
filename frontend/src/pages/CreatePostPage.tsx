import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { postService } from "@/services/postService"

export function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: createPost, isPending: isSaving } = useMutation({
    mutationFn: (data: { title: string; content: string }) => postService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      navigate("/")
    },
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    createPost({ title, content: content })
  }

  const handleCancel = () => {
    navigate("/")
  }

  return (
    <form onSubmit={handleSave} className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl sm:text-4xl font-bold tracking-tight border border-border/50 bg-card/30 rounded-xl px-4 h-auto py-4 placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-card/50 hover:border-border transition-all duration-200"
          required
        />
      </div>

      <div className="mb-8">
        <Textarea
          placeholder="Write your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[50vh] text-lg leading-relaxed border border-border/50 bg-card/30 rounded-xl px-4 py-4 resize-none placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-card/50 hover:border-border transition-all duration-200"
          required
        />
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <Button type="submit" disabled={isSaving || !title.trim() || !content.trim()}>
          {isSaving ? "Saving..." : "Publish post"}
        </Button>
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
