import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChainCapture - Instant IP Registration',
  description: 'Transform any camera device into an instant IP registration tool with Story Protocol and AI-powered remixing.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900`}>
        {children}
      </body>
    </html>
  )
}
