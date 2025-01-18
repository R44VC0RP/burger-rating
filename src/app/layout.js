import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Burger Ratings',
  description: 'Rate your burgers and sandwiches with AI-powered analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <Script
  defer
  data-website-id="678b1d176dfb91e26e60f9f6"
  data-domain="burger-rating.vercel.app"
  src="https://datafa.st/js/script.js">
</Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
