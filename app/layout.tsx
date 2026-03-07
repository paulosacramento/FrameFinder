import type { Metadata } from 'next'
import '@moneydevkit/nextjs/mdk-styles.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeoLocator — AI Photo Geolocation',
  description:
    'Upload a photo and AI identifies the top 3 most likely locations it was taken. Powered by Google Gemini 2.5 Flash. Pay 100 sats via Lightning.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
