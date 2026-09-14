import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg'

export default async function PuppyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: dog } = await supabase.from('puppies').select('*,stores(*)').eq('id',id).single()
  if (!dog || !['available','reserved','sold'].includes(dog.status) || dog.stores?.status !== 'active') notFound()
  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav"><a href="/">Home</a><a className="active" href="/puppies">Puppies</a><a href="/stores">Stores</a></nav></header>
    <div className="page-width breadcrumb"><a href="/">Home</a><span>›</span><a href="/puppies">Puppies</a><span>›</span><strong>{dog.name}</strong></div>
    <section className="page-width puppy-detail-grid"><div><div className="detail-gallery"><div className="main-photo"><img src={dog.image_url || fallbackImage} alt={dog.name}/></div></div><div className="detail-section"><p className="eyebrow dark">ABOUT {dog.name.toUpperCase()}</p><h2>{dog.bully_type || dog.breed} puppy</h2><p>{dog.description}</p></div></div><aside className="detail-sidebar"><div className="detail-card"><div className="detail-topline"><span className="verified-pill">✓ Approved seller</span></div><p className="card-breed">{dog.bully_type ? `${dog.bully_type} `:''}{dog.breed}</p><h1>{dog.name}</h1><div className="detail-price">${Number(dog.price).toLocaleString()}</div><p className="detail-location">⌖ {dog.location}</p><div className="spec-grid"><div><small>Sex</small><strong>{dog.sex}</strong></div><div><small>Age</small><strong>{dog.age_weeks} weeks</strong></div><div><small>Colour</small><strong>{dog.colour || 'Ask seller'}</strong></div><div><small>Status</small><strong>{dog.status}</strong></div></div><a href={`mailto:?subject=Enquiry about ${dog.name}`} className="button button-gold full detail-contact">Contact seller</a><p className="payment-note">BullyExchange does not process payments. Confirm all arrangements directly with the seller.</p></div><div className="seller-profile"><p className="eyebrow dark">APPROVED STORE</p><h3>{dog.stores.name}</h3><p className="muted">⌖ {dog.stores.location}</p><a className="store-link" href={`/stores/${dog.stores.slug}`}>View breeder store →</a></div></aside></section>
  </main>
}
