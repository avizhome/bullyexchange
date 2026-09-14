# BullyExchange marketplace

First front-end build for the approved dog seller marketplace.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Current pages

The homepage is implemented. Links for Puppies, Breeds, Stores, Seller Application, Login and Signup are included but those pages are intentionally not built yet.

## Recommended build order

1. Homepage
2. Puppies search/listing page
3. Puppy details page
4. Stores directory
5. Individual store page
6. Breeds directory
7. Breed landing page
8. Buyer sign-up/login
9. Seller application
10. Seller dashboard
11. Admin approval dashboard
12. Messaging
13. Supabase data + auth + storage
14. Subscription billing later

## Backend plan

Use Supabase for:
- Auth
- PostgreSQL
- Row Level Security
- puppy/store data
- seller application workflow
- image storage
- buyer/seller messages

Seller status model:
`pending -> approved -> suspended -> cancelled`

Do not hard-delete a seller when suspended; hide their public listings and retain admin history.


## Added prototype routes
- `/seller/apply`
- `/seller/application-submitted`
- `/seller/dashboard`
- `/admin/sellers`
- `/login`
- `/signup`
