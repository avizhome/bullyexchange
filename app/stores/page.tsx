import styles from "./stores.module.css";

const stores = [
  {name:"Bully Empire Kennels", slug:"bully-empire", location:"Sydney, NSW", breeds:"American Bully • Pocket Bully", available:12, member:"2026", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg", initials:"BE"},
  {name:"Aussie Bully Co", slug:"aussie-bully-co", location:"Melbourne, VIC", breeds:"XL Bully • Standard Bully", available:8, member:"2026", image:"https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg", initials:"AB"},
  {name:"Ironline Bullies", slug:"ironline-bullies", location:"Brisbane, QLD", breeds:"American Bully • XL Bully", available:6, member:"2025", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg", initials:"IB"},
  {name:"Down Under Bullies", slug:"down-under-bullies", location:"Perth, WA", breeds:"Pocket Bully • Standard Bully", available:5, member:"2026", image:"https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg", initials:"DU"},
  {name:"Southern Bully House", slug:"southern-bully-house", location:"Adelaide, SA", breeds:"American Bully • French Bulldog", available:4, member:"2025", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg", initials:"SB"},
  {name:"Coastal Bully Co", slug:"coastal-bully-co", location:"Gold Coast, QLD", breeds:"Pocket Bully • XL Bully", available:7, member:"2026", image:"https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg", initials:"CB"},
];

export default function StoresPage() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="/">
          <span className="brand-mark"><span className="paw-dot paw-1"/><span className="paw-dot paw-2"/><span className="paw-dot paw-3"/><span className="paw-pad"/></span>
          <span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span>
        </a>
        <nav className="desktop-nav">
          <a href="/">Home</a><a href="/puppies">Puppies</a><a href="/breeds">Breeds</a><a className="active" href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a>
        </nav>
        <div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div>
      </header>

      <section className={styles.hero}>
        <div className={`page-width ${styles.heroInner}`}>
          <div>
            <p className="eyebrow">APPROVED SELLERS</p>
            <h1>Find trusted breeder stores.</h1>
            <p>Browse approved sellers, compare breeds and see which puppies are available now.</p>
          </div>
          <div className={styles.search}>
            <input placeholder="Search store or breeder name"/>
            <select defaultValue="All locations">
              <option>All locations</option><option>NSW</option><option>VIC</option><option>QLD</option><option>WA</option><option>SA</option>
            </select>
            <button className="button button-gold">Search stores</button>
          </div>
        </div>
      </section>

      <section className={`page-width ${styles.listingSection}`}>
        <div className={styles.resultsHead}>
          <div>
            <p className="eyebrow dark">VERIFIED COMMUNITY</p>
            <h2>Approved stores</h2>
            <p className="muted">6 breeder stores shown</p>
          </div>
          <select className={styles.sort}><option>Featured first</option><option>Most puppies available</option><option>Newest stores</option></select>
        </div>

        <div className={styles.grid}>
          {stores.map((store, index)=>(
            <article className={styles.card} key={store.name}>
              <div className={styles.banner}>
                <img src={store.image} alt={store.name} className={styles.photo}/>
                <div className={styles.overlay}/>
                <span className={styles.logo}>{store.initials}</span>
                <span className={styles.verified}>✓ Verified</span>
              </div>
              <div className={styles.body}>
                <h3>{store.name}</h3>
                <p className="muted">⌖ {store.location}</p>
                <p>{store.breeds}</p>
                <div className={styles.stats}>
                  <div><strong>{store.available}</strong><small>Puppies available</small></div>
                  <div><strong>{store.member}</strong><small>Member since</small></div>
                </div>
                <a href={`/stores/${store.slug}`} className="button button-soft full">View store</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`page-width ${styles.ctaInner}`}>
          <div>
            <p className="eyebrow">SELL ON BULLYMARKET</p>
            <h2>Want your own breeder store?</h2>
            <p>Apply for seller approval. Once approved, build your storefront and list your available puppies.</p>
          </div>
          <a href="/seller/apply" className="button button-gold">Apply to become a seller</a>
        </div>
      </section>

      <footer>
        <div className="page-width mini-footer">
          <strong>BullyExchange</strong><span>© 2026 BullyExchange • Prototype marketplace</span>
          <div><a href="/terms">Terms</a><a href="/contact">Contact</a></div>
        </div>
      </footer>
    </main>
  );
}
