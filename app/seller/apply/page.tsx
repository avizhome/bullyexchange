import { submitSellerApplication } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function SellerApplyPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?message=Please sign in before applying to become a seller.')

  const { data: existing } = await supabase.from('seller_applications').select('status').eq('user_id', user.id).in('status', ['pending','approved']).maybeSingle()
  if (existing?.status === 'pending') redirect('/seller/application-submitted')
  if (existing?.status === 'approved') redirect('/seller/dashboard')

  const { error } = await searchParams
  return <main>
    <header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav"><a href="/">Home</a><a href="/puppies">Puppies</a><a href="/stores">Stores</a><a className="active" href="/seller/apply">Become a Seller</a></nav></header>
    <section className="seller-apply-hero"><div className="page-width seller-apply-hero-inner"><div><p className="eyebrow">SELL ON BULLYEXCHANGE</p><h1>Open your breeder store.</h1><p>Submit your application. Your store stays private until an administrator approves it.</p></div><div className="approval-steps"><div><strong>1</strong><span>Apply</span></div><div><strong>2</strong><span>Admin review</span></div><div><strong>3</strong><span>Store created</span></div><div><strong>4</strong><span>Start listing</span></div></div></div></section>
    <section className="page-width seller-apply-layout">
      <form className="seller-form" action={submitSellerApplication}>
        {error && <p className="form-error">{error}</p>}
        <div className="form-section"><p className="eyebrow dark">YOUR DETAILS</p><h2>Seller information</h2><div className="form-grid two"><label>Phone<input required name="phone" placeholder="04xx xxx xxx"/></label><label>Location<input required name="location" placeholder="City, State"/></label></div></div>
        <div className="form-section"><p className="eyebrow dark">YOUR STORE</p><h2>Breeder/store details</h2><div className="form-grid two"><label>Proposed store name<input required name="storeName" placeholder="e.g. Bully Empire Kennels"/></label><label>Primary breed<select name="breed" defaultValue="American Bully"><option>American Bully</option><option>French Bulldog</option><option>Staffy</option><option>Other</option></select></label><label>Bully type<select name="type" defaultValue="All / multiple"><option>All / multiple</option><option>Pocket</option><option>Standard</option><option>Classic</option><option>XL</option><option>Exotic</option></select></label><label>Breeder / registration number<input name="registration" placeholder="If applicable"/></label></div><label>Website or social page<input name="social" placeholder="https://..."/></label><label>Tell us about your breeding program<textarea required name="about" placeholder="Tell us about your dogs, experience and what buyers can expect."/></label></div>
        <div className="form-section"><p className="eyebrow dark">SELLER CONDITIONS</p><h2>Before submitting</h2><label className="check-line"><input required type="checkbox"/><span>I agree that BullyExchange may suspend or cancel my seller account if marketplace conditions are breached.</span></label><label className="check-line"><input required type="checkbox"/><span>I understand buyers and sellers arrange payment directly during this initial version.</span></label></div>
        <button className="button button-gold submit-application" type="submit">Submit seller application</button>
      </form>
      <aside className="application-aside"><div className="aside-card"><p className="eyebrow dark">APPROVAL PROCESS</p><h3>Your store will not go live immediately.</h3><p>Your application begins as <strong>Pending</strong>. Approval automatically creates your store and unlocks the seller dashboard.</p><div className="status-flow"><span>Pending</span><b>→</b><span>Approved</span><b>→</b><span>Active store</span></div></div></aside>
    </section>
  </main>
}
