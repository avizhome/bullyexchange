export const recoveryOrigin = 'https://bullyexchange.vercel.app'
export function validateNewPassword(password: string, confirmation: string) {
  if (password.length < 8 || password.length > 128) throw new Error('Use a password with 8–128 characters.')
  if (password !== confirmation) throw new Error('The passwords do not match.')
  return password
}
export function recoveryFragment(hash: string) {
  const params=new URLSearchParams(hash.replace(/^#/,''))
  if(params.has('error')) return {kind:'error' as const}
  if(params.get('type')!=='recovery') return {kind:'none' as const}
  const access_token=params.get('access_token'),refresh_token=params.get('refresh_token')
  if(!access_token||!refresh_token) return {kind:'error' as const}
  return {kind:'recovery' as const,access_token,refresh_token}
}
