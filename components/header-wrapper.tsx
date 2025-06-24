import { getCustomerByUserId } from "@/actions/customers"
import { SelectCustomer } from "@/db/schema/customers"
import { createClient } from "@/lib/supabase/server"
import { Header } from "./header"

export async function HeaderWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let membership: SelectCustomer["membership"] | null = null

  if (user) {
    const customer = await getCustomerByUserId(user.id)
    membership = customer?.membership ?? "free"
  }

  return <Header user={user} userMembership={membership} />
}
