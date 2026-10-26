# GitHub and Vercel deployment

## Access still needed

- Repository confirmed: https://github.com/avizhome/bullyexchange.git, base commit bed8733. Read access works. The codex/complete-marketplace branch contains the prepared changes; authenticated GitHub write access was verified with a dry run.
- Existing Supabase public publishable key in local/Vercel configuration. URL is known only from previous conversation. No live keys were found or copied.
- Supabase project owner/SQL Editor access to review and apply the migration, verify Auth email settings, audit old roles/statuses and designate the admin.
- Vercel project access to verify repository linkage, environment variables and deploy a Preview.
- Two disposable staging users plus an admin for live workflow tests; do not share personal passwords in chat.
- Operator name/contact and final terms/privacy content; current information pages disclose what is missing.

## Deployment sequence

1. Repository cloned and compared at bed8733. Application source matches the recovered MVP, so the tested changes were transferred onto the local codex/complete-marketplace branch. Review the diff and CHANGELOG.md before pushing for a pull request. Rebase if the remote main branch changes.
2. Keep `package-lock.json`, logo, application source, SQL migrations, tests and workflow. Exclude `.env*` (except `.env.example`), `node_modules`, `.next` and local output files.
3. GitHub Actions workflow assumes package.json is at repository root. If retaining this `bullyexchange` subfolder, set the workflow working directory and setup-node cache-dependency-path accordingly.
4. Back up and stage the database upgrade using SUPABASE_SETUP.md. Verify admin identity and clean up any roles elevated under legacy policies.
5. Configure Vercel framework Next.js, root directory containing package.json, Node 22, install `npm ci`, build `npm run build`; use standard Next.js output (not static export).
6. Add both existing Supabase public values to the correct Vercel environments. Use a separate staging Supabase project for Preview if test isolation is required; never expose a service-role key. Redeploy after changing environment variables.
7. Configure the Supabase Site URL and confirmation template for the tested deployment. Complete TEST_CHECKLIST.md on Preview, then release the reviewed branch to Production and repeat the smoke checks.

## Rollback

Restore the previous Vercel deployment for application regressions. Do not restore the insecure legacy grants as an application rollback. Keep security hardening in place and fix forward; use a verified database backup only with the project owner if a database recovery is necessary. Storage and database recovery must be coordinated.

Changes are prepared on a feature branch for draft pull request review. No production deployment or migration against a live database has been performed. Consult GitHub for the current branch/PR status.
