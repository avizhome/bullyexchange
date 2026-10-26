'use client'
export default function ErrorPage({reset}:{reset:()=>void}) {
 return <main className="auth-page"><section className="auth-card"><h1>Something went wrong</h1><p>We couldn’t load this page. Please try again.</p><button className="button button-gold" onClick={reset}>Try again</button><p><a href="/">Return home</a></p></section></main>
}
