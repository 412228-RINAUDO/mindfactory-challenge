import { Link, useNavigate } from "react-router-dom"
import { FileQuestion, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-6">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">404</h1>
          <h2 className="text-xl font-medium text-foreground mb-3">Página no encontrada</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Lo sentimos, la página que buscas no existe o ha sido movida a otra ubicación.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="default">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Ir al inicio
              </Link>
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver atrás
            </Button>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Si crees que esto es un error, por favor contáctanos.
        </p>
      </div>
    </div>
  )
}
