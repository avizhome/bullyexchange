import { createClient } from '@/lib/supabase/server'
import { updatePuppy } from '@/app/actions'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditPuppyPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string }> }) {
  const { id } = await params
  const { error } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: puppy } = await supabase.from('puppies').select('*,stores!inner(owner_id,name)').eq('id',id).single()
  if (!puppy || puppy.stores.owner_id !== user.id) notFound()

  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Seller Portal</small></span></a><a className="button button-soft" href="/seller/dashboard">← Dashboard</a></header>
    <section className="page-width seller-apply-layout"><form className="seller-form" action={updatePuppy}><input type="hidden" name="puppyId" value={puppy.id}/>{error && <p className="form-error">{error}</p>}<div className="form-section"><p className="eyebrow dark">EDIT LISTING</p><h1>{puppy.name}</h1><div className="form-grid two"><label>Name<input required name="name" defaultValue={puppy.name}/></label><label>Breed<input required name="breed" defaultValue={puppy.breed}/></label><label>Bully type<select name="bullyType" defaultValue={puppy.bully_type || 'Standard'}><option>Standard</option><option>Pocket</option><option>Classic</option><option>XL</option><option>Exotic</option></select></label><label>Sex<select name="sex" defaultValue={puppy.sex}><option>Male</option><option>Female</option></select></label><label>Age in weeks<input required name="ageWeeks" type="number" min="1" defaultValue={puppy.age_weeks}/></label><label>Colour<input name="colour" defaultValue={puppy.colour || ''}/></label><label>Price (AUD)<input required name="price" type="number" min="0" step="1" defaultValue={Number(puppy.price)}/></label><label>Location<input required name="location" defaultValue={puppy.location}/></label></div><label>Image URL<input name="imageUrl" defaultValue={puppy.image_url || ''}/></label><label>Description<textarea required name="description" defaultValue={puppy.description}/></label><label>Status<select name="status" defaultValue={puppy.status}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option><option value="hidden">Hidden</option></select></label></div><button className="button button-gold submit-application" type="submit">Save changes</button></form><aside className="application-aside"><div className="aside-card"><p className="eyebrow dark">STORE</p><h3>{puppy.stores.name}</h3><p>Changes are reflected on the public listing immediately.</p></div></aside></section>
  </main>
}
