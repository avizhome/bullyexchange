const titanImage =
  "https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg";
const lunaImage =
  "https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg";

export default function TitanPage() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="/">
          <span className="brand-mark"><span className="paw-dot paw-1"/><span className="paw-dot paw-2"/><span className="paw-dot paw-3"/><span className="paw-pad"/></span>
          <span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span>
        </a>
        <nav className="desktop-nav">
          <a href="/">Home</a><a className="active" href="/puppies">Puppies</a>
          <a href="/breeds">Breeds</a><a href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a>
        </nav>
        <div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div>
      </header>

      <div className="page-width breadcrumb">
        <a href="/">Home</a><span>›</span><a href="/puppies">Puppies</a><span>›</span><strong>Titan</strong>
      </div>

      <section className="page-width puppy-detail-grid">
        <div>
          <div className="detail-gallery">
            <div className="main-photo"><img src={titanImage} alt="Titan, American Bully" /><span className="photo-count">▣ 1 / 4</span></div>
            <div className="thumb-row">
              {[0,1,2].map((n)=><button className="thumb" key={n}><img src={titanImage} alt="" className={`thumb-img thumb-${n}`}/></button>)}
              <button className="thumb more-photos"><img src={lunaImage} alt=""/><span>+1</span></button>
            </div>
          </div>

          <div className="detail-section">
            <p className="eyebrow dark">ABOUT TITAN</p>
            <h2>Confident, playful and ready to meet his family.</h2>
            <p>Titan is a friendly American Bully puppy raised around people and other dogs. He has a confident temperament, loves attention and is ready to meet prospective owners.</p>
            <p>This listing is provided directly by the approved seller. Buyers should discuss health history, collection, transport and payment arrangements with the seller before committing.</p>
          </div>

          <div className="detail-section">
            <p className="eyebrow dark">HEALTH & DETAILS</p>
            <h2>What you should know</h2>
            <div className="detail-facts">
              <div><span>✓</span><strong>Vet checked</strong><small>Seller declared</small></div>
              <div><span>✓</span><strong>Vaccinated</strong><small>Age appropriate</small></div>
              <div><span>✓</span><strong>Microchipped</strong><small>Details available</small></div>
              <div><span>✓</span><strong>Wormed</strong><small>Seller declared</small></div>
            </div>
          </div>
        </div>

        <aside className="detail-sidebar">
          <div className="detail-card">
            <div className="detail-topline"><span className="verified-pill">✓ Verified seller</span><button className="save-button">♡</button></div>
            <p className="card-breed">STANDARD AMERICAN BULLY</p>
            <h1>Titan</h1>
            <div className="detail-price">$4,000</div>
            <p className="detail-location">⌖ Sydney, NSW</p>

            <div className="spec-grid">
              <div><small>Sex</small><strong>Male</strong></div>
              <div><small>Age</small><strong>8 weeks</strong></div>
              <div><small>Colour</small><strong>Blue & white</strong></div>
              <div><small>Ready</small><strong>Now</strong></div>
            </div>

            <a href="#contact" className="button button-gold full detail-contact">Contact seller</a>
            <p className="payment-note">BullyExchange does not process payments. Payment and collection arrangements are agreed directly with the seller.</p>
          </div>

          <div className="seller-profile">
            <div className="seller-profile-head">
              <span className="seller-big-avatar">BE</span>
              <div><p className="eyebrow dark">APPROVED STORE</p><h3>Bully Empire Kennels <span className="verified-circle">✓</span></h3><p>⌖ Sydney, NSW</p></div>
            </div>
            <p>American Bully • Pocket Bully</p>
            <div className="seller-stats"><div><strong>12</strong><small>Available</small></div><div><strong>2026</strong><small>Member since</small></div></div>
            <a href="/stores" className="store-link">View breeder store →</a>
          </div>
        </aside>
      </section>

      <section id="contact" className="contact-band">
        <div className="page-width contact-grid">
          <div><p className="eyebrow">INTERESTED IN TITAN?</p><h2>Start a conversation with the seller.</h2><p>Ask about Titan, arrange a meeting, discuss transport or confirm what documentation is available.</p></div>
          <form className="enquiry-card">
            <label>Your name<input placeholder="Your name"/></label>
            <label>Email<input type="email" placeholder="you@example.com"/></label>
            <label>Message<textarea defaultValue={"Hi, I'm interested in Titan. Is he still available?"}/></label>
            <button type="button" className="button button-gold full">Send enquiry</button>
            <small>Prototype only — this form will connect to BullyExchange messaging when we add the backend.</small>
          </form>
        </div>
      </section>

      <footer><div className="page-width mini-footer"><strong>BullyExchange</strong><span>© 2026 BullyExchange • Prototype marketplace</span><div><a href="/terms">Terms</a><a href="/contact">Contact</a></div></div></footer>
    </main>
  );
}
