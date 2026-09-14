import styles from "../stores.module.css";

const hero = "https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg";
const second = "https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg";

const puppies = [
  {name:"Titan", type:"Standard American Bully", price:"$4,000", sex:"Male", age:"8 weeks", location:"Sydney, NSW", image:hero, href:"/puppies/titan"},
  {name:"Luna", type:"Pocket American Bully", price:"$3,500", sex:"Female", age:"9 weeks", location:"Sydney, NSW", image:second, href:"/puppies"},
  {name:"Boss", type:"Pocket American Bully", price:"$4,200", sex:"Male", age:"11 weeks", location:"Sydney, NSW", image:hero, href:"/puppies"},
];

export default function BullyEmpireStore() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="/">
          <span className="brand-mark"><span className="paw-dot paw-1"/><span className="paw-dot paw-2"/><span className="paw-dot paw-3"/><span className="paw-pad"/></span>
          <span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span>
        </a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/puppies">Puppies</a><a href="/breeds">Breeds</a><a className="active" href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a></nav>
        <div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div>
      </header>

      <div className="page-width breadcrumb"><a href="/">Home</a><span>›</span><a href="/stores">Stores</a><span>›</span><strong>Bully Empire Kennels</strong></div>

      <section className={`page-width ${styles.storefrontHero}`}>
        <div className={styles.cover}>
          <img src={hero} alt="Bully Empire Kennels"/>
          <div className={styles.coverOverlay}/>
        </div>

        <div className={styles.profile}>
          <div className={styles.profileLogo}>BE</div>
          <div className={styles.profileTitle}>
            <div className={styles.nameRow}>
              <h1>Bully Empire Kennels</h1>
              <span className="verified-pill">✓ Verified seller</span>
            </div>
            <p>American Bully • Pocket Bully</p>
            <p className="muted">⌖ Sydney, NSW</p>
          </div>
          <a href="#store-contact" className="button button-gold">Contact store</a>
        </div>
      </section>

      <section className={`page-width ${styles.storeLayout}`}>
        <div>
          <div className={styles.storeSection}>
            <p className="eyebrow dark">ABOUT THE STORE</p>
            <h2>Responsible breeding. Strong temperaments. Family homes.</h2>
            <p>Bully Empire Kennels is an approved BullyExchange seller specialising in American Bully and Pocket Bully puppies. This sample storefront demonstrates how breeders can present their program, available puppies and contact details in one place.</p>
            <p>Prospective owners can contact the breeder directly to discuss suitability, documentation, health history, transport and payment arrangements.</p>
          </div>

          <div className={styles.storeSection}>
            <div className="section-heading">
              <div><p className="eyebrow dark">AVAILABLE NOW</p><h2>Current puppies</h2></div>
              <a href="/puppies">See all puppies →</a>
            </div>

            <div className={styles.puppiesGrid}>
              {puppies.map((p,index)=>(
                <article className="puppy-card" key={p.name}>
                  <div className="image-wrap">
                    <img className={`listing-image listing-image-${index}`} src={p.image} alt={p.name}/>
                    <div className="verified-badge">✓ Verified seller</div>
                  </div>
                  <div className="card-body">
                    <div className="listing-title-row">
                      <div><p className="card-breed">{p.type}</p><h3>{p.name}</h3></div>
                      <strong className="price">{p.price}</strong>
                    </div>
                    <p className="muted">{p.sex} • {p.age}</p>
                    <p className="muted location">⌖ {p.location}</p>
                    <a className="button button-soft full" href={p.href}>View puppy</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.summaryCard}>
            <p className="eyebrow dark">STORE DETAILS</p>
            <div className={styles.summaryRow}><span>Status</span><strong className="available">Approved</strong></div>
            <div className={styles.summaryRow}><span>Member since</span><strong>2026</strong></div>
            <div className={styles.summaryRow}><span>Puppies available</span><strong>12</strong></div>
            <div className={styles.summaryRow}><span>Primary breeds</span><strong>American Bully<br/>Pocket Bully</strong></div>
          </div>

          <div className={styles.summaryCard}>
            <p className="eyebrow dark">SELLER STANDARDS</p>
            <ul className={styles.checks}>
              <li>✓ Identity reviewed</li>
              <li>✓ Seller application approved</li>
              <li>✓ Marketplace terms accepted</li>
              <li>✓ Listings subject to review</li>
            </ul>
            <a href="/standards" className="store-link">Read seller standards →</a>
          </div>
        </aside>
      </section>

      <section id="store-contact" className="contact-band">
        <div className="page-width contact-grid">
          <div>
            <p className="eyebrow">CONTACT BULLY EMPIRE</p>
            <h2>Ask the breeder a question.</h2>
            <p>Ask about an available puppy, upcoming litters, health documentation, transport or collection.</p>
          </div>
          <form className="enquiry-card">
            <label>Your name<input placeholder="Your name"/></label>
            <label>Email<input type="email" placeholder="you@example.com"/></label>
            <label>Message<textarea defaultValue={"Hi, I'd like to know more about your available puppies."}/></label>
            <button type="button" className="button button-gold full">Send enquiry</button>
            <small>Prototype only — enquiries will use the BullyExchange messaging system once the backend is connected.</small>
          </form>
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
