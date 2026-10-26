import { SubmitButton } from '@/components/submit-button'
import { Header } from '@/components/header'
import { login } from '@/app/actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string, message?: string }> }) {
  const { error, message } = await searchParams
  return <main>
    <Header/>
    <section className="auth-page"><div className="auth-card">
      <p className="eyebrow dark">WELCOME BACK</p><h1>Log in</h1><p>Access your BullyExchange account.</p>
      {error && <p role="alert" className="form-error">{error}</p>}{message && <p className="form-success">{message}</p>}
      <form action={login}>
        <label>Email<input name="email" required type="email" placeholder="you@example.com"/></label>
        <label>Password<input name="password" required autoComplete="current-password" type="password" placeholder="••••••••"/></label>
        <SubmitButton>Log in</SubmitButton>
      </form>
      <p className="auth-foot"><a href="/forgot-password">Forgot your password?</a></p><p className="auth-foot">New to BullyExchange? <a href="/signup">Create an account</a></p>
    </div></section>
  </main>
}
