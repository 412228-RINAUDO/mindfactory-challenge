export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  return date.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
