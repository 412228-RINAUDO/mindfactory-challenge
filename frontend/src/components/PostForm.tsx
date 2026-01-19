import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface PostFormProps {
  initialTitle?: string
  initialContent?: string
  onSubmit: (data: { title: string; content: string }) => void
  isSubmitting?: boolean
  isEditing?: boolean
}

export function PostForm({
  initialTitle = "",
  initialContent = "",
  onSubmit,
  isSubmitting = false,
  isEditing = false
}: PostFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, content })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Input
          data-testid="post-title-input"
          type="text"
          placeholder="Título de la publicación"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl sm:text-4xl font-bold tracking-tight border border-border/50 bg-card/30 rounded-xl px-4 h-auto py-4 placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:border-ring focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-card/50 hover:border-border transition-all duration-200"
          required
        />
      </div>

      <div className="mb-8">
        <Textarea
          data-testid="post-content-textarea"
          placeholder="Escribe tu historia..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[50vh] text-lg leading-relaxed border border-border/50 bg-card/30 rounded-xl px-4 py-4 resize-none placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-card/50 hover:border-border transition-all duration-200"
          required
        />
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-border">
        <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
          {isSubmitting ? "Guardando..." : isEditing ? "Actualizar publicación" : "Publicar" }
        </Button>
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
