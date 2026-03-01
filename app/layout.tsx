import type { Metadata, Viewport } from 'next'
import { Inter, Rubik } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: 'Carelo - Care Without Compromise',
  description: 'A family ecosystem that lets you balance work and life without sacrificing care for your elderly loved ones.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#8EC8E8',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${rubik.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
