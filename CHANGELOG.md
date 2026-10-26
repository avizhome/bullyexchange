# Changes from recovered MVP

- Preserve original logo, gold/charcoal styling and page structure; add usable mobile navigation and responsive seller controls.
- Replace homepage sample puppies/stores with current database records and real detail links. Wire homepage search, breed links and public search/filter/sort/pagination.
- Add shared role-aware header, loading/error/not-found/setup screens and functional information pages in place of missing links.
- Validate account/application/listing/store inputs on the server; preserve password whitespace; show safe errors and pending submit states.
- Support token-hash signup confirmation, existing-account login and logout.
- Enforce ownership/active-store checks in listing actions; add delete confirmation, primary photo upload/replacement/cleanup and store editing/contact email.
- Admin approval atomically creates store; add store restoration and duplicate review guards.
- Add repeatable security/storage migration: restrict role and ownership columns, protect store status, reject forged approved applications, block suspended listing writes, permit owner cleanup, isolate image uploads/deletes by owner.
- Upgrade Next.js from 16.3.3 to 16.4.3 to resolve reported advisories, lock dependencies, add GitHub CI and PostgreSQL permission/validation tests.
- Add Supabase setup, deployment and live acceptance checklist. No live database or hosted deployment modified.
