import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SellerDashboard({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase.from('stores').select('*').eq('owner_id', user.id).maybeSingle()
  if (!store) {
    const { data: application } = await supabase.from('seller_applications').select('status').eq('user_id',user.id).order('created_at',{ascending:false}).limit(1).maybeSingle()
    if (application?.status === 'pending') redirect('/seller/application-submitted')
    redirect('/seller/apply')
  }

  const { data: puppies } = await supabase.from('puppies').select('*').eq('store_id',store.id).order('created_at',{ascending:false})
  const { error, message } = await searchParams
  const activeCount = puppies?.filter(p => p.status === 'available').length ?? 0

  return <main>
    <header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Seller Portal</small></span></a><nav className="desktop-nav"><a href="/">Marketplace</a><a href="/puppies">Puppies</a><a href="/stores">Stores</a></nav><form action={logout}><button className="button button-soft small-button" type="submit">Log out</button></form></header>
    <section className="dashboard-shell page-width"><div className="dashboard-top"><div><p className="eyebrow dark">SELLER PORTAL</p><h1>{store.name}</h1><p className="muted">Manage your store and puppy listings.</p></div><span className="dashboard-status">{store.status === 'active' ? '✓ Store approved' : store.status}</span></div>
    {error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}
    <div className="dashboard-grid"><aside className="dashboard-nav"><a className="selected" href="/seller/dashboard">Overview</a><a href="/seller/dashboard/puppies/new">+ Add puppy</a><a href={`/stores/${store.slug}`}>View public store</a><form action={logout}><button className="dashboard-logout" type="submit">Log out</button></form></aside>
    <div className="dashboard-main"><div className="metric-grid"><div><span>Available puppies</span><strong>{activeCount}</strong><small>Public listings</small></div><div><span>Total listings</span><strong>{puppies?.length ?? 0}</strong><small>All statuses</small></div><div><span>Store status</span><strong className="metric-status">{store.status}</strong><small>{store.location}</small></div></div>
    <div className="dashboard-panel"><div className="panel-heading"><div><p className="eyebrow dark">YOUR LISTINGS</p><h2>Puppies</h2></div><a className="button button-gold" href="/seller/dashboard/puppies/new">+ Add puppy</a></div>
      <div className="listing-table"><div className="listing-row table-head"><span>Puppy</span><span>Status</span><span>Price</span><span>Age</span><span>Manage</span></div>
      {puppies?.length ? puppies.map(p => <div className="listing-row" key={p.id}><span><strong>{p.name}</strong><small>{p.bully_type || p.breed}</small></span><span className={p.status==='available'?'status-live':'status-reserved'}>{p.status}</span><span>${Number(p.price).toLocaleString()}</span><span>{p.age_weeks} weeks</span><span><a className="table-edit-link" href={`/seller/dashboard/puppies/${p.id}/edit`}>Edit</a></span></div>) : <p className="empty-state">No puppies yet. Add your first listing.</p>}
      </div></div></div></div></section>
  </main>
}
