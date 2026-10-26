import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { configured } from '@/lib/supabase/config'
export const dynamic = 'force-dynamic'
const bullyImages = {
  female:
    "https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg",
  male:
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg",
  standard:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Standard_American_Bully.jpg/526px-Standard_American_Bully.jpg",
};

const breeds = [
  { name: "American Bully", image: bullyImages.male },
  { name: "Pocket Bully", image: bullyImages.female },
  { name: "XL Bully", image: bullyImages.male },
  { name: "Standard Bully", image: bullyImages.standard },
  { name: "French Bulldog", image: bullyImages.female },
  { name: "English Bulldog", image: bullyImages.male },
  { name: "Staffy", image: bullyImages.female },
  { name: "Cane Corso", image: bullyImages.male },
];

export default async function Home() {
  const db=configured()?await createClient():null
  const [dogs,shops]=db?await Promise.all([
    db.from('puppies').select('*,stores!inner(status)').eq('status','available').eq('stores.status','active').order('created_at',{ascending:false}).limit(4),
    db.from('stores').select('*,puppies(id,status)').eq('status','active').order('created_at',{ascending:false}).limit(3)
  ]):[{data:[],error:null},{data:[],error:null}]
  const puppies=(dogs.data??[]).map(p=>({...p,image:p.image_url||'/images/puppy-1.svg',age:`${p.age_weeks} weeks`,accent:p.colour||'',price:new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD',maximumFractionDigits:0}).format(Number(p.price))}))
  const stores=(shops.data??[]).map(s=>({...s,image:s.banner_url||'/images/puppy-1.svg',initials:s.name.slice(0,2).toUpperCase(),breeds:s.primary_breed,available:s.puppies?.filter((p:{status:string})=>p.status==='available').length??0}))
  return (
    <main>
      <Header/>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-shade" />
        <div className="hero-dog">
          <img src={bullyImages.female} alt="American Bully" />
          <div className="hero-dog-glow" />
        </div>

        <div className="hero-content page-width">
          <div className="hero-copy-wrap">
            <p className="eyebrow">FIND • CONNECT • WELCOME HOME</p>
            <h1>
              Find your perfect
              <span> American Bully.</span>
            </h1>
            <p className="hero-copy">
              Discover puppy listings from approved sellers.
              Search by breed, location, age or trusted store.
            </p>

            <form className="search-panel" action="/puppies" method="get">
              <label>
                <span>Breed</span>
                <select name="breed" defaultValue="American Bully">
                  <option>American Bully</option>
                  <option>Pocket Bully</option>
                  <option>XL Bully</option>
                  <option>Standard Bully</option>
                  <option>French Bulldog</option>
                </select>
              </label>

              <label>
                <span>Location</span>
                <input name="location" placeholder="All locations" />
              </label>

              <label>
                <span>Age</span>
                <select name="age" defaultValue="">
                  <option value="">Any age</option>
                  <option value="under8">Under 8 weeks</option>
                  <option value="8to12">8–12 weeks</option>
                  <option value="over12">Over 12 weeks</option>
                </select>
              </label>

              <button type="submit" className="button button-gold">
                Search puppies
              </button>
            </form>

            <div className="trust-row">
              <span><b>✓</b> Approved sellers</span>
              <span><b>♡</b> Responsible breeding</span>
              <span><b>◉</b> Approved stores</span>
              <span><b>✉</b> Direct enquiries</span>
            </div>
          </div>
        </div>

        <div className="hero-note">
          <span>More than a dog.</span>
          <strong>A family.</strong>
        </div>
      </section>

      <section id="breeds" className="section page-width breeds-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">BROWSE</p>
            <h2>Popular breeds</h2>
          </div>
          <a href="/#breeds">View all breeds →</a>
        </div>

        <div className="breed-row">
          {breeds.map((breed, index) => (
            <a
              href={`/puppies?${["Pocket Bully","XL Bully","Standard Bully"].includes(breed.name) ? `breed=American+Bully&type=${breed.name.split(" ")[0]}` : `breed=${encodeURIComponent(breed.name)}`}`}
              className="breed-item"
              key={breed.name}
            >
              <div className="breed-circle">
                <img
                  src={breed.image}
                  alt={breed.name}
                  className={`breed-photo breed-photo-${index % 3}`}
                />
              </div>
              <strong>{breed.name}</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="section dark-section">
        <div className="page-width">
          <div className="section-heading light">
            <div>
              <p className="eyebrow">JUST LISTED</p>
              <h2>Latest puppies</h2>
              <p className="heading-copy">
                New listings from approved sellers around Australia.
              </p>
            </div>
            <a href="/puppies">View all puppies →</a>
          </div>

          {!puppies.length && <p>{dogs.error ? "Listings are temporarily unavailable." : "New listings from approved sellers will appear here."}</p>}<div className="puppy-grid">
            {puppies.map((puppy, index) => (
              <article className="puppy-card" key={puppy.name}>
                <div className="image-wrap">
                  <img
                    src={puppy.image}
                    alt={`${puppy.name} - ${puppy.breed}`}
                    className={`listing-image listing-image-${index}`}
                  />
                  <div className="verified-badge">✓ Approved seller</div>

                </div>

                <div className="card-body">
                  <div className="listing-title-row">
                    <div>
                      <p className="card-breed">{puppy.breed}</p>
                      <h3>{puppy.name}</h3>
                    </div>
                    <strong className="price">{puppy.price}</strong>
                  </div>

                  <p className="muted">{puppy.sex} • {puppy.age} • {puppy.accent}</p>
                  <p className="muted location">⌖ {puppy.location}</p>

                  <a className="button button-soft full" href={`/puppies/${puppy.id}`}>View puppy
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark">TRUSTED COMMUNITY</p>
            <h2>Featured breeder stores</h2>
          </div>
          <a href="/stores">View all stores →</a>
        </div>

        {!stores.length && <p>Approved breeder stores will appear here.</p>}<div className="store-grid">
          {stores.map((store, index) => (
            <article className="store-card" key={store.name}>
              <div className="store-banner">
                <img
                  src={store.image}
                  alt=""
                  className={`store-photo store-photo-${index}`}
                />
                <div className="store-banner-overlay" />
                <span className="store-logo">{store.initials}</span>
              </div>

              <div className="store-body">
                <div className="store-name-row">
                  <h3>{store.name}</h3>
                  <span className="verified-circle">✓</span>
                </div>
                <p className="muted">⌖ {store.location}</p>
                <p>{store.breeds}</p>
                <strong className="available">{store.available} puppies available</strong>
                <a href={`/stores/${store.slug}`}>View store →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section">
        <div className="page-width why-grid">
          <div className="why-intro">
            <p className="eyebrow dark">WHY BULLYEXCHANGE</p>
            <h2>Built around trust.</h2>
            <p>
              Sellers apply before they can advertise. Approved sellers receive a
              approved profile and can be suspended if marketplace standards are not met.
            </p>
          </div>

          <div className="why-card">
            <span className="why-icon">01</span>
            <h3>Seller approval</h3>
            <p>Every store starts with an application and admin review.</p>
          </div>

          <div className="why-card">
            <span className="why-icon">02</span>
            <h3>Clear listings</h3>
            <p>Price, age, location, breed and seller details in one place.</p>
          </div>

          <div className="why-card">
            <span className="why-icon">03</span>
            <h3>Direct contact</h3>
            <p>Buyers can enquire directly with sellers before any payment is arranged.</p>
          </div>
        </div>
      </section>

      <section className="split-cta page-width">
        <div className="cta-card pale">
          <p className="eyebrow dark">EXPLORE</p>
          <h2>Looking for a specific Bully?</h2>
          <p>
            Explore American Bully types and other popular breeds, then see
            available puppies from approved sellers.
          </p>
          <a className="button button-dark" href="/#breeds">Browse all breeds</a>
          <img src={bullyImages.male} alt="" className="cta-dog" />
        </div>

        <div className="cta-card charcoal">
          <p className="eyebrow">BECOME A SELLER</p>
          <h2>Ready to open your store?</h2>
          <p>
            Apply to become an approved seller. Once approved, build your store
            profile and start listing puppies.
          </p>
          <a className="button button-gold" href="/seller/apply">
            Apply to become a seller
          </a>
        </div>
      </section>

      <footer>
        <div className="page-width footer-grid">
          <div>
            <div className="brand footer-brand">
              <span className="brand-mark">
                <span className="paw-dot paw-1" />
                <span className="paw-dot paw-2" />
                <span className="paw-dot paw-3" />
                <span className="paw-pad" />
              </span>
              <span>
                <strong>BullyExchange</strong>
                <small>Buy • Sell • Swap • A Stronger Bully Community</small>
              </span>
            </div>
            <p className="muted footer-copy">
              Connecting dog lovers with approved sellers across Australia.
            </p>
          </div>

          <div>
            <strong>Marketplace</strong>
            <a href="/puppies">Puppies</a>
            <a href="/#breeds">Breeds</a>
            <a href="/stores">Stores</a>
          </div>

          <div>
            <strong>Sellers</strong>
            <a href="/seller/apply">Become a seller</a>
            <a href="/standards">Seller standards</a>
            <a href="/login">Seller login</a>
          </div>

          <div>
            <strong>Support</strong>
            <a href="/about">About us</a>
            <a href="/contact">Contact</a>
            <a href="/terms">Marketplace information</a><a href="/privacy">Privacy</a>
          </div>
        </div>

        <div className="page-width photo-credit">
          Prototype imagery: Wikimedia Commons, CC BY / CC BY-SA. Final production
          imagery can be replaced with seller-provided photos.
        </div>
      </footer>
    </main>
  );
}
