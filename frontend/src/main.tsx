import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/appcontext";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext"; // <-- import your new UserProvider
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <UserProvider> {/* wrap App with UserProvider */}
            <App />
          </UserProvider>
        </AppProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
