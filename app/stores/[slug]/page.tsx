import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import styles from '../stores.module.css'

export const dynamic = 'force-dynamic'
const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg'

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: store } = await supabase.from('stores').select('*').eq('slug',slug).eq('status','active').single()
  if (!store) notFound()
  const { data: puppies } = await supabase.from('puppies').select('*').eq('store_id',store.id).in('status',['available','reserved','sold']).order('created_at',{ascending:false})
  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav"><a href="/">Home</a><a href="/puppies">Puppies</a><a className="active" href="/stores">Stores</a></nav></header>
    <div className="page-width breadcrumb"><a href="/">Home</a><span>›</span><a href="/stores">Stores</a><span>›</span><strong>{store.name}</strong></div>
    <section className={`page-width ${styles.storefrontHero}`}><div className={styles.cover}><img src={store.banner_url || fallbackImage} alt={store.name}/><div className={styles.coverOverlay}/></div><div className={styles.profile}><div className={styles.profileLogo}>{store.name.slice(0,2).toUpperCase()}</div><div className={styles.profileTitle}><div className={styles.nameRow}><h1>{store.name}</h1><span className="verified-pill">✓ Verified seller</span></div><p>{store.primary_breed}{store.bully_type ? ` • ${store.bully_type}`:''}</p><p className="muted">⌖ {store.location}</p></div></div></section>
    <section className={`page-width ${styles.storeLayout}`}><div><div className={styles.storeSection}><p className="eyebrow dark">ABOUT THE STORE</p><h2>{store.name}</h2><p>{store.about || 'Approved BullyExchange seller.'}</p></div><div className={styles.storeSection}><div className="section-heading"><div><p className="eyebrow dark">AVAILABLE NOW</p><h2>Current puppies</h2></div></div><div className={styles.puppiesGrid}>{puppies?.map((p:any)=><article className="puppy-card" key={p.id}><div className="image-wrap"><img className="listing-image" src={p.image_url || fallbackImage} alt={p.name}/><div className="verified-badge">✓ Verified seller</div></div><div className="card-body"><div className="listing-title-row"><div><p className="card-breed">{p.bully_type || p.breed}</p><h3>{p.name}</h3></div><strong className="price">${Number(p.price).toLocaleString()}</strong></div><p className="muted">{p.sex} • {p.age_weeks} weeks</p><a className="button button-soft full" href={`/puppies/${p.id}`}>View puppy</a></div></article>)}</div></div></div><aside className={styles.sidebar}><div className={styles.summaryCard}><p className="eyebrow dark">STORE DETAILS</p><div className={styles.summaryRow}><span>Status</span><strong className="available">Approved</strong></div><div className={styles.summaryRow}><span>Puppies</span><strong>{puppies?.length ?? 0}</strong></div><div className={styles.summaryRow}><span>Primary breed</span><strong>{store.primary_breed}</strong></div></div></aside></section>
  </main>
}
