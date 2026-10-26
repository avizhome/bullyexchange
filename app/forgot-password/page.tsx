import { Header } from '@/components/header'
import { SubmitButton } from '@/components/submit-button'
import { requestPasswordReset } from './actions'
export default async function ForgotPassword({searchParams}:{searchParams:Promise<{error?:string,message?:string}>}) {
 const {error,message}=await searchParams
 return <main><Header/><section className="auth-page"><div className="auth-card"><h1>Reset your password</h1><p>Enter your account email to request a reset link.</p>{error&&<p role="alert" className="form-error">{error}</p>}{message&&<p role="status" className="form-success">{message}</p>}<form action={requestPasswordReset}><label>Email<input type="email" name="email" autoComplete="email" required maxLength={254}/></label><SubmitButton>Send reset email</SubmitButton></form><p className="auth-foot"><a href="/login">Back to login</a></p></div></section></main>
}
