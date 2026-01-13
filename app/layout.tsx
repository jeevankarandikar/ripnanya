import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In Loving Memory of Ananya',
  description: 'A memorial page for Ananya Sehgal',
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
