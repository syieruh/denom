"use client"

import dynamic from "next/dynamic"
import { Suspense, useState, useEffect } from "react"

const Scene = dynamic(() => import("../components/Scene"), { ssr: false })

function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-xl">Loading...</div>
    </div>
  )
}

function ErrorBoundary({ children, error }: { children: React.ReactNode, error: Error | null }) {
  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-xl text-red-500">Error: {error.message}</div>
      </div>
    )
  }

  return children
}

export default function Home() {
  const [error, setError] = useState<Error | null>(null)

  return (
    <ErrorBoundary error={error}>
      <main className="w-full h-screen">
        <Suspense fallback={<Loading />}>
          <Scene />
        </Suspense>
      </main>
    </ErrorBoundary>
  )
}
