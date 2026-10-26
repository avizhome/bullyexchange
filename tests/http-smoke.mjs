import assert from 'node:assert/strict'
const base=process.env.TEST_BASE_URL||'http://localhost:3000'
for(const path of ['/','/signup','/login','/setup','/about','/standards','/contact','/terms','/privacy','/bullyexchange-logo.png']) {
 const response=await fetch(base+path)
 assert.equal(response.status,200,path)
 console.log(`PASS ${path}: 200`)
}
// No-config mode: database-dependent routes should redirect safely, never 500.
if(process.env.TEST_UNCONFIGURED==='1') {
 for(const path of ['/puppies','/stores','/seller/dashboard','/seller/apply','/admin/sellers']) {
  const response=await fetch(base+path,{redirect:'manual'})
  if(response.status===307) assert.equal(new URL(response.headers.get('location'),base).pathname,'/setup',path)
  else {
    assert.equal(response.status,200,path)
    assert.match(await response.text(), /<meta[^>]+id="__next-page-redirect"[^>]+content="1;url=\/setup"/,path)
  }
  console.log(`PASS ${path}: setup redirect`)
 }
}
const missing=await fetch(base+'/missing-page')
assert.equal(missing.status,404)
console.log('PASS unknown route: 404')
