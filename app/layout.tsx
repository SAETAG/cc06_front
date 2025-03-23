import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Closet Chronicle",
  description: "This is the story of taking back your closet—and your life.",
  generator: "cc01",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add this script to clean up vsc-initialized class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              // Remove vsc-initialized class from body if it exists
              document.addEventListener('DOMContentLoaded', function() {
                if (document.body && document.body.classList.contains('vsc-initialized')) {
                  document.body.classList.remove('vsc-initialized');
                }
              });
            })();
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

