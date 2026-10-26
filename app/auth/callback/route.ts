import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export async function GET(request:NextRequest) {
 const code=request.nextUrl.searchParams.get('code')
 if(code) {
   const db=await createClient()
   const {error}=await db.auth.exchangeCodeForSession(code)
   if(!error) {
     const response=NextResponse.redirect(new URL('/reset-password',request.url))
     response.headers.set('Cache-Control','no-store')
     response.headers.set('Referrer-Policy','no-referrer')
     return response
   }
 }
 return NextResponse.redirect(new URL('/forgot-password?error=This reset link is invalid or expired. Request a new link and open it in the same browser.',request.url))
}
