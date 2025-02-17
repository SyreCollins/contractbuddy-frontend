"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function VerifyEmailContent() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [redirect, setRedirect] = useState("/dashboard")

  useEffect(() => {
    const verifyEmail = async () => {
      setIsLoading(true)
      const query = new URLSearchParams(window.location.search)
      const token = query.get("token")
      const redirectPath = query.get("redirect") || "/dashboard"
      setRedirect(redirectPath)

      if (!token) {
        setError("Please check your email for the verification link.")
        setIsLoading(false)
        return
      }

      try {
        const { error } = await supabase.auth.verifyOtp({ token_hash: token, type: "email" })

        if (error) {
          throw error
        }

        setIsVerified(true)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmail()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/login")}>Back to Login</Button>
      </div>
    )
  }

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Alert variant="default" className="mb-4 bg-green-100">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your email has been verified successfully!</AlertDescription>
        </Alert>
        <Button onClick={() => router.push(redirect)}>Go to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Verifying email... If you haven't received a verification email, please check your spam folder.</p>
    </div>
  )
}

