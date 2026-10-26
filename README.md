# BullyExchange

Continues the existing `bullyexchange-functional-mvp-complete` project found in Downloads. The original gold/charcoal design, layout and `public/bullyexchange-logo.png` are retained. Compared with https://github.com/avizhome/bullyexchange at bed8733: application source matched the recovered copy. Changes are prepared on the codex/complete-marketplace branch. Good Dog Supply and the Downloads originals are untouched.

## Features

- Supabase email/password signup, confirmation endpoint, login, logout and role-aware account navigation.
- Seller application, duplicate protection, admin approval/rejection and automatic store creation.
- Store editing and public contact email, seller dashboard, image upload/replacement, puppy creation/editing/deletion and availability/reservation/sold/hidden statuses.
- Database-backed homepage, public stores and listings, search/filter/sort/pagination, direct seller enquiries.
- Ownership checks in server actions, RLS, column restrictions, protected store status, storage ownership rules, server/browser validation and responsive navigation.
- Safe missing-configuration page, loading/empty/error/not-found screens. No service-role key is required by the application.

## Run

Use Node 22.18 or newer (Node 22 LTS is the tested CI target).

```sh
npm ci
# Copy .env.example to .env.local and set your existing project's public values.
npm run dev
```

See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) before connecting to an existing database. Do not create a replacement Supabase project; existing accounts should continue to work with the same project.

```sh
npm run typecheck
npm test
npm run build
npm start
```

The build uses Webpack because this Windows device blocks native compiler binaries; the supported WebAssembly fallback built successfully. The same build command works on Vercel.

## Handoff

- [DEPLOYMENT.md](DEPLOYMENT.md): GitHub/Vercel preparation and required access.
- [TEST_CHECKLIST.md](TEST_CHECKLIST.md): automated results, scope and remaining live checks.
- [CHANGELOG.md](CHANGELOG.md): changes from the recovered copy.

Not a verified production release yet: live signup/email/session persistence, real Supabase uploads and deployed RLS must be checked after database setup. Operator identity, support contact and final marketplace/privacy terms are also still needed. Informational pages identify those missing details explicitly.
