import { config } from './config'
import { createBrowserClient } from '@supabase/ssr'

export function createClient(detectSessionInUrl = true) {
  return createBrowserClient(
    config().url,
    config().key,
    { auth: { detectSessionInUrl } }
  )
}
