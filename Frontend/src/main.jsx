// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { ThemeContextProvider } from "./contexts/ThemeContext.jsx";

// 1️⃣ Instantiate React‑Query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2️⃣ Theme provider with light/dark mode support */}
    <ThemeContextProvider>
      {/* 3️⃣ Browser router for SPA */}
      <BrowserRouter>
        {/* 4️⃣ Authentication context */}
        <AuthProvider>
          {/* 5️⃣ React‑Query context */}
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeContextProvider>
  </React.StrictMode>
);
