"use server"

import { db } from "@/db"
import { customers, type SelectCustomer } from "@/db/schema/customers"
import { createClient } from "@/lib/supabase/server"
import { eq } from "drizzle-orm"

export async function getCustomerByUserId(
  userId: string
): Promise<SelectCustomer | null> {
  const customer = await db.query.customers.findFirst({
    where: eq(customers.userId, userId)
  })

  return customer || null
}

export async function getBillingDataByUserId(userId: string): Promise<{
  customer: SelectCustomer | null
  supabaseEmail: string | null
  stripeEmail: string | null
}> {
  // Get Supabase user data
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get profile to fetch Stripe customer ID
  const customer = await db.query.customers.findFirst({
    where: eq(customers.userId, userId)
  })

  // Get Stripe email if it exists
  const stripeEmail = customer?.stripeCustomerId
    ? user?.email || null
    : null

  return {
    customer: customer || null,
    supabaseEmail: user?.email || null,
    stripeEmail
  }
}

export async function createCustomer(
  userId: string
): Promise<{ isSuccess: boolean; data?: SelectCustomer }> {
  try {
    const [newCustomer] = await db
      .insert(customers)
      .values({
        userId,
        membership: "free"
      })
      .returning()

    if (!newCustomer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: newCustomer }
  } catch (error) {
    console.error("Error creating customer:", error)
    return { isSuccess: false }
  }
}

export async function updateCustomerByUserId(
  userId: string,
  updates: Partial<SelectCustomer>
): Promise<{ isSuccess: boolean; data?: SelectCustomer }> {
  try {
    const [updatedCustomer] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.userId, userId))
      .returning()

    if (!updatedCustomer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: updatedCustomer }
  } catch (error) {
    console.error("Error updating customer by userId:", error)
    return { isSuccess: false }
  }
}

export async function updateCustomerByStripeCustomerId(
  stripeCustomerId: string,
  updates: Partial<SelectCustomer>
): Promise<{ isSuccess: boolean; data?: SelectCustomer }> {
  try {
    const [updatedCustomer] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.stripeCustomerId, stripeCustomerId))
      .returning()

    if (!updatedCustomer) {
      return { isSuccess: false }
    }

    return { isSuccess: true, data: updatedCustomer }
  } catch (error) {
    console.error("Error updating customer by stripeCustomerId:", error)
    return { isSuccess: false }
  }
}
