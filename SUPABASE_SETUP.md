# BullyExchange Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and Run it.
3. In **Authentication > Providers > Email**, keep Email/Password enabled. For easy testing you can temporarily disable email confirmation; for production leave confirmation enabled.
4. Copy the Project URL and Publishable key from the project's **Connect** dialog.
5. Create `.env.local` from `.env.example` and paste those values.
6. Run `npm install`, then `npm run dev`.
7. Create your own account via `/signup`.
8. Promote your account to admin in SQL Editor:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'YOUR_EMAIL');
```

9. Log out/in again, then browse to `/admin/sellers`.
10. Create a second test account, submit `/seller/apply`, then approve it using the admin account.
11. Log in as the seller. `/seller/dashboard` will now show the automatically created store and allow puppy listings.

## Vercel

Add the same two variables under **Vercel Project > Settings > Environment Variables** and redeploy.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Do not put a Supabase `service_role` secret in browser-visible variables.
