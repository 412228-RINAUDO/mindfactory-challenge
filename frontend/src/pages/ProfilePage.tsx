import { Link, useParams } from "react-router-dom"
import { Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/LoadingState"
import { ErrorState } from "@/components/ErrorState"
import { BackLink } from "@/components/BackLink"
import { formatDate } from "@/lib/formatDate"
import { useAuth } from "@/contexts/AuthContext"
import { useUser } from "@/hooks/useUser"

export function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user: currentUser } = useAuth()
  const { data: user, isLoading, error } = useUser(id)

  const isOwner = currentUser?.id === id

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <LoadingState message="Cargando perfil..." />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12">
        <ErrorState message="Error al cargar el perfil" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <BackLink to="/" label="Todos los posts" />

      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {user.name}
          </h1>
          {isOwner && (
            <Link to={`/profile/${user.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Settings className="h-4 w-4" />
                Editar perfil
              </Button>
            </Link>
          )}
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          {user.email}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Se unió el {formatDate(user.created_at)}</span>
        </div>
      </header>

    </div>
  )
}
