-- Apply AFTER schema.sql. Transactional and repeatable for the supplied MVP schema.
begin;
alter table public.stores add column if not exists contact_email text;
-- Populate profiles for accounts that predate the signup trigger.
insert into public.profiles(id,first_name,last_name)
select id,raw_user_meta_data->>'first_name',raw_user_meta_data->>'last_name' from auth.users
on conflict(id) do nothing;

-- Column privileges complement RLS: owners cannot transfer stores or listings.
revoke insert, update on public.profiles from authenticated;
grant update(first_name,last_name) on public.profiles to authenticated;
revoke insert, update on public.stores from authenticated;
grant update(name,location,primary_breed,bully_type,about,logo_url,banner_url,contact_email,status) on public.stores to authenticated;
revoke update on public.puppies from authenticated;
grant update(name,breed,bully_type,sex,age_weeks,colour,price,location,description,image_url,status,updated_at) on public.puppies to authenticated;
grant delete on public.puppies to authenticated;

create or replace function public.guard_store_status() returns trigger
language plpgsql set search_path = public as $$
begin
  if new.status is distinct from old.status and not public.is_admin() then
    raise exception 'Only administrators can change store status';
  end if;
  return new;
end; $$;
drop trigger if exists protect_store_status on public.stores;
create trigger protect_store_status before update on public.stores for each row execute function public.guard_store_status();

drop policy if exists "applications own insert" on public.seller_applications;
create policy "applications own insert" on public.seller_applications for insert to authenticated
with check (user_id = (select auth.uid()) and status='pending' and admin_notes is null and reviewed_at is null
and not exists(select 1 from public.stores where owner_id=(select auth.uid())));

drop policy if exists "seller puppy update" on public.puppies;
create policy "seller puppy update" on public.puppies for update to authenticated
using (public.is_admin() or exists(select 1 from public.stores s where s.id=store_id and s.owner_id=(select auth.uid()) and s.status='active'))
with check (public.is_admin() or exists(select 1 from public.stores s where s.id=store_id and s.owner_id=(select auth.uid()) and s.status='active'));
drop policy if exists "seller puppy delete" on public.puppies;
create policy "seller puppy delete" on public.puppies for delete to authenticated
using (public.is_admin() or exists(select 1 from public.stores s where s.id=store_id and s.owner_id=(select auth.uid())));

-- Enforce useful data even when callers bypass the website.
do $$ begin
if not exists(select 1 from pg_constraint where conname='puppy_content_valid' and conrelid='public.puppies'::regclass) then
 alter table public.puppies add constraint puppy_content_valid check (
 length(trim(name)) between 1 and 100 and length(trim(breed)) between 1 and 100
 and age_weeks between 1 and 1040 and price between 0 and 1000000
 and length(trim(location)) between 2 and 160 and length(trim(description)) between 20 and 10000
 and (image_url is null or image_url like 'https://%')) not valid;
end if;
if not exists(select 1 from pg_constraint where conname='application_content_valid' and conrelid='public.seller_applications'::regclass) then
 alter table public.seller_applications add constraint application_content_valid check (
 length(trim(store_name)) between 2 and 100 and length(phone) between 6 and 40
 and length(trim(location)) between 2 and 160 and length(trim(about)) between 20 and 5000) not valid;
end if;
end $$;

-- No arbitrary public invocation of privileged functions.
revoke all on function public.approve_seller_application(uuid) from public, anon;
grant execute on function public.approve_seller_application(uuid) to authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- Seller images are public assets; unpublished listing metadata remains protected by RLS.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('puppy-images','puppy-images',true,3145728,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=3145728,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists "puppy images read" on storage.objects;
create policy "puppy images read" on storage.objects for select to anon,authenticated using(bucket_id='puppy-images');
drop policy if exists "puppy images insert" on storage.objects;
create policy "puppy images insert" on storage.objects for insert to authenticated
with check(bucket_id='puppy-images' and (storage.foldername(name))[1]=(select auth.uid())::text
and exists(select 1 from public.stores where owner_id=(select auth.uid()) and status='active'));
drop policy if exists "puppy images delete" on storage.objects;
create policy "puppy images delete" on storage.objects for delete to authenticated
using(bucket_id='puppy-images' and (storage.foldername(name))[1]=(select auth.uid())::text);
commit;
