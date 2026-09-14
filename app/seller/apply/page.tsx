export default function SellerApplyPage() {
  return (
    <main>

      <header className="nav-shell">
        <a className="brand" href="/"><span className="brand-mark"><span className="paw-dot paw-1"/><span className="paw-dot paw-2"/><span className="paw-dot paw-3"/><span className="paw-pad"/></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a href="/puppies">Puppies</a><a href="/breeds">Breeds</a><a href="/stores">Stores</a><a className="active" href="/seller/apply">Become a Seller</a></nav>
        <div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div>
      </header>

      <section className="seller-apply-hero">
        <div className="page-width seller-apply-hero-inner">
          <div><p className="eyebrow">SELL ON BULLYEXCHANGE</p><h1>Open your breeder store.</h1><p>Apply to become an approved seller. Your store stays private until an admin reviews and approves your application.</p></div>
          <div className="approval-steps"><div><strong>1</strong><span>Apply</span></div><div><strong>2</strong><span>Admin review</span></div><div><strong>3</strong><span>Store approved</span></div><div><strong>4</strong><span>Start listing</span></div></div>
        </div>
      </section>

      <section className="page-width seller-apply-layout">
        <form className="seller-form" action="/seller/application-submitted" method="get">
          <div className="form-section"><p className="eyebrow dark">YOUR DETAILS</p><h2>Seller information</h2><div className="form-grid two"><label>First name<input required name="firstName" placeholder="First name"/></label><label>Last name<input required name="lastName" placeholder="Last name"/></label><label>Email<input required type="email" name="email" placeholder="you@example.com"/></label><label>Phone<input required name="phone" placeholder="04xx xxx xxx"/></label></div></div>
          <div className="form-section"><p className="eyebrow dark">YOUR STORE</p><h2>Breeder/store details</h2><div className="form-grid two"><label>Proposed store name<input required name="storeName" placeholder="e.g. Bully Empire Kennels"/></label><label>Location<input required name="location" placeholder="City, State"/></label><label>Primary breed<select name="breed" defaultValue="American Bully"><option>American Bully</option><option>French Bulldog</option><option>Staffy</option><option>Other</option></select></label><label>Bully type<select name="type" defaultValue="All / multiple"><option>All / multiple</option><option>Pocket</option><option>Standard</option><option>Classic</option><option>XL</option><option>Exotic</option></select></label></div><label>Tell us about your breeding program<textarea name="about" placeholder="Tell us about your dogs, breeding experience and what buyers can expect."/></label></div>
          <div className="form-section"><p className="eyebrow dark">VERIFICATION</p><h2>Approval information</h2><div className="form-grid two"><label>Breeder / registration number<input name="registration" placeholder="If applicable"/></label><label>Website or social page<input name="social" placeholder="https://..."/></label></div><label className="upload-box"><strong>Supporting documents</strong><span>Identification, breeder registration or other verification documents can be uploaded here once storage is connected.</span><input type="file" disabled/></label></div>
          <div className="form-section"><p className="eyebrow dark">SELLER CONDITIONS</p><h2>Before submitting</h2><label className="check-line"><input required type="checkbox"/> <span>I agree that BullyExchange may review my application and suspend or cancel my seller account if marketplace conditions are breached.</span></label><label className="check-line"><input required type="checkbox"/> <span>I understand BullyExchange does not initially process puppy payments and buyers and sellers arrange payment directly.</span></label></div>
          <button className="button button-gold submit-application" type="submit">Submit seller application</button>
        </form>
        <aside className="application-aside"><div className="aside-card"><p className="eyebrow dark">APPROVAL PROCESS</p><h3>Your store will not go live immediately.</h3><p>Every seller begins as <strong>Pending</strong>. An administrator reviews the application before a public storefront is created.</p><div className="status-flow"><span>Pending</span><b>→</b><span>Approved</span><b>→</b><span>Active store</span></div></div><div className="aside-card"><p className="eyebrow dark">ACCOUNT CONTROL</p><ul><li>✓ Admin approval required</li><li>✓ Listings can be reviewed</li><li>✓ Stores can be suspended</li><li>✓ Accounts can be cancelled</li><li>✓ Subscription can be added later</li></ul></div></aside>
      </section>
      <footer><div className="page-width mini-footer"><strong>BullyExchange</strong><span>© 2026 BullyExchange • Prototype marketplace</span><div><a href="/terms">Terms</a><a href="/contact">Contact</a></div></div></footer>
    </main>
  );
}
