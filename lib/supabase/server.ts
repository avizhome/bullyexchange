import { config } from './config'
import { createServerClient } from '@supabase/ssr'
import { configured } from './config'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function createClient() {
  if (!configured()) redirect('/setup')
  const cookieStore = await cookies()

  return createServerClient(
    config().url,
    config().key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components cannot write cookies. proxy.ts handles refreshes.
          }
        },
      },
    }
  )
}
