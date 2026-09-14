import { createClient } from '@/lib/supabase/server'
import styles from './stores.module.css'

export const dynamic = 'force-dynamic'
const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg'

export default async function StoresPage() {
  const supabase = await createClient()
  const { data: stores } = await supabase.from('stores').select('id,name,slug,location,primary_breed,bully_type,about,banner_url,status,puppies(id,status)').eq('status','active').order('created_at',{ascending:false})
  return <main><header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav"><a href="/">Home</a><a href="/puppies">Puppies</a><a className="active" href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a></nav></header>
    <section className={styles.hero}><div className={`page-width ${styles.heroInner}`}><div><p className="eyebrow">APPROVED SELLERS</p><h1>Find trusted breeder stores.</h1><p>Every public store has passed the BullyExchange approval process.</p></div></div></section>
    <section className={`page-width ${styles.listingSection}`}><div className={styles.resultsHead}><div><p className="eyebrow dark">VERIFIED COMMUNITY</p><h2>Approved stores</h2><p className="muted">{stores?.length ?? 0} stores shown</p></div></div>
    {(stores?.length ?? 0)>0 ? <div className={styles.grid}>{stores!.map((store:any)=><article className={styles.card} key={store.id}><div className={styles.banner}><img src={store.banner_url || fallbackImage} alt={store.name} className={styles.photo}/><div className={styles.overlay}/><span className={styles.logo}>{store.name.slice(0,2).toUpperCase()}</span><span className={styles.verified}>✓ Verified</span></div><div className={styles.body}><h3>{store.name}</h3><p className="muted">⌖ {store.location}</p><p>{store.primary_breed}{store.bully_type ? ` • ${store.bully_type}`:''}</p><div className={styles.stats}><div><strong>{store.puppies?.filter((p:any)=>p.status==='available').length ?? 0}</strong><small>Puppies available</small></div><div><strong>Approved</strong><small>Seller status</small></div></div><a href={`/stores/${store.slug}`} className="button button-soft full">View store</a></div></article>)}</div> : <div className="empty-market"><h2>No approved stores yet.</h2><p>Approved sellers will appear here automatically.</p></div>}
    </section></main>
}
