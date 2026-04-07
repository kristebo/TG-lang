import type { Metadata } from 'next'
import { TGStopProvider } from './providers/TGStopProvider'
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
      <body>
        <TGStopProvider>{children}</TGStopProvider>
      </body>
    </html>
  )
}
