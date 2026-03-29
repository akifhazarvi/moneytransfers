Pre-deployment validation checklist. Run before pushing to main.

## 1. Build Check
```bash
npm run build
```
If it fails, show the error and suggest a fix. Do NOT proceed until build passes.

## 2. Lint Check
```bash
npm run lint
```
Fix any auto-fixable issues with `npm run lint -- --fix`.

## 3. Git Author Verification
Verify the git author email is correct for Vercel Hobby plan deployment:
```bash
git config user.email
```
Must be `akifhazarvi@yahoo.com`. If wrong, warn immediately — other emails block Vercel deployment.

## 4. Sensitive File Check
Scan staged files for potential secrets:
- `.env` files
- API keys or tokens in code (look for patterns like `sk-`, `key_`, `token_`, `Bearer `)
- Hardcoded credentials

## 5. Large File Check
Check for any files over 1MB being committed:
```bash
git diff --cached --name-only | xargs ls -la 2>/dev/null | awk '$5 > 1048576'
```

## 6. TypeScript Check
```bash
npx tsc --noEmit
```

## 7. Summary
Report pass/fail for each check. Block push recommendation if any critical check fails (build, author email, secrets).
