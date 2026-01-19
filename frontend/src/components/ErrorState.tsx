interface ErrorStateProps {
  message?: string;
}

export function ErrorState({ message = 'Error al cargar' }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-destructive">{message}</p>
    </div>
  );
}
