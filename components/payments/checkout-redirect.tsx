"use client"

import { createCheckoutUrl } from "@/actions/stripe"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"

export function CheckoutRedirect() {
  const [hasChecked, setHasChecked] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const initializeUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    initializeUser()
  }, [])

  useEffect(() => {
    const handlePendingCheckout = async () => {
      // Only run once per mount and if signed in
      if (!user || hasChecked) return

      setHasChecked(true)

      const pendingCheckout = sessionStorage.getItem("pendingCheckout")
      if (!pendingCheckout) return

      // Clear the pending checkout immediately to prevent loops
      sessionStorage.removeItem("pendingCheckout")

      try {
        const result = await createCheckoutUrl(pendingCheckout)

        if (result.error) {
          toast.error(result.error)
          return
        }

        if (result.url) {
          // Redirect to Stripe checkout
          window.location.href = result.url
        }
      } catch (error) {
        console.error("Checkout redirect error:", error)
        toast.error("Failed to redirect to checkout")
      }
    }

    handlePendingCheckout()
  }, [user, hasChecked])

  return null
}
