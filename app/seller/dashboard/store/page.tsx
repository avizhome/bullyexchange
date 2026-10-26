import { createClient } from '@/lib/supabase/server'
import { updateStore } from '@/app/actions'
import { redirect } from 'next/navigation'
import { SubmitButton } from '@/components/submit-button'
export const dynamic = 'force-dynamic'
export default async function StoreSettings({searchParams}:{searchParams:Promise<{error?:string}>}) {
 const db=await createClient()
 const {data:{user}}=await db.auth.getUser()
 if(!user) redirect('/login')
 const {data:store}=await db.from('stores').select('*').eq('owner_id',user.id).eq('status','active').maybeSingle()
 if(!store) redirect('/seller/dashboard')
 const {error}=await searchParams
 return <main className="page-width dashboard-shell"><a href="/seller/dashboard">← Dashboard</a><h1>Store details</h1><p>Your store was created when your application was approved. Add a public contact email so buyers can reach you.</p><form className="seller-form" action={updateStore}>{error&&<p role="alert" className="form-error">{error}</p>}<label>Store name<input name="name" required maxLength={100} defaultValue={store.name}/></label><label>Location<input name="location" required defaultValue={store.location}/></label><label>Primary breed<input name="breed" required defaultValue={store.primary_breed}/></label><label>Public contact email<input type="email" name="contactEmail" required defaultValue={store.contact_email||''}/><small>This address will be visible to buyers.</small></label><label>Banner image URL (optional, HTTPS)<input type="url" name="bannerUrl" defaultValue={store.banner_url||''}/></label><label>About your store<textarea name="about" minLength={20} maxLength={5000} required defaultValue={store.about||''}/></label><SubmitButton>Save store</SubmitButton></form></main>
}
