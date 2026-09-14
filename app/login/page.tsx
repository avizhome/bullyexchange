import { login } from '@/app/actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const { error, message } = await searchParams
  return <main>
    <header className="nav-shell"><a className="brand" href="/"><span className="brand-mark"></span><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a></header>
    <section className="auth-page"><div className="auth-card">
      <p className="eyebrow dark">WELCOME BACK</p><h1>Log in</h1><p>Access your BullyExchange account.</p>
      {error && <p className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}
      <form action={login}>
        <label>Email<input name="email" required type="email" placeholder="you@example.com"/></label>
        <label>Password<input name="password" required type="password" placeholder="••••••••"/></label>
        <button type="submit" className="button button-gold full">Log in</button>
      </form>
      <p className="auth-foot">New to BullyExchange? <a href="/signup">Create an account</a></p>
    </div></section>
  </main>
}
