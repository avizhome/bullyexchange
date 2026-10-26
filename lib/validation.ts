export const statuses = ['available', 'reserved', 'sold', 'hidden']
export function field(data: FormData, key: string, min = 1, max = 160) {
  const text = String(data.get(key) ?? '').trim()
  if (text.length < min || text.length > max) throw new Error(`${key}: enter ${min}–${max} characters.`)
  return text
}
export function email(data: FormData, key = 'email') {
  const result = field(data, key, 3, 254)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new Error('Enter a valid email address.')
  return result.toLowerCase()
}
export function webUrl(data: FormData, key: string) {
  const result = field(data, key, 0, 2048)
  if (!result) return null
  let url: URL
  try { url = new URL(result) } catch { throw new Error(`${key}: enter a full https:// address.`) }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`${key}: use an HTTPS address without credentials.`)
  return url.href
}
export function uuid(data: FormData, key: string) {
  const id = field(data, key, 36, 36)
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error('Invalid record ID.')
  return id
}
export function puppyFields(data: FormData) {
  const age = field(data, 'ageWeeks'), amount = field(data, 'price')
  const age_weeks = Number(age), price = Number(amount)
  if (!Number.isInteger(age_weeks) || age_weeks < 1 || age_weeks > 1040) throw new Error('Age must be 1–1040 whole weeks.')
  if (!Number.isFinite(price) || price < 0 || price > 1000000 || !/^\d+(\.\d{1,2})?$/.test(amount)) throw new Error('Enter a price from $0 to $1,000,000 with at most two decimal places.')
  const sex = field(data, 'sex'), status = field(data, 'status')
  if (!['Male','Female'].includes(sex) || !statuses.includes(status)) throw new Error('Choose a valid sex and status.')
  return { name: field(data,'name',1,100), breed: field(data,'breed',1,100), bully_type: field(data,'bullyType',0,60) || null,
    sex, age_weeks, price, colour: field(data,'colour',0,100) || null, location: field(data,'location',2,160),
    description: field(data,'description',20,10000), status }
}
export function imageType(bytes: Uint8Array) {
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg'
  if ([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)) return 'png'
  if (String.fromCharCode(...bytes.slice(0,4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8,12)) === 'WEBP') return 'webp'
  throw new Error('Upload a JPEG, PNG or WebP image.')
}
