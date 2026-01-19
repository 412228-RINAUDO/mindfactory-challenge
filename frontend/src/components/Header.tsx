import { PenLine } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth } from "@/contexts/AuthContext"
 
export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }


  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0">
      <nav className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className="font-semibold text-lg tracking-tight hover:text-primary transition-colors"
          >
            Writespace
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user?.id ? (
            <>
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link to="/posts/create">
                  <PenLine className="h-4 w-4" />
                  <span className="hidden sm:inline">Escribir</span>
                </Link>
              </Button>
              <Link
                to={`/profile/${user?.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {user?.name}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
