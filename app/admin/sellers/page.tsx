import { Header } from '@/components/header'
import { approveSeller, rejectSeller, suspendStore, restoreStore, logout } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminSellersPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id',user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  const { data: applications } = await supabase.from('seller_applications').select('*').eq('status','pending').order('created_at',{ascending:true})
  const { data: stores } = await supabase.from('stores').select('*').order('created_at',{ascending:false})
  const { error } = await searchParams

  return <main>
    <Header/>
    <section className="page-width admin-page"><div className="dashboard-top"><div><p className="eyebrow dark">ADMIN PORTAL</p><h1>Seller applications</h1><p className="muted">Approve sellers, create stores automatically and suspend stores when required.</p></div></div>
    {error && <p className="form-error">{error}</p>}
    <div className="admin-tabs"><a href="#pending" className="active">Pending <b>{applications?.length ?? 0}</b></a><a href="#current-stores">Stores <b>{stores?.length ?? 0}</b></a></div>
    <div id="pending" className="admin-applications">
      {applications?.length ? applications.map(a => <article className="application-card" key={a.id}><div className="application-main"><span className="app-avatar">{a.store_name.slice(0,2).toUpperCase()}</span><div><p className="eyebrow dark">PENDING REVIEW</p><h2>{a.store_name}</h2><p>{a.location} • {a.primary_breed} {a.bully_type ? `• ${a.bully_type}` : ''}</p><small>Submitted {new Date(a.created_at).toLocaleDateString('en-AU')}</small></div></div><div className="application-meta"><div><span>Phone</span><strong>{a.phone}</strong></div><div><span>Registration</span><strong>{a.registration_number || 'Not supplied'}</strong></div><div><span>About</span><strong>{a.about.slice(0,80)}{a.about.length>80?'…':''}</strong></div></div><div className="application-actions"><form action={rejectSeller}><input type="hidden" name="applicationId" value={a.id}/><button className="button reject-btn" type="submit">Reject</button></form><form action={approveSeller}><input type="hidden" name="applicationId" value={a.id}/><button className="button approve-btn" type="submit">Approve seller</button></form></div></article>) : <div className="dashboard-panel"><h2>No pending applications</h2><p className="muted">New seller applications will appear here.</p></div>}
    </div>
    <div id="current-stores" className="dashboard-panel"><p className="eyebrow dark">CURRENT STORES</p><h2>Seller access</h2><div className="listing-table"><div className="listing-row table-head"><span>Store</span><span>Status</span><span>Location</span><span>Breed</span><span>Action</span></div>{stores?.map(s => <div className="listing-row" key={s.id}><span><strong>{s.name}</strong><small>/{s.slug}</small></span><span className={s.status==='active'?'status-live':'status-reserved'}>{s.status}</span><span>{s.location}</span><span>{s.primary_breed}</span><span>{s.status==='active'?<form action={suspendStore}><input type="hidden" name="storeId" value={s.id}/><button type="submit">Suspend</button></form>:<form action={restoreStore}><input type="hidden" name="storeId" value={s.id}/><button type="submit">Restore</button></form>}</span></div>)}</div></div>
    </section>
  </main>
}
