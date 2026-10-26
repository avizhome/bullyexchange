# Test checklist

## Verified locally — 26 October 2026

- PASS: production build using Next.js 16.4.3 / Webpack and TypeScript.
- PASS: 16 automated test cases (`npm test`). One executes the database lifecycle on PostgreSQL via PGlite with simulated Supabase Auth/Storage schemas; the others exercise server validation and image signatures.
- PASS: 16 HTTP checks across public pages/logo, safe missing-config redirects and unknown-route 404 (`node tests/http-smoke.mjs`, with `TEST_UNCONFIGURED=1` against the production server).
- PASS: dependency audit after patching Next.js: zero reported vulnerabilities at verification time.
- PASS: browser homepage on desktop; homepage/signup at 390 x 844 with no horizontal overflow. Existing logo and gold/charcoal design visually preserved.
- PASS: missing-config protected route lands on `/setup` rather than throwing an internal server error.

Database assertions include: repeatable schema/migration, signup profile trigger, rejected role escalation, rejected forged approval, private applications, admin-only atomic approval with store creation, repeated approval rejection, store ownership protection, owner profile edits, public/hidden listings, cross-user write/delete prevention, image-folder ownership, suspension visibility and editing restrictions, owner cleanup, and admin restoration.

Local tests do NOT prove live email delivery, Supabase SSR session refresh, real Storage API behavior, deployed policies or a live Vercel deployment. Those remain pending access. Responsive authenticated dashboard/listing forms have CSS fixes but require live browser verification with data.

## Live staging checklist — pending

Use one admin, seller A, seller B and an anonymous/private browser. Use disposable accounts/data in an explicitly designated staging project.

### Accounts

- [ ] Signup rejects invalid email, blank names and passwords shorter than 8 characters, including direct forged form submissions.
- [ ] Confirmation email arrives; valid link establishes session; expired/reused link fails safely.
- [ ] Existing account from localhost logs in against the same Supabase project without creating a new account.
- [ ] Incorrect password shows a safe error; login/logout, refresh and navigation maintain the correct session.
- [ ] Logged-out admin/seller routes require login; buyers cannot open admin pages or invoke admin actions directly.

### Sellers and stores

- [ ] Buyer submits valid application; missing conditions and too-short details fail on server.
- [ ] Duplicate pending/approved application is rejected, including concurrent submissions.
- [ ] Seller sees pending state; another account cannot read application phone/about details.
- [ ] Admin rejects application; seller can submit a corrected application.
- [ ] Admin approves once; store and seller role appear together. Repeat/concurrent approval creates no duplicate store.
- [ ] Seller edits store details and public contact email; public store displays changes.
- [ ] Seller cannot transfer ownership or change approval/status using REST or a forged action.
- [ ] Admin suspends/restores store; public listings disappear/reappear; suspended owner cannot publish or edit puppies.

### Listings and images

- [ ] Seller uploads real JPEG, PNG and WebP files under 3 MiB; listing appears in dashboard, home, search and correct store.
- [ ] Invalid types (including SVG), forged file MIME, oversized files, blank description, invalid prices/ages/statuses fail safely.
- [ ] Replace image and edit listing; previous owned image is removed after successful save.
- [ ] Available/reserved/sold display publicly; hidden does not. Public detail route cannot reveal hidden/suspended listings.
- [ ] Delete confirmation can be cancelled; confirmed deletion removes the owned listing and primary photo.
- [ ] Seller B cannot edit/delete seller A listings, move puppies to another store or upload/delete another owner's images through REST or forged actions.
- [ ] Anonymous callers cannot create/update/delete records or images. Ordinary users cannot change profile role.
- [ ] Contact seller opens a mail draft addressed to the store email with a correctly encoded subject.

### Search, devices and deployment

- [ ] Search by name/breed/type/location/age/sex/status/max price works; filters remain when paging; clear filters resets.
- [ ] Price sorting and pagination behave with more than 24 matching listings; empty results and database failures have appropriate screens.
- [ ] All navigation, footer links, logo and images load on Preview and Production; unknown/removed records show 404.
- [ ] Mobile at 360/390 px, tablet 768 px and desktop 1280+ px: no overflow, seller Edit/Delete/Suspend remain usable, image input usable, keyboard focus visible and labels announced.
- [ ] Run `npm ci`, `npm run typecheck`, `npm test`, `npm run build` in CI; inspect Vercel logs without exposing keys.
- [ ] Verify real deployed RLS policies/grants and Auth rate limits; audit legacy administrator roles/store statuses.
- [ ] Supply operator support/contact and final terms/privacy information before public launch.
