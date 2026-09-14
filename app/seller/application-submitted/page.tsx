import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SubmittedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: app } = await supabase.from('seller_applications').select('store_name,status,created_at').eq('user_id', user.id).order('created_at',{ascending:false}).limit(1).maybeSingle()
  if (!app) redirect('/seller/apply')
  if (app.status === 'approved') redirect('/seller/dashboard')

  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a></header><section className="success-page"><div className="success-card"><div className="success-icon">✓</div><p className="eyebrow dark">APPLICATION RECEIVED</p><h1>We’ll review your store.</h1><p><strong>{app.store_name}</strong> is currently awaiting admin approval. Once approved, your seller dashboard and public store will become available.</p><div className="pending-box"><span>Status</span><strong>{app.status.toUpperCase()}</strong></div><div className="success-actions"><a className="button button-dark" href="/">Back to home</a><a className="button button-soft" href="/seller/dashboard">Check status</a></div></div></section></main>
}
