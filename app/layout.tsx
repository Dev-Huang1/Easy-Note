import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: Easy Note | Privacy Note App",
  description: "A simple privacy note app | Powered by Tech-Art",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
  )
}

