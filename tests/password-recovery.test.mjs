import {test} from 'node:test'
import assert from 'node:assert/strict'
import {validateNewPassword} from '../lib/password-recovery.ts'
test('recovery passwords must match and meet length bounds',()=>{
 assert.throws(()=>validateNewPassword('short','short'))
 assert.throws(()=>validateNewPassword('long-enough','different'))
 assert.throws(()=>validateNewPassword('a'.repeat(129),'a'.repeat(129)))
 assert.equal(validateNewPassword('  valid password  ','  valid password  '),'  valid password  ')
})
import {recoveryFragment} from '../lib/password-recovery.ts'
test('only complete recovery fragments establish a recovery session',()=>{
 assert.equal(recoveryFragment('#access_token=x&refresh_token=y&type=signup').kind,'none')
 assert.equal(recoveryFragment('#type=recovery&access_token=x').kind,'error')
 assert.equal(recoveryFragment('#error=access_denied').kind,'error')
 assert.deepEqual(recoveryFragment('#type=recovery&access_token=test-access&refresh_token=test-refresh'),{kind:'recovery',access_token:'test-access',refresh_token:'test-refresh'})
})
