import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingState } from "@/components/LoadingState"
import { BackLink } from "@/components/BackLink"
import { useAuth } from "@/contexts/AuthContext"
import { useUser, useUpdateUser } from "@/hooks/useUser"

export function ProfileEditPage() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const { data: user, isLoading } = useUser(currentUser?.id)
  const { mutate: updateUser, isPending } = useUpdateUser(currentUser?.id || "")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    updateUser(
      { name, email },
      {
        onSuccess: () => {
          navigate(`/profile/${currentUser?.id}`)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <LoadingState message="Cargando perfil..." />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <BackLink to={`/profile/${currentUser?.id}`} label="Volver al perfil" />

      <h1 className="text-2xl font-bold tracking-tight mb-8">Editar perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            data-testid="profile-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-secondary/50 border-border focus:bg-secondary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            data-testid="profile-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-border focus:bg-secondary"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Link to={`/profile/${currentUser?.id}`}>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
