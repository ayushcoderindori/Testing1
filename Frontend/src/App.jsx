import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Router from "./router/index.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeContextProvider>
            <AuthProvider>
              <Router />
            </AuthProvider>
          </ThemeContextProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
