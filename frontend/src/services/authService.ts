import { apiClient } from "@/api/client";
import { HttpMethod } from "@/enums/httpMethods";
import type { AuthResponse, SignupData } from "@/interfaces/Auth";


export const authService = {
  login: (email: string, password: string) =>
    apiClient<AuthResponse>("/auth/login", {
      method: HttpMethod.POST,
      body: JSON.stringify({ email, password })
    }),

  signup: (data: SignupData) =>
    apiClient<AuthResponse>("/auth/register", {
      method: HttpMethod.POST,
      body: JSON.stringify(data)
    }),

};
