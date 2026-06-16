'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import queryClient from '@/lib/queryClient'
import './globals.css'
import { Toaster } from 'sonner'

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
    <body>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </body>
    </html>
  )
}