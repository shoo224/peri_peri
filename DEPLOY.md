Deployment guide

Frontend (Vite + React) — Vercel recommended

1. Ensure `VITE_API_BASE_URL` is set to your deployed backend URL in Vercel Environment Variables.
   - Key: `VITE_API_BASE_URL`
   - Value: `https://<your-backend-host>`

2. Build command: `npm run build`
   Output: `dist/` (Vercel automatically runs build).

3. Set `dist/` as the publish folder on Vercel (Vite projects use `dist` by default).

Backend (Express + MongoDB) — Render / Railway / Heroku / Fly

1. Ensure the following environment variables are configured on your host:
   - `MONGO_URI` (MongoDB Atlas connection string)
   - `JWT_SECRET` (secure random secret)
   - (optional for emails) `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`

2. Start command: `npm start` (server uses `server.js`).

3. If deploying to Heroku, add a `Procfile` with:
   ```
   web: node server.js
   ```

4. If you want to use Docker, add a simple `Dockerfile` (optional).

Database & Admin

- Create an Admin user via `/api/auth/register` with `role: "Admin"` or run `seedDatabase.js` to create test users.
- Admin UI is available at `/admin` once frontend is deployed and points at your backend.

Git & Push (local)

- This repo is prepared for deployment. To push changes to GitHub:

  ```bash
  cd "c:\Users\ASUS\OneDrive\Desktop\Peri Peri Bites"
  git remote add origin https://github.com/shoo224/peri_peri.git
  git push -u origin main
  ```

- If you prefer, create a new branch and open a PR from your fork.

Notes

- Set secure `JWT_SECRET` and do not commit secrets.
- Configure Mongo Atlas IP whitelist to allow your server's outbound IPs (or set 0.0.0.0/0 temporarily while testing).
- Configure SMTP if you want confirmation/rejection emails to users.
