import { createClient } from '@/lib/supabase/server'
import { createPuppy } from '@/app/actions'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function NewPuppyPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: store } = await supabase.from('stores').select('id,name,status,location').eq('owner_id',user.id).maybeSingle()
  if (!store || store.status !== 'active') redirect('/seller/dashboard')
  const { error } = await searchParams

  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Seller Portal</small></span></a><a className="button button-soft" href="/seller/dashboard">← Dashboard</a></header>
    <section className="page-width seller-apply-layout"><form className="seller-form" action={createPuppy}>{error && <p className="form-error">{error}</p>}<div className="form-section"><p className="eyebrow dark">NEW LISTING</p><h1>Add a puppy</h1><div className="form-grid two"><label>Name<input required name="name" placeholder="Titan"/></label><label>Breed<input required name="breed" defaultValue="American Bully"/></label><label>Bully type<select name="bullyType"><option>Standard</option><option>Pocket</option><option>Classic</option><option>XL</option><option>Exotic</option></select></label><label>Sex<select name="sex"><option>Male</option><option>Female</option></select></label><label>Age in weeks<input required name="ageWeeks" type="number" min="1"/></label><label>Colour<input name="colour" placeholder="Blue & white"/></label><label>Price (AUD)<input required name="price" type="number" min="0" step="1"/></label><label>Location<input required name="location" defaultValue={store.location}/></label></div><label>Image URL<input name="imageUrl" placeholder="https://... (image upload comes next)"/></label><label>Description<textarea required name="description" placeholder="Temperament, health, vaccinations, parent information..."/></label><label>Status<select name="status"><option value="available">Available</option><option value="reserved">Reserved</option><option value="hidden">Hidden draft</option></select></label></div><button className="button button-gold submit-application" type="submit">Publish puppy listing</button></form><aside className="application-aside"><div className="aside-card"><p className="eyebrow dark">STORE</p><h3>{store.name}</h3><p>Listings created here will appear publicly when their status is <strong>Available</strong>, <strong>Reserved</strong> or <strong>Sold</strong>.</p></div></aside></section>
  </main>
}
