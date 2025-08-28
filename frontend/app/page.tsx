"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Dashboard from "../dashboard"
import LandingPage from "./landing/page"
import { useAuth } from "@/contexts/auth-context"

export default function Page() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <Dashboard />
}
