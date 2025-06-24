"use client"

import { createCheckoutUrl } from "@/actions/stripe"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"

interface PricingButtonProps {
  paymentLink: string
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary"
}

export function PricingButton({
  paymentLink,
  children,
  className,
  variant = "default"
}: PricingButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initializeUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    initializeUser()
  }, [])

  const handleClick = async () => {
    if (!user) {
      // Store the payment link for post-auth redirect
      sessionStorage.setItem("pendingCheckout", paymentLink)
      toast.info("Please sign in to continue")
      router.push("/login")
      return
    }

    setIsLoading(true)
    try {
      const result = await createCheckoutUrl(paymentLink)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.url) {
        window.location.href = result.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to start checkout"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      variant={variant}
    >
      {isLoading ? "Loading..." : children}
    </Button>
  )
}
