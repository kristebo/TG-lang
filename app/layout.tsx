import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TG-lang Lab',
  description: 'TG-lang transpiler og runner i nettleseren',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  )
}
