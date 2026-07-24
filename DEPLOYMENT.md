# MaintainPro Deployment Guide

## Architecture Overview

```
Users
  |
  ↓
Vercel (React + TypeScript Frontend)
  |
  ↓
Railway (ASP.NET Core REST API)
  |
  ↓
Railway MySQL Database
```

---

## Prerequisites

- Railway account (railway.app)
- Vercel account (vercel.com)
- GitHub repository with this code pushed
- Git CLI installed

---

## Phase 1: Deploy the API to Railway

### Step 1.1: Create a Railway project
1. Log in to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Connect your GitHub account and select this repository
4. Select the folder: `Maintenance Request System API/Maintenance Request System API`

### Step 1.2: Add environment variables
In the Railway project dashboard, go to **Variables** and set:

```
PORT=8080
ASPNETCORE_URLS=http://0.0.0.0:$PORT
Jwt__Key=YourVerySecureJwtKeyWithAtLeast32Characters!@#$%
Jwt__Issuer=MaintainReqSysAPI
Jwt__Audience=MaintainReqSysClient
AllowedOrigins__Frontend=https://your-frontend-domain.vercel.app
```

> **Note:** Replace `your-frontend-domain.vercel.app` with your actual Vercel domain after Step 3.

### Step 1.3: Deploy
- Railway auto-deploys from your branch
- Wait for the build to complete
- Copy your Railway API domain (e.g., `https://maintain-pro-api.up.railway.app`)

### Step 1.4: Verify the API is running
Open in your browser:
```
https://your-railway-api-domain.up.railway.app/health
```
You should see: `{"status":"ok"}`

---

## Phase 2: Deploy MySQL to Railway

### Step 2.1: Add MySQL service
1. In your Railway project, click **+ Add service** → **Database** → **MySQL**
2. Railway creates a MySQL instance automatically

### Step 2.2: Get connection details
1. Click on the MySQL service
2. Go to **Variables** tab
3. Copy these values:
   - `DATABASE_URL` (contains host, user, password, port, database)
   - Or individual fields: `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`, `MYSQLPORT`

### Step 2.3: Update the API connection string
In the API service variables, update:
```
ConnectionStrings__DefaultConnection=Server=<MYSQLHOST>;Port=<MYSQLPORT>;Database=<MYSQLDATABASE>;User=<MYSQLUSER>;Password=<MYSQLPASSWORD>;
```

Example:
```
ConnectionStrings__DefaultConnection=Server=containers-us-west-123.railway.app;Port=3306;Database=railway;User=root;Password=abc123xyz;
```

### Step 2.4: Apply database migrations
The API automatically runs migrations on startup (via `DbSeeder.Seed(context)` in Program.cs).

---

## Phase 3: Deploy the Frontend to Vercel

### Step 3.1: Prepare the frontend
Make sure `.env.example` exists in the frontend folder:
```
VITE_API_URL=https://your-railway-api-domain.up.railway.app
```

### Step 3.2: Deploy to Vercel
1. Log in to [vercel.com](https://vercel.com)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Set the root directory to `frontend`
5. Go to **Environment Variables** and add:
   ```
   VITE_API_URL=https://your-railway-api-domain.up.railway.app
   ```
6. Click **Deploy**

### Step 3.3: Get your Vercel domain
After deployment, copy your Vercel frontend URL (e.g., `https://maintain-pro.vercel.app`)

---

## Phase 4: Final Integration

### Step 4.1: Update API CORS settings
1. Go back to the Railway API service variables
2. Update:
   ```
   AllowedOrigins__Frontend=https://your-vercel-frontend-domain.vercel.app
   ```
3. Save (Railway will redeploy)

### Step 4.2: Test end-to-end
1. Open your Vercel frontend: `https://your-app.vercel.app`
2. Try the following flows:
   - **Login**: Use test credentials if you seeded the database
   - **Register**: Create a new account
   - **Create Request**: Submit a maintenance request
   - **Dashboard**: View dashboard stats and recent requests
   - **Notifications**: Check if notifications load

### Step 4.3: Check browser console
- Open DevTools (F12) → **Console** tab
- Verify there are no CORS errors
- Confirm API calls complete successfully

---

## Environment Variables Reference

### Railway API
| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `8080` | Hosting port |
| `ASPNETCORE_URLS` | `http://0.0.0.0:8080` | Kestrel binding |
| `ConnectionStrings__DefaultConnection` | `Server=host;Port=3306;Database=db;User=user;Password=pass;` | MySQL connection |
| `Jwt__Key` | `YourSecureKey123!@#...` | JWT signing secret |
| `Jwt__Issuer` | `MaintainReqSysAPI` | JWT issuer claim |
| `Jwt__Audience` | `MaintainReqSysClient` | JWT audience claim |
| `AllowedOrigins__Frontend` | `https://app.vercel.app` | CORS allowed origin |

### Vercel Frontend
| Variable | Example | Purpose |
|---|---|---|
| `VITE_API_URL` | `https://api.up.railway.app` | Backend API base URL |

---

## Database Migrations

If you need to run migrations manually:

### Local (development)
```bash
cd "Maintenance Request System API/Maintenance Request System API"
dotnet ef database update
```

### Railway (production)
Migrations run automatically on API startup via the seeder.

---

## Production Checklist

- [ ] JWT key is a strong random string (min 32 characters)
- [ ] Database is running on Railway MySQL
- [ ] API health endpoint (`/health`) responds with JSON
- [ ] Frontend points to the correct API domain
- [ ] CORS is configured with the correct frontend origin
- [ ] Both services auto-redeploy from Git
- [ ] Login/registration works
- [ ] Requests can be created and updated
- [ ] Notifications load without errors
- [ ] Dashboard displays stats correctly
- [ ] File uploads (images) work

---

## Troubleshooting

### Frontend cannot connect to API
- **Check**: Browser DevTools Console → Network tab
- **Fix**: Verify `VITE_API_URL` is set in Vercel and matches your Railway domain
- **Rebuild**: Push a change to trigger Vercel redeploy

### API returns 401/403 errors
- **Check**: JWT secret matches between frontend and backend
- **Fix**: Verify `Jwt__Key` in Railway variables

### Database connection fails
- **Check**: `ConnectionStrings__DefaultConnection` in Railway API variables
- **Fix**: Ensure MySQL service is running and credentials are correct

### CORS errors in browser
- **Check**: `AllowedOrigins__Frontend` in Railway API variables
- **Fix**: Must match your exact Vercel frontend URL with https

### Build fails on Railway
- **Check**: Railway build logs
- **Fix**: Ensure `.NET 8 SDK` is available or add a buildpack

---

## Monitoring & Logs

### View Railway logs
1. Click on the API or MySQL service in Railway
2. Go to **Logs** tab
3. View real-time logs as requests come in

### View Vercel logs
1. Go to your Vercel project dashboard
2. Click **Deployments** → select a deployment
3. Click **Logs** tab

---

## Support

For issues:
1. Check Railway and Vercel status pages
2. Review the logs in both platforms
3. Verify all environment variables are set correctly
4. Ensure the database is accessible from the API service
