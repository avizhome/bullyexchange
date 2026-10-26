import { test } from 'node:test'
import assert from 'node:assert/strict'
import { puppyFields, imageType, webUrl, email } from '../lib/validation.ts'
const good=()=>{const f=new FormData();for(const [key,value] of Object.entries({name:'Luna',breed:'American Bully',bullyType:'Pocket',sex:'Female',ageWeeks:'8',price:'3000.50',colour:'Blue',location:'Sydney',description:'Friendly puppy with vaccination records available.',status:'available'}))f.set(key,value);return f}
test('valid listing preserves decimals',()=>assert.equal(puppyFields(good()).price,3000.5))
for(const [key,value] of [['ageWeeks',''],['ageWeeks','1.5'],['ageWeeks','0'],['price','NaN'],['price','-1'],['price','1.234'],['price','1000001'],['status','approved'],['sex','invalid'],['description','short'],['name',' ']]) {
 test(`reject invalid ${key}=${value}`,()=>{const f=good();f.set(key,value);assert.throws(()=>puppyFields(f))})
}
test('password-like URL credentials and active URL schemes are rejected',()=>{for(const value of ['javascript:alert(1)','http://example.com','https://user:pass@example.com']){const f=new FormData();f.set('url',value);assert.throws(()=>webUrl(f,'url'))}})
test('emails are validated',()=>{const f=new FormData();f.set('email','bad');assert.throws(()=>email(f));f.set('email','USER@example.com');assert.equal(email(f),'user@example.com')})
test('image types use bytes rather than filename or client MIME',()=>{assert.equal(imageType(new Uint8Array([255,216,255])),'jpg');assert.equal(imageType(new Uint8Array([137,80,78,71,13,10,26,10])),'png');assert.throws(()=>imageType(new TextEncoder().encode('<svg onload="alert(1)">')))})
