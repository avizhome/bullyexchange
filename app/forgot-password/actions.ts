'use server'
import { createClient } from '@/lib/supabase/server'
import { email } from '@/lib/validation'
import { redirect } from 'next/navigation'
import { recoveryOrigin } from '@/lib/password-recovery'
export async function requestPasswordReset(data: FormData) {
  let address: string
  try { address = email(data) } catch { redirect('/forgot-password?error=Enter a valid email address.') }
  const db=await createClient()
  const {error}=await db.auth.resetPasswordForEmail(address,{redirectTo:`${recoveryOrigin}/auth/callback`})
  if(error) redirect('/forgot-password?error=We could not send a reset email. Please wait a few minutes and try again. If it continues, contact the store operator.')
  redirect('/forgot-password?message=If an account exists for that address, a password-reset email has been requested. Check your inbox and spam folder. Open the newest link in this same browser.')
}
