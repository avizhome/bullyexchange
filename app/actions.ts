'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { field, email, webUrl, uuid, puppyFields, statuses, imageType } from '@/lib/validation'

function fail(path: string, error: unknown): never {
  // Never echo database errors or internal configuration to visitors.
  const message = error instanceof Error ? error.message : 'Unable to save. Please try again.'
  redirect(`${path}?error=${encodeURIComponent(message)}`)
}
async function account(admin = false) {
  const db = await createClient()
  const { data: { user } } = await db.auth.getUser()
  if (!user) redirect('/login')
  if (admin) {
    const { data } = await db.from('profiles').select('role').eq('id', user.id).single()
    if (data?.role !== 'admin') redirect('/')
  }
  return { db, user }
}
function refresh(id?: string) {
  for (const path of ['/', '/seller/dashboard', '/puppies', '/stores', '/admin/sellers']) revalidatePath(path)
  revalidatePath('/stores/[slug]', 'page')
  if (id) revalidatePath(`/puppies/${id}`)
}
export async function signup(data: FormData) {
  let input
  try {
    const password = String(data.get('password') ?? '')
    if (password.length < 8 || password.length > 128) throw new Error('Password must be 8–128 characters.')
    input = { email: email(data), password, options: { data: { first_name: field(data,'firstName',1,80), last_name: field(data,'lastName',1,80) } } }
  } catch (error) { fail('/signup',error) }
  const db = await createClient()
  const { error } = await db.auth.signUp(input)
  if (error) fail('/signup', new Error('Could not create account. Check your details and try again.'))
  redirect('/login?message=Check your email to confirm your account, then sign in. If already registered, use your existing password.')
}
export async function login(data: FormData) {
  let address
  try { address = email(data) } catch(error) { fail('/login',error) }
  const db = await createClient()
  const { error } = await db.auth.signInWithPassword({ email: address, password: String(data.get('password') ?? '') })
  if (error) fail('/login', new Error('Email or password is incorrect, or your email is not confirmed.'))
  const { data: { user } } = await db.auth.getUser()
  if (!user) fail('/login', new Error('Unable to verify your account. Please try again.'))
  const { data: profile } = await db.from('profiles').select('role').eq('id',user.id).single()
  revalidatePath('/', 'layout')
  redirect(profile?.role === 'admin' ? '/admin/sellers' : '/seller/dashboard')
}
export async function logout() {
  const { db } = await account()
  await db.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
export async function submitSellerApplication(data: FormData) {
  const { db, user } = await account()
  let input
  try {
    if (data.get('conditions') !== 'on' || data.get('payments') !== 'on') throw new Error('Please accept both seller conditions.')
    input = { user_id:user.id, store_name:field(data,'storeName',2,100), phone:field(data,'phone',6,40), location:field(data,'location',2,160),
      primary_breed:field(data,'breed',1,100), bully_type:field(data,'type',0,60), about:field(data,'about',20,5000),
      registration_number:field(data,'registration',0,100) || null, website_url:webUrl(data,'social') }
  } catch(error) { fail('/seller/apply',error) }
  const { error } = await db.from('seller_applications').insert(input)
  if (error) fail('/seller/apply',new Error('Unable to submit. You may already have a pending or approved application.'))
  refresh()
  redirect('/seller/application-submitted')
}
export async function approveSeller(data: FormData) {
  const { db } = await account(true)
  let id
  try { id = uuid(data,'applicationId') } catch(error) { fail('/admin/sellers',error) }
  const { error } = await db.rpc('approve_seller_application',{application_id:id})
  if (error) fail('/admin/sellers',new Error('Approval failed. Refresh and check whether this application is still pending.'))
  refresh()
}
export async function rejectSeller(data: FormData) {
  const { db } = await account(true)
  let id
  try { id = uuid(data,'applicationId') } catch(error) { fail('/admin/sellers',error) }
  const { data: rows, error } = await db.from('seller_applications').update({status:'rejected',reviewed_at:new Date().toISOString()}).eq('id',id).eq('status','pending').select('id')
  if (error || !rows?.length) fail('/admin/sellers',new Error('Application could not be rejected. It may already have been reviewed.'))
  refresh()
}
export async function suspendStore(data: FormData) { await storeStatus(data,'suspended') }
export async function restoreStore(data: FormData) { await storeStatus(data,'active') }
async function storeStatus(data: FormData, status: string) {
  const { db } = await account(true)
  let id
  try { id = uuid(data,'storeId') } catch(error) { fail('/admin/sellers',error) }
  const { data: rows, error } = await db.from('stores').update({status}).eq('id',id).select('id')
  if (error || !rows?.length) fail('/admin/sellers',new Error('Store could not be updated.'))
  refresh()
}
async function activeStore() {
  const { db, user } = await account()
  const { data: store } = await db.from('stores').select('*').eq('owner_id',user.id).eq('status','active').maybeSingle()
  if (!store) redirect('/seller/dashboard?error=An approved active store is required.')
  return { db, user, store }
}
async function upload(data: FormData, db: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const file = data.get('image')
  if (!(file instanceof File) || !file.size) return null
  if (file.size > 3 * 1024 * 1024) throw new Error('Images must be 3 MB or smaller.')
  const bytes = new Uint8Array(await file.arrayBuffer())
  const ext = imageType(bytes)
  const path = `${userId}/${crypto.randomUUID()}.${ext}`
  const { error } = await db.storage.from('puppy-images').upload(path,bytes,{contentType:ext==='jpg'?'image/jpeg':`image/${ext}`,upsert:false})
  if (error) throw new Error('Image upload failed. Check your connection and try again.')
  return { path, url: db.storage.from('puppy-images').getPublicUrl(path).data.publicUrl }
}
export async function createPuppy(data: FormData) {
  const { db, user, store } = await activeStore()
  const path = '/seller/dashboard/puppies/new'
  let input, photo
  try {
    input = puppyFields(data)
    photo = await upload(data,db,user.id)
    if (!photo) throw new Error('Add a photo for this listing.')
  } catch(error) { fail(path,error) }
  const { error } = await db.from('puppies').insert({...input,store_id:store.id,image_url:photo.url})
  if (error) {
    await db.storage.from('puppy-images').remove([photo.path])
    fail(path,new Error('Listing could not be saved. Please try again.'))
  }
  refresh()
  redirect('/seller/dashboard?message=Puppy listing created.')
}
export async function updatePuppy(data: FormData) {
  const { db, user, store } = await activeStore()
  let id, input
  try { id = uuid(data,'puppyId'); input = puppyFields(data) } catch(error) { fail('/seller/dashboard',error) }
  const path = `/seller/dashboard/puppies/${id}/edit`
  const { data: existing } = await db.from('puppies').select('id,image_url').eq('id',id).eq('store_id',store.id).maybeSingle()
  if (!existing) fail('/seller/dashboard',new Error('Listing not found.'))
  let photo
  try { photo = await upload(data,db,user.id) } catch(error) { fail(path,error) }
  const { data: rows, error } = await db.from('puppies').update({...input,image_url:photo?.url || existing.image_url,updated_at:new Date().toISOString()}).eq('id',id).eq('store_id',store.id).select('id')
  if (error || !rows?.length) {
    if (photo) await db.storage.from('puppy-images').remove([photo.path])
    fail(path,new Error('Changes could not be saved.'))
  }
  if (photo) await removeImage(db,user.id,existing.image_url)
  refresh(id)
  redirect('/seller/dashboard?message=Puppy listing updated.')
}
async function removeImage(db: Awaited<ReturnType<typeof createClient>>, userId: string, url: string | null) {
  const prefix = db.storage.from('puppy-images').getPublicUrl(`${userId}/`).data.publicUrl
  if (url?.startsWith(prefix)) await db.storage.from('puppy-images').remove([`${userId}/${url.slice(prefix.length)}`])
}
export async function deletePuppy(data: FormData) {
  const { db, user } = await account()
  let id
  try { id = uuid(data,'puppyId') } catch(error) { fail('/seller/dashboard',error) }
  const { data: store } = await db.from('stores').select('id').eq('owner_id',user.id).maybeSingle()
  if (!store) fail('/seller/dashboard',new Error('Store not found.'))
  const { data: removed, error } = await db.from('puppies').delete().eq('id',id).eq('store_id',store.id).select('image_url')
  if (error || !removed?.length) fail('/seller/dashboard',new Error('Listing could not be deleted.'))
  await removeImage(db,user.id,removed[0].image_url)
  refresh(id)
  redirect('/seller/dashboard?message=Puppy listing deleted.')
}
export async function updatePuppyStatus(data: FormData) {
  const { db, store } = await activeStore()
  let id, status
  try { id=uuid(data,'puppyId'); status=field(data,'status'); if (!statuses.includes(status)) throw new Error('Invalid status.') } catch(error) { fail('/seller/dashboard',error) }
  const { data: rows, error } = await db.from('puppies').update({status}).eq('id',id).eq('store_id',store.id).select('id')
  if (error || !rows?.length) fail('/seller/dashboard',new Error('Listing could not be updated.'))
  refresh(id)
}
export async function updateStore(data: FormData) {
  const { db, store } = await activeStore()
  let input
  try {
    input = {name:field(data,'name',2,100),location:field(data,'location',2,160),primary_breed:field(data,'breed',1,100),
      about:field(data,'about',20,5000),contact_email:email(data,'contactEmail'),banner_url:webUrl(data,'bannerUrl')}
  } catch(error) { fail('/seller/dashboard/store',error) }
  const { data: rows, error } = await db.from('stores').update(input).eq('id',store.id).select('id')
  if (error || !rows?.length) fail('/seller/dashboard/store',new Error('Store could not be saved.'))
  refresh()
  redirect('/seller/dashboard?message=Store details saved.')
}
