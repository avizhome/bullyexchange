'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? '').trim()
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const email = value(formData, 'email')
  const password = value(formData, 'password')
  const firstName = value(formData, 'firstName')
  const lastName = value(formData, 'lastName')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  })

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  redirect('/login?message=Account created. Check your email if confirmation is enabled, then sign in.')
}

export async function login(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: value(formData, 'email'),
    password: value(formData, 'password'),
  })

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?error=Could not verify your account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin') redirect('/admin/sellers')
  redirect('/seller/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function submitSellerApplication(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?message=Please sign in before applying to become a seller.')

  const { error } = await supabase.from('seller_applications').insert({
    user_id: user.id,
    store_name: value(formData, 'storeName'),
    phone: value(formData, 'phone'),
    location: value(formData, 'location'),
    primary_breed: value(formData, 'breed'),
    bully_type: value(formData, 'type'),
    about: value(formData, 'about'),
    registration_number: value(formData, 'registration') || null,
    website_url: value(formData, 'social') || null,
  })

  if (error) redirect(`/seller/apply?error=${encodeURIComponent(error.message)}`)
  redirect('/seller/application-submitted')
}

export async function approveSeller(formData: FormData) {
  const supabase = await createClient()
  const applicationId = value(formData, 'applicationId')
  const { error } = await supabase.rpc('approve_seller_application', {
    application_id: applicationId,
  })
  if (error) redirect(`/admin/sellers?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/sellers')
}

export async function rejectSeller(formData: FormData) {
  const supabase = await createClient()
  const applicationId = value(formData, 'applicationId')
  const { error } = await supabase
    .from('seller_applications')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', applicationId)
  if (error) redirect(`/admin/sellers?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/sellers')
}

export async function suspendStore(formData: FormData) {
  const supabase = await createClient()
  const storeId = value(formData, 'storeId')
  const { error } = await supabase.from('stores').update({ status: 'suspended' }).eq('id', storeId)
  if (error) redirect(`/admin/sellers?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin/sellers')
  revalidatePath('/stores')
  revalidatePath('/puppies')
}

export async function createPuppy(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id,status')
    .eq('owner_id', user.id)
    .eq('status', 'active')
    .single()

  if (!store) redirect('/seller/dashboard?error=You need an approved active store before listing puppies.')

  const { error } = await supabase.from('puppies').insert({
    store_id: store.id,
    name: value(formData, 'name'),
    breed: value(formData, 'breed'),
    bully_type: value(formData, 'bullyType') || null,
    sex: value(formData, 'sex'),
    age_weeks: Number(value(formData, 'ageWeeks')),
    colour: value(formData, 'colour') || null,
    price: Number(value(formData, 'price')),
    location: value(formData, 'location'),
    description: value(formData, 'description'),
    image_url: value(formData, 'imageUrl') || null,
    status: value(formData, 'status') || 'available',
  })

  if (error) redirect(`/seller/dashboard/puppies/new?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/seller/dashboard')
  revalidatePath('/puppies')
  redirect('/seller/dashboard?message=Puppy listing created.')
}

export async function updatePuppy(formData: FormData) {
  const supabase = await createClient()
  const puppyId = value(formData, 'puppyId')
  const { error } = await supabase.from('puppies').update({
    name: value(formData, 'name'),
    breed: value(formData, 'breed'),
    bully_type: value(formData, 'bullyType') || null,
    sex: value(formData, 'sex'),
    age_weeks: Number(value(formData, 'ageWeeks')),
    colour: value(formData, 'colour') || null,
    price: Number(value(formData, 'price')),
    location: value(formData, 'location'),
    description: value(formData, 'description'),
    image_url: value(formData, 'imageUrl') || null,
    status: value(formData, 'status'),
    updated_at: new Date().toISOString(),
  }).eq('id', puppyId)
  if (error) redirect(`/seller/dashboard/puppies/${puppyId}/edit?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/seller/dashboard')
  revalidatePath('/puppies')
  revalidatePath(`/puppies/${puppyId}`)
  redirect('/seller/dashboard?message=Puppy listing updated.')
}

export async function updatePuppyStatus(formData: FormData) {
  const supabase = await createClient()
  const puppyId = value(formData, 'puppyId')
  const status = value(formData, 'status')
  const { error } = await supabase.from('puppies').update({ status }).eq('id', puppyId)
  if (error) redirect(`/seller/dashboard?error=${encodeURIComponent(error.message)}`)
  revalidatePath('/seller/dashboard')
  revalidatePath('/puppies')
}
