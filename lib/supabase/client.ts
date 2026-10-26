import { config } from './config'
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    config().url,
    config().key
  )
}
