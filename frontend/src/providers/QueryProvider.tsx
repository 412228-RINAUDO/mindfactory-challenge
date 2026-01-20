import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
  QueryCache
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { notificationService } from "@/services/notificationService";
import { localStorageService } from "@/services/localStorageService";

const THIRTY_SECONDS = 1000 * 30;

const handleAuthError = (error: unknown, queryClient: QueryClient) => {
  if (error && typeof error === "object" && "errorCode" in error) {
    const errorCode = (error as { errorCode: string }).errorCode;

    if (errorCode === "INVALID_TOKEN" || errorCode === "MISSING_TOKEN") {
      localStorageService.remove("user");
      queryClient.clear();
      window.location.href = "/login";
      return true;
    }
  }
  return false;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: THIRTY_SECONDS,
      retry: 1,
      refetchOnWindowFocus: false
    }
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (!handleAuthError(error, queryClient)) {
        if (error && typeof error === "object" && "errorCode" in error) {
          const errorCode = (error as { errorCode: string }).errorCode;
          if (!errorCode.includes("NOT_FOUND")) {
            notificationService.handleError(error);
          }
        }
      }
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      handleAuthError(error, queryClient);
    }
  })
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
