'use client'
import { deletePuppy } from '@/app/actions'
export function DeleteListing({id}:{id:string}) {
  return <form action={deletePuppy} onSubmit={event=>{if(!window.confirm('Permanently delete this puppy listing and its photo?')) event.preventDefault()}}><input type="hidden" name="puppyId" value={id}/><button className="button reject-btn" type="submit">Delete listing</button></form>
}
