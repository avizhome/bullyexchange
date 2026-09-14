-- BullyExchange MVP database schema
-- Run this entire file in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'buyer' check (role in ('buyer','seller','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  store_name text not null,
  phone text not null,
  location text not null,
  primary_breed text not null,
  bully_type text,
  about text not null,
  registration_number text,
  website_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  admin_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create unique index if not exists one_open_seller_application_per_user
on public.seller_applications(user_id)
where status in ('pending','approved');

create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  application_id uuid unique references public.seller_applications(id) on delete set null,
  name text not null,
  slug text not null unique,
  location text not null,
  primary_breed text not null,
  bully_type text,
  about text,
  logo_url text,
  banner_url text,
  status text not null default 'active' check (status in ('active','suspended','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text,
  breed text not null,
  bully_type text,
  sex text not null check (sex in ('Male','Female')),
  age_weeks integer not null check (age_weeks > 0),
  colour text,
  price numeric(12,2) not null check (price >= 0),
  location text not null,
  description text not null,
  image_url text,
  status text not null default 'available' check (status in ('available','reserved','sold','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seller_applications_user_idx on public.seller_applications(user_id);
create index if not exists stores_owner_idx on public.stores(owner_id);
create index if not exists puppies_store_idx on public.puppies(store_id);
create index if not exists puppies_status_idx on public.puppies(status);

-- Automatically create a public profile for each Auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.approve_seller_application(application_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  a public.seller_applications;
  generated_slug text;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  select * into a from public.seller_applications where id = application_id for update;
  if not found then raise exception 'Application not found'; end if;
  if a.status <> 'pending' then raise exception 'Application is not pending'; end if;

  generated_slug := trim(both '-' from regexp_replace(lower(a.store_name), '[^a-z0-9]+', '-', 'g'));
  if exists(select 1 from public.stores where slug = generated_slug) then
    generated_slug := generated_slug || '-' || substr(a.id::text, 1, 6);
  end if;

  update public.seller_applications
  set status = 'approved', reviewed_at = now()
  where id = application_id;

  update public.profiles set role = 'seller' where id = a.user_id;

  insert into public.stores (owner_id, application_id, name, slug, location, primary_breed, bully_type, about, status)
  values (a.user_id, a.id, a.store_name, generated_slug, a.location, a.primary_breed, a.bully_type, a.about, 'active')
  on conflict (owner_id) do update set status='active';
end;
$$;

-- RLS
alter table public.profiles enable row level security;
alter table public.seller_applications enable row level security;
alter table public.stores enable row level security;
alter table public.puppies enable row level security;

revoke all on public.profiles, public.seller_applications, public.stores, public.puppies from anon, authenticated;
grant select on public.stores, public.puppies to anon, authenticated;
grant select, insert, update on public.profiles, public.seller_applications, public.stores, public.puppies to authenticated;
grant execute on function public.approve_seller_application(uuid) to authenticated;

-- Profiles
create policy "profiles own select" on public.profiles for select to authenticated
using ((select auth.uid()) = id or public.is_admin());
create policy "profiles own update" on public.profiles for update to authenticated
using ((select auth.uid()) = id or public.is_admin())
with check ((select auth.uid()) = id or public.is_admin());

-- Applications
create policy "applications own select" on public.seller_applications for select to authenticated
using ((select auth.uid()) = user_id or public.is_admin());
create policy "applications own insert" on public.seller_applications for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "applications admin update" on public.seller_applications for update to authenticated
using (public.is_admin()) with check (public.is_admin());

-- Stores: public only sees active stores; owner/admin can see theirs.
create policy "active stores public read" on public.stores for select to anon, authenticated
using (status = 'active' or owner_id = (select auth.uid()) or public.is_admin());
create policy "store owner update" on public.stores for update to authenticated
using (owner_id = (select auth.uid()) or public.is_admin())
with check (owner_id = (select auth.uid()) or public.is_admin());

-- Puppies: public sees visible listings from active stores.
create policy "public puppies read" on public.puppies for select to anon, authenticated
using (
  (status in ('available','reserved','sold') and exists(select 1 from public.stores s where s.id = store_id and s.status='active'))
  or exists(select 1 from public.stores s where s.id = store_id and s.owner_id = (select auth.uid()))
  or public.is_admin()
);
create policy "seller puppy insert" on public.puppies for insert to authenticated
with check (exists(select 1 from public.stores s where s.id = store_id and s.owner_id = (select auth.uid()) and s.status='active'));
create policy "seller puppy update" on public.puppies for update to authenticated
using (exists(select 1 from public.stores s where s.id = store_id and (s.owner_id = (select auth.uid()) or public.is_admin())))
with check (exists(select 1 from public.stores s where s.id = store_id and (s.owner_id = (select auth.uid()) or public.is_admin())));

-- After signing up your own account, promote it once to admin in SQL Editor:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR-EMAIL@example.com');
