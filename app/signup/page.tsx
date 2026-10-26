import { SubmitButton } from '@/components/submit-button'
import { Header } from '@/components/header'
import { signup } from '@/app/actions'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return <main>
    <Header/>
    <section className="auth-page"><div className="auth-card">
      <p className="eyebrow dark">JOIN THE COMMUNITY</p><h1>Create an account</h1><p>Browse puppies, contact approved sellers and apply for your own store.</p>
      {error && <p role="alert" className="form-error">{error}</p>}
      <form action={signup}>
        <div className="form-grid two"><label>First name<input name="firstName" required placeholder="First name"/></label><label>Last name<input name="lastName" required placeholder="Last name"/></label></div>
        <label>Email<input name="email" required type="email" placeholder="you@example.com"/></label>
        <label>Password<input name="password" required minLength={8} autoComplete="new-password" type="password" placeholder="At least 8 characters"/></label>
        <SubmitButton>Create account</SubmitButton>
      </form>
      <p className="auth-foot">Already registered? <a href="/login">Log in</a></p>
    </div></section>
  </main>
}
