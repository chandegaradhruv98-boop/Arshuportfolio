# Fashion Portfolio + Outfit Store (React, Tailwind, Firebase, Netlify)

## 1. Firebase setup (free Spark plan)
1. https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started → Email/Password → Enable.**
3. **Build → Firestore Database → Create database** (production mode). Open the **Rules** tab and paste `firestore.rules`, then **Publish**.
4. **Project settings → Your apps → Web (</>)** → register the app and copy the config values.
5. **Create the admin user** (do this BEFORE anyone registers):
   Authentication → Users → **Add user** → Email `chandegaraharsh464@gmail.com`, Password `Arshu@1226`.
   (The admin can then log in at `/admin/login` with ID `Arshu@1226` or the email.)
   Change this password after your first login (use "Forgot password") — it has been shared in plain text.
6. **Images**
   - Option A, Firebase Storage: Build → Storage → Get started, paste `storage.rules`.
     New Firebase projects may require the pay-as-you-go (Blaze) plan to enable Storage.
   - Option B, fully free: create a free Cloudinary account → Settings → Upload → add an
     **unsigned** upload preset. Put its name and your cloud name in `.env`. The app then uses Cloudinary automatically.
7. Authentication → Settings → **Authorized domains** → add your Netlify domain after deploying.

## 2. Run locally
```bash
npm install
cp .env.example .env      # fill in your Firebase values
npm run dev
```

## 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<you>/fashion-portfolio.git
git push -u origin main
```
(`.env` is git-ignored, so your keys are not uploaded.)

## 4. Deploy on Netlify (free)
1. https://app.netlify.com → **Add new site → Import an existing project → GitHub** → pick the repo.
2. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. **Site configuration → Environment variables** → add every `VITE_...` value from `.env`.
4. Deploy. Every `git push` redeploys automatically.
5. Add the Netlify domain to Firebase Authorized domains (step 1.7).

## Notes
- Admin password reset: Firebase emails a secure reset **link** to the admin email (Firebase has no built-in numeric OTP).
- Order alerts: free real-time in-app toasts, plus browser notifications if the user taps "Turn on alerts".
  True background push (app closed) needs Cloud Functions, which require a paid plan.
- "Desktop only" is enforced in the UI; real security is the Firestore/Storage rules (admin email only).
