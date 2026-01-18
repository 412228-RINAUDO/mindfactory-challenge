import { useState, useEffect } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
        <div className="text-center py-12 text-muted-foreground">
          Loading profile...
        </div>
      </div>
    )
  }


  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      {/* Back Link */}
      <Link
        to={`/profile/${currentUser?.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold tracking-tight mb-8">Edit profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-secondary/50 border-border focus:bg-secondary"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
          <Link to={`/profile/${currentUser?.id}`}>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
