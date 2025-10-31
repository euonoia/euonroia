import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProvider } from '../src/context/appcontext' // ✅ import your context provider

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider> {/* ✅ Wrap your entire app */}
        <App />
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
