import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

test('database RLS and approval lifecycle using PostgreSQL (mock Supabase auth/storage)',async()=>{
 const db=new PGlite()
 await db.exec(`
 create role anon; create role authenticated;
 create schema auth; create schema storage;
 create table auth.users(id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
 alter table storage.objects enable row level security;
 create function storage.foldername(name text) returns text[] language sql immutable as $$select string_to_array(name,'/')$$;
 grant usage on schema public,auth,storage to anon,authenticated;
 grant select,insert,delete on storage.objects to anon,authenticated;
 grant execute on function auth.uid() to anon,authenticated;
 `)
 const schema=(await readFile(new URL('../supabase/schema.sql',import.meta.url),'utf8')).replace('create extension if not exists pgcrypto;','')
 const migration=await readFile(new URL('../supabase/migrations/20261026_security_and_images.sql',import.meta.url),'utf8')
 await db.exec(schema);await db.exec(migration)
 // Verify repeatability in the documented order, with hardening always last.
 await db.exec(schema);await db.exec(migration)
 const seller='11111111-1111-4111-8111-111111111111', buyer='22222222-2222-4222-8222-222222222222',admin='33333333-3333-4333-8333-333333333333'
 await db.exec(`insert into auth.users(id,email) values ('${seller}','seller@example.com'),('${buyer}','buyer@example.com'),('${admin}','admin@example.com');update public.profiles set role='admin' where id='${admin}';`)
 const as=async(role,id='')=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);await db.exec(`set role ${role}`)}
 const rows=async(sql)=>(await db.query(sql)).rows
 await as('authenticated',seller)
 await assert.rejects(db.exec(`update public.profiles set role='admin' where id='${seller}'`),/permission denied/)
 await assert.rejects(db.exec(`insert into public.seller_applications(user_id,store_name,phone,location,primary_breed,about,status) values('${seller}','Seller','0412345678','Sydney','American Bully','Responsible breeder with detailed health records.','approved')`),/row-level security/)
 await db.exec(`insert into public.seller_applications(user_id,store_name,phone,location,primary_breed,about) values('${seller}','Bully House','0412345678','Sydney','American Bully','Responsible breeder with detailed health records.')`)
 const application=(await rows('select id from public.seller_applications'))[0].id
 await assert.rejects(db.exec(`select public.approve_seller_application('${application}')`),/Admin access required/)
 await as('authenticated',buyer)
 assert.equal((await rows('select * from public.seller_applications')).length,0)
 await as('authenticated',admin)
 await db.exec(`select public.approve_seller_application('${application}')`)
 await assert.rejects(db.exec(`select public.approve_seller_application('${application}')`),/not pending/)
 const store=(await rows('select id from public.stores'))[0].id
 await as('authenticated',seller)
 assert.equal((await rows('select role from public.profiles'))[0].role,'seller')
 await db.exec(`update public.profiles set first_name='Seller name' where id='${seller}'`)
 assert.equal((await rows('select first_name from public.profiles'))[0].first_name,'Seller name')
 await assert.rejects(db.exec(`update public.stores set owner_id='${buyer}' where id='${store}'`),/permission denied/)
 await assert.rejects(db.exec(`update public.stores set status='active' where id='${store}';update public.stores set status='suspended' where id='${store}'`),/Only administrators/)
 await db.exec(`update public.stores set name='Updated store',contact_email='seller@example.com' where id='${store}'`)
 await db.exec(`insert into public.puppies(store_id,name,breed,sex,age_weeks,price,location,description,status) values('${store}','Luna','American Bully','Female',8,3000,'Sydney','Friendly puppy with health records available.','hidden')`)
 const puppy=(await rows('select id from public.puppies'))[0].id
 await db.exec(`insert into storage.objects(bucket_id,name) values('puppy-images','${seller}/photo.jpg')`)
 await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('puppy-images','${buyer}/photo.jpg')`),/row-level security/)
 await as('anon')
 assert.equal((await rows('select * from public.puppies')).length,0)
 await as('authenticated',buyer)
 assert.equal((await rows(`update public.puppies set name='Hacked' where id='${puppy}' returning id`)).length,0)
 assert.equal((await rows(`delete from public.puppies where id='${puppy}' returning id`)).length,0)
 assert.equal((await rows(`delete from storage.objects returning id`)).length,0)
 await as('authenticated',seller)
 await db.exec(`update public.puppies set status='available' where id='${puppy}'`)
 await as('anon')
 assert.equal((await rows('select * from public.puppies')).length,1)
 await assert.rejects(db.exec('select * from public.seller_applications'),/permission denied/)
 await as('authenticated',admin)
 await db.exec(`update public.stores set status='suspended' where id='${store}'`)
 await as('anon')
 assert.equal((await rows('select * from public.stores')).length,0)
 assert.equal((await rows('select * from public.puppies')).length,0)
 await as('authenticated',seller)
 assert.equal((await rows('select * from public.puppies')).length,1)
 await assert.rejects(db.exec(`update public.stores set status='active' where id='${store}'`),/Only administrators/)
 assert.equal((await rows(`update public.puppies set name='Blocked' where id='${puppy}' returning id`)).length,0)
 await assert.rejects(db.exec(`insert into storage.objects(bucket_id,name) values('puppy-images','${seller}/blocked.jpg')`),/row-level security/)
 // Owners may clean up listings and photos even while suspended.
 await db.exec(`delete from public.puppies where id='${puppy}';delete from storage.objects where bucket_id='puppy-images'`)
 assert.equal((await rows('select * from public.puppies')).length,0)
 await as('authenticated',admin)
 await db.exec(`update public.stores set status='active' where id='${store}'`)
 await as('anon')
 assert.equal((await rows('select * from public.stores')).length,1)
 await db.close()
})
