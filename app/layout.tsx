import type { Metadata } from 'next'
import { AppShell } from '@/components/shell/AppShell'
import { SessionProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'TAC Emergency IRS Responder',
  description: 'Professional IRS notice response generation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AppShell>{children}</AppShell>
        </SessionProvider>
      </body>
    </html>
  )
}
