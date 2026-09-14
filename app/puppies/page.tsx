const dogs = [
  {name:"Titan", breed:"American Bully", type:"Standard", sex:"Male", age:"8 weeks", price:"$4,000", location:"Sydney, NSW", colour:"Blue & white", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg"},
  {name:"Luna", breed:"American Bully", type:"Pocket", sex:"Female", age:"9 weeks", price:"$3,500", location:"Melbourne, VIC", colour:"Blue", image:"https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg"},
  {name:"Kobe", breed:"American Bully", type:"XL", sex:"Male", age:"10 weeks", price:"$4,500", location:"Brisbane, QLD", colour:"Champagne", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg"},
  {name:"Bella", breed:"American Bully", type:"Standard", sex:"Female", age:"8 weeks", price:"$3,800", location:"Gold Coast, QLD", colour:"Blue & white", image:"https://upload.wikimedia.org/wikipedia/commons/5/58/Cirock_American_Bully_Female_%288597745629%29.jpg"},
  {name:"Boss", breed:"American Bully", type:"Pocket", sex:"Male", age:"11 weeks", price:"$4,200", location:"Perth, WA", colour:"Blue", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg"},
  {name:"Nova", breed:"American Bully", type:"Standard", sex:"Female", age:"12 weeks", price:"$3,600", location:"Adelaide, SA", colour:"Lilac", image:"https://upload.wikimedia.org/wikipedia/commons/e/ed/American_Bully_Stud_Male_%2811527292106%29.jpg"},
];

export default function PuppiesPage() {
  return (
    <main>
      <header className="nav-shell">
        <a className="brand" href="/"><span className="brand-mark"><span className="paw-dot paw-1"/><span className="paw-dot paw-2"/><span className="paw-dot paw-3"/><span className="paw-pad"/></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a>
        <nav className="desktop-nav"><a href="/">Home</a><a className="active" href="/puppies">Puppies</a><a href="/breeds">Breeds</a><a href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a></nav>
        <div className="nav-actions"><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></div>
      </header>

      <section className="listing-hero">
        <div className="page-width">
          <p className="eyebrow">FIND YOUR MATCH</p>
          <h1>Puppies for sale</h1>
          <p>Browse puppies from approved sellers and find the right dog for your family.</p>
        </div>
      </section>

      <section className="page-width browse-layout">
        <aside className="filters">
          <div className="filter-heading"><h2>Filters</h2><button>Clear all</button></div>
          <label>Breed<select><option>All breeds</option><option>American Bully</option><option>French Bulldog</option><option>Staffy</option></select></label>
          <label>Bully type<select><option>All types</option><option>Pocket</option><option>Standard</option><option>XL</option></select></label>
          <label>Location<select><option>All Australia</option><option>NSW</option><option>VIC</option><option>QLD</option><option>WA</option><option>SA</option></select></label>
          <label>Sex<select><option>Any</option><option>Male</option><option>Female</option></select></label>
          <label>Age<select><option>Any age</option><option>8–10 weeks</option><option>11–16 weeks</option><option>4+ months</option></select></label>
          <label>Maximum price<select><option>Any price</option><option>$3,000</option><option>$4,000</option><option>$5,000</option></select></label>
          <button className="button button-gold full">Apply filters</button>
        </aside>

        <div className="results">
          <div className="results-head">
            <div><p className="eyebrow dark">AVAILABLE NOW</p><h2>138 puppies</h2></div>
            <select className="sort"><option>Newest first</option><option>Price: low to high</option><option>Price: high to low</option></select>
          </div>

          <div className="results-grid">
            {dogs.map((dog, index) => (
              <article className="puppy-card marketplace-card" key={dog.name}>
                <div className="image-wrap">
                  <img className={`listing-image listing-image-${index % 4}`} src={dog.image} alt={`${dog.name} ${dog.breed}`} />
                  <div className="verified-badge">✓ Verified seller</div>
                  <button className="heart">♡</button>
                </div>
                <div className="card-body">
                  <div className="listing-title-row"><div><p className="card-breed">{dog.type} {dog.breed}</p><h3>{dog.name}</h3></div><strong className="price">{dog.price}</strong></div>
                  <p className="muted">{dog.sex} • {dog.age} • {dog.colour}</p>
                  <p className="muted location">⌖ {dog.location}</p>
                  <div className="seller-mini"><span className="seller-avatar">BE</span><span><strong>Bully Empire</strong><small>Approved seller</small></span></div>
                  <a className="button button-soft full" href={`/puppies/${dog.name.toLowerCase()}`}>View puppy</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <div className="page-width mini-footer"><strong>BullyExchange</strong><span>© 2026 BullyExchange • Prototype marketplace</span><div><a href="/terms">Terms</a><a href="/contact">Contact</a></div></div>
      </footer>
    </main>
  );
}
