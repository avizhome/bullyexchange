import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg'

export default async function PuppiesPage() {
  const supabase = await createClient()
  const { data: puppies } = await supabase.from('puppies').select('id,name,breed,bully_type,sex,age_weeks,colour,price,location,image_url,status,stores(name,slug,status)').in('status',['available','reserved','sold']).order('created_at',{ascending:false})
  const visible = (puppies ?? []).filter((p:any) => p.stores?.status === 'active')

  return <main>
    <header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav"><a href="/">Home</a><a className="active" href="/puppies">Puppies</a><a href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a></nav><div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div></header>
    <section className="listing-hero"><div className="page-width"><p className="eyebrow">FIND YOUR MATCH</p><h1>Puppies for sale</h1><p>Live listings from approved BullyExchange stores.</p></div></section>
    <section className="page-width stores-listing-section"><div className="results-head"><div><p className="eyebrow dark">AVAILABLE NOW</p><h2>{visible.length} puppies</h2></div></div>
      {visible.length ? <div className="results-grid">{visible.map((dog:any,index:number)=><article className="puppy-card marketplace-card" key={dog.id}><div className="image-wrap"><img className={`listing-image listing-image-${index%4}`} src={dog.image_url || fallbackImage} alt={`${dog.name} ${dog.breed}`}/><div className="verified-badge">✓ Approved seller</div></div><div className="card-body"><div className="listing-title-row"><div><p className="card-breed">{dog.bully_type ? `${dog.bully_type} `:''}{dog.breed}</p><h3>{dog.name}</h3></div><strong className="price">${Number(dog.price).toLocaleString()}</strong></div><p className="muted">{dog.sex} • {dog.age_weeks} weeks {dog.colour ? `• ${dog.colour}`:''}</p><p className="muted location">⌖ {dog.location}</p><div className="seller-mini"><span className="seller-avatar">{dog.stores?.name?.slice(0,2).toUpperCase()}</span><span><strong>{dog.stores?.name}</strong><small>Approved seller</small></span></div><a className="button button-soft full" href={`/puppies/${dog.id}`}>View puppy</a></div></article>)}</div> : <div className="empty-market"><h2>No live puppy listings yet.</h2><p>Once an approved seller publishes a puppy, it will appear here automatically.</p></div>}
    </section>
  </main>
}
