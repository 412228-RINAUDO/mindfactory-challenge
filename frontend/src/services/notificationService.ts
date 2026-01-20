import { toast } from 'sonner';

export type ErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'MISSING_TOKEN'
  | 'INVALID_TOKEN'
  | 'FORBIDDEN'
  | 'POST_NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'CANNOT_REMOVE_LIKE'
  | 'EMAIL_ALREADY_EXISTS'
  | 'BAD_REQUEST';

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  MISSING_TOKEN: 'Debes iniciar sesión',
  INVALID_TOKEN: 'Tu sesión ha expirado, por favor inicia sesión nuevamente',
  FORBIDDEN: 'No tienes permisos para realizar esta acción',
  POST_NOT_FOUND: 'El post que buscas no existe',
  USER_NOT_FOUND: 'Usuario no encontrado',
  CANNOT_REMOVE_LIKE: 'No puedes quitar un like que no has dado',
  EMAIL_ALREADY_EXISTS: 'Este email ya está registrado',
  BAD_REQUEST: 'Datos inválidos, por favor verifica la información',
};

export const notificationService = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  handleError: (error: unknown) => {
    if (error && typeof error === 'object' && 'errorCode' in error) {
      const errorCode = error.errorCode as ErrorCode;
      const message = ERROR_MESSAGES[errorCode] || 'Ocurrió un error inesperado';
      toast.error(message);
    } else {
      toast.error('Ocurrió un error inesperado');
    }
  },
};
