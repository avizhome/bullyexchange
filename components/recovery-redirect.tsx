'use client'
import { useEffect } from 'react'
// Default Supabase dashboard emails use an implicit recovery link. Keep its
// fragment in the browser: it must never be sent to the server or analytics.
export function RecoveryRedirect() {
 useEffect(()=>{
  const hash=new URLSearchParams(window.location.hash.slice(1))
  if(hash.get('type')==='recovery' && window.location.pathname!=='/reset-password') {
   window.location.replace('/reset-password'+window.location.hash)
  }
  if(hash.has('error') && window.location.pathname==='/') {
   window.location.replace('/forgot-password?error=This email link is invalid or expired. Request a new password-reset email.')
  }
 },[])
 return null
}
