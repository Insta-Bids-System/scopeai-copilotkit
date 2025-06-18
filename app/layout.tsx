import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ScopeAI - AI-Powered Pain Point Discovery',
  description: 'Discover and analyze business pain points with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
