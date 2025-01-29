import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Circular Album Showcase",     
  description: "A 3D circular showcase of album covers",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div className="fixed inset-0 pointer-events-none">
          <a 
            className="absolute top-10 left-10 text-sm text-white pointer-events-auto hover:text-gray-300 transition-colors"
            href="#"
          >
            scroll up/down ...
          </a>
        </div>
      </body>
    </html>
  )
}
