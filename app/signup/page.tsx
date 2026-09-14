import { signup } from '@/app/actions'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <main>
    <header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a></header>
    <section className="auth-page"><div className="auth-card">
      <p className="eyebrow dark">JOIN THE COMMUNITY</p><h1>Create an account</h1><p>Browse puppies, contact approved sellers and apply for your own store.</p>
      {error && <p className="form-error">{error}</p>}
      <form action={signup}>
        <div className="form-grid two"><label>First name<input name="firstName" required placeholder="First name"/></label><label>Last name<input name="lastName" required placeholder="Last name"/></label></div>
        <label>Email<input name="email" required type="email" placeholder="you@example.com"/></label>
        <label>Password<input name="password" required minLength={8} type="password" placeholder="At least 8 characters"/></label>
        <button type="submit" className="button button-gold full">Create account</button>
      </form>
      <p className="auth-foot">Already registered? <a href="/login">Log in</a></p>
    </div></section>
  </main>
}
