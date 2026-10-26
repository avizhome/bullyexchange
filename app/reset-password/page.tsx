'use client'
import { useEffect, useState, type FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { configured } from '@/lib/supabase/config'
import { validateNewPassword, recoveryFragment } from '@/lib/password-recovery'
export default function ResetPassword() {
 const [address,setAddress]=useState(''),[error,setError]=useState(''),[loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[done,setDone]=useState(false)
 useEffect(()=>{
  if(!configured()){setError('Password recovery is unavailable. Please try again later.');setLoading(false);return}
  const fragment=recoveryFragment(window.location.hash)
  if(window.location.hash)window.history.replaceState(null,'','/reset-password')
  const db=createClient(false)
  let active=true
  async function verify() {
   try {
    if(fragment.kind==='error')throw new Error('invalid link')
    if(fragment.kind==='recovery') {
      const {error}=await db.auth.setSession({access_token:fragment.access_token,refresh_token:fragment.refresh_token})
      if(error)throw error
    }
    const {data,error}=await db.auth.getUser()
    if(!active)return
    if(error||!data.user)setError('This reset link is invalid or expired. Request a new reset email.')
    else setAddress(data.user.email||'your account')
   }catch{if(active)setError('Could not verify the reset link. Please request a new email.')}
   finally{if(active)setLoading(false)}
  }
  void verify()
  return ()=>{active=false}
 },[])
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault();setError('')
  const element=event.currentTarget
  const form=new FormData(element)
  let password:string
  try{password=validateNewPassword(String(form.get('password')||''),String(form.get('confirmPassword')||''))}catch(error){setError((error as Error).message);return}
  setSaving(true)
  try {
   const db=createClient()
   const {data:{user},error:authError}=await db.auth.getUser()
   if(authError||!user){setAddress('');setError('Your reset session has expired. Request a new email.');return}
   const {error}=await db.auth.updateUser({password})
   if(error){setError('Password could not be updated. Use a different strong password, or request a new link if this one expired.');return}
   element.reset()
   await db.auth.signOut({scope:'global'})
   setDone(true)
  }catch{setError('The update could not be completed. Please try again.')}finally{setSaving(false)}
 }
 return <main className="auth-page"><section className="auth-card"><a className="brand" href="/"><span className="brand-mark"/><strong>BullyExchange</strong></a><h1>Choose a new password</h1>{loading?<p role="status">Checking your reset link…</p>:done?<><p role="status" className="form-success">Your password has been updated. Sign in with your new password.</p><a className="button button-gold" href="/login">Log in</a></>:<>{error&&<p role="alert" className="form-error">{error}</p>}{address&&<form onSubmit={submit}><p>Updating the password for <strong>{address}</strong>.</p><label>New password<input type="password" name="password" autoComplete="new-password" required minLength={8} maxLength={128}/></label><label>Confirm new password<input type="password" name="confirmPassword" autoComplete="new-password" required minLength={8} maxLength={128}/></label><button type="submit" disabled={saving} className="button button-gold full">{saving?'Updating…':'Save new password'}</button></form>}<p className="auth-foot"><a href="/forgot-password">Request a new reset email</a></p></>}</section></main>
}
