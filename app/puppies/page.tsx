import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg'

export default async function PuppiesPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const raw=await searchParams
  const filters:Record<string,string>=Object.fromEntries(Object.entries(raw).filter(([,value])=>typeof value==='string').map(([key,value])=>[key,(value as string).slice(0,200)]))
  const supabase = await createClient()
  let query=supabase.from('puppies').select('id,name,breed,bully_type,sex,age_weeks,colour,price,location,image_url,status,stores!inner(name,slug,status)',{count:'exact'}).in('status',['available','reserved','sold']).eq('stores.status','active')
  if (['Pocket Bully','XL Bully','Standard Bully'].includes(filters.breed||'')) { filters.type=filters.type||filters.breed!.split(' ')[0];filters.breed='American Bully' }
  const clean=(value:string)=>value.replace(/[%_\\]/g,'').slice(0,100)
  if(filters.q) query=query.ilike('name',`%${clean(filters.q)}%`)
  if(filters.breed) query=query.ilike('breed',`%${clean(filters.breed)}%`)
  if(filters.type) query=query.eq('bully_type',filters.type)
  if(filters.location) query=query.ilike('location',`%${clean(filters.location)}%`)
  if(['Male','Female'].includes(filters.sex||'')) query=query.eq('sex',filters.sex!)
  if(['available','reserved','sold'].includes(filters.status||'')) query=query.eq('status',filters.status!)
  if(filters.age==='under8') query=query.lt('age_weeks',8)
  if(filters.age==='8to12') query=query.gte('age_weeks',8).lte('age_weeks',12)
  if(filters.age==='over12') query=query.gt('age_weeks',12)
  if(filters.maxPrice && Number.isFinite(Number(filters.maxPrice)) && Number(filters.maxPrice)>=0) query=query.lte('price',Number(filters.maxPrice))
  const page=Math.max(1,Math.min(10000,Number.parseInt(filters.page||'1',10)||1))
  query=filters.sort==='price-asc'?query.order('price',{ascending:true}).order('id'):query.order('created_at',{ascending:false}).order('id')
  const {data:puppies,error,count}=await query.range((page-1)*24,page*24-1)
  if(error) throw new Error('Listings could not be loaded.')
  const visible=puppies??[]
  const pageLink=(number:number)=>{const params=new URLSearchParams();for(const [key,value] of Object.entries(filters)) if(value) params.set(key,value);params.set('page',String(number));return `/puppies?${params}`}
  return <main>
    <Header/>
    <section className="listing-hero"><div className="page-width"><p className="eyebrow">FIND YOUR MATCH</p><h1>Puppies for sale</h1><p>Live listings from approved BullyExchange stores.</p></div></section>
    <section className="page-width stores-listing-section"><div className="results-head"><div><p className="eyebrow dark">AVAILABLE NOW</p><h2>{count ?? 0} puppies</h2></div></div>
      <form className="search-filters" action="/puppies" method="get" aria-label="Search puppies">
<label>Name<input name="q" defaultValue={filters.q} maxLength={100}/></label><label>Breed<input name="breed" defaultValue={filters.breed} maxLength={100}/></label><label>Location<input name="location" defaultValue={filters.location} maxLength={100}/></label>
<label>Bully type<select name="type" defaultValue={filters.type||''}><option value="">Any type</option>{['Pocket','Standard','Classic','XL','Exotic'].map(v=><option key={v}>{v}</option>)}</select></label>
<label>Sex<select name="sex" defaultValue={filters.sex||''}><option value="">Any</option><option>Male</option><option>Female</option></select></label>
<label>Status<select name="status" defaultValue={filters.status||''}><option value="">All public listings</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></label>
<label>Age<select name="age" defaultValue={filters.age||''}><option value="">Any age</option><option value="under8">Under 8 weeks</option><option value="8to12">8–12 weeks</option><option value="over12">Over 12 weeks</option></select></label>
<label>Maximum price (AUD)<input name="maxPrice" type="number" min="0" defaultValue={filters.maxPrice}/></label><label>Sort<select name="sort" defaultValue={filters.sort||''}><option value="">Newest first</option><option value="price-asc">Lowest price first</option></select></label><button className="button button-gold" type="submit">Search</button><a href="/puppies">Clear filters</a>
</form>
{visible.length ? <div className="results-grid">{visible.map((dog:any,index:number)=><article className="puppy-card marketplace-card" key={dog.id}><div className="image-wrap"><img className={`listing-image listing-image-${index%4}`} src={dog.image_url || fallbackImage} alt={`${dog.name} ${dog.breed}`}/><div className="verified-badge">✓ Approved seller</div></div><div className="card-body"><div className="listing-title-row"><div><p className="card-breed">{dog.bully_type ? `${dog.bully_type} `:''}{dog.breed}</p><h3>{dog.name}</h3></div><strong className="price">${Number(dog.price).toLocaleString()}</strong></div><p className="muted">{dog.sex} • {dog.age_weeks} weeks {dog.colour ? `• ${dog.colour}`:''}</p><p className="muted location">⌖ {dog.location}</p><div className="seller-mini"><span className="seller-avatar">{dog.stores?.name?.slice(0,2).toUpperCase()}</span><span><strong>{dog.stores?.name}</strong><small>Approved seller</small></span></div><a className="button button-soft full" href={`/puppies/${dog.id}`}>View puppy</a></div></article>)}</div> : <div className="empty-market"><h2>No puppies match your search.</h2><p>Try another location or clear the filters to browse all listings.</p></div>}
<nav className="search-filters" aria-label="Results pages">{page>1&&<a href={pageLink(page-1)}>← Previous</a>}<span>Page {page}</span>{page*24<(count||0)&&<a href={pageLink(page+1)}>Next →</a>}</nav></section>
  </main>
}
