import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
export async function GET(request: NextRequest) {
 const token_hash=request.nextUrl.searchParams.get('token_hash')
 const type=request.nextUrl.searchParams.get('type')
 if(token_hash && type==='signup') {
   const db=await createClient()
   const {error}=await db.auth.verifyOtp({token_hash,type:type as EmailOtpType})
   if(!error) return NextResponse.redirect(new URL('/seller/dashboard',request.url))
 }
 return NextResponse.redirect(new URL('/login?error=Confirmation link is invalid or expired. Please request a new signup email.',request.url))
}
