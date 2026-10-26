import { createClient } from '@/lib/supabase/server'
import { configured } from '@/lib/supabase/config'
import { logout } from '@/app/actions'
export async function Header() {
 const db=configured()?await createClient():null
 const user=db?(await db.auth.getUser()).data.user:null
 const profile=user&&db?(await db.from('profiles').select('role').eq('id',user.id).maybeSingle()).data:null
 return <header className="nav-shell"><a className="brand" href="/" aria-label="BullyExchange home"><span className="brand-mark"/><span><strong>BullyExchange</strong><small>Buy • Sell • Swap • A Stronger Bully Community</small></span></a><nav className="desktop-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/puppies">Puppies</a><a href="/stores">Stores</a><a href="/seller/apply">Become a Seller</a></nav><div className="nav-actions">{user?<><a className="login" href={profile?.role==='admin'?'/admin/sellers':'/seller/dashboard'}>My account</a><form action={logout}><button className="button button-soft small-button" type="submit">Log out</button></form></>:<><a className="login" href="/login">Log in</a><a className="button button-gold small-button" href="/signup">Sign up</a></>}</div></header>
}
