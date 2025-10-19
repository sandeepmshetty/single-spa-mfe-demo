# Quick Navigation Guide

## ⚠️ Important Port Information

### Correct URLs

| Service | Port | URL | Status |
|---------|------|-----|--------|
| **Shell App** | **9999** | **http://localhost:9999** | ✅ Use this! |
| Shared Library | 9000 | http://localhost:9000 | ⚠️ Backend only |
| React MFE | 3001 | http://localhost:3001 | ✅ Working |
| Vue MFE | 3002 | http://localhost:3002 | ✅ Working |
| Angular MFE | 3003 | http://localhost:3003 | ❌ Build errors |

---

## 🎯 How to Access the Application

### ✅ CORRECT: Access via Shell App
```
http://localhost:9999
```

### Available Routes:
- **Home**: http://localhost:9999/
- **Users (React)**: http://localhost:9999/users ✅
- **Products (Vue)**: http://localhost:9999/products ✅
- **Dashboard (Angular)**: http://localhost:9999/dashboard ❌ (Not working)

---

## ❌ Common Mistakes

### 1. Accessing Shared Library Port Directly
```
❌ http://localhost:9000/dashboard
❌ http://localhost:9000/products
```
**Why it fails**: Port 9000 serves the shared library JavaScript file, not the application.

**Solution**: Use port 9999 (shell app) instead.

---

### 2. Accessing Angular Dashboard
```
❌ http://localhost:9999/dashboard
```
**Why it fails**: Angular MFE has build errors (see ANGULAR_MFE_ISSUES.md)

**Solution**: Navigate to `/users` or `/products` instead.

---

## 🚀 Quick Start

### 1. Start Shell App (if not running)
```powershell
cd packages\shell-app
npm start
```

### 2. Open Correct URL
```
http://localhost:9999
```

### 3. Navigate to Working Routes
Click on:
- **Users** button → React MFE
- **Products** button → Vue MFE
- ❌ Skip **Dashboard** button (Angular not working)

---

## 🔍 Current Error Explanation

### What You Saw
```
Failed to load resource: http://localhost:3003/main.js (404)
Error loading angular-mfe
Dashboard Unavailable
```

### What Happened
1. You accessed `http://localhost:9000/dashboard`
2. Port 9000 = Shared library server (not the app)
3. Shell app tried to load Angular MFE from port 3003
4. Angular MFE has build errors → 404

### Solution
```
✅ Access: http://localhost:9999/products (Vue MFE - WORKING!)
✅ Access: http://localhost:9999/users (React MFE - WORKING!)
```

---

## 🎉 What Actually Works

### Vue MFE (YOUR FIX!) ✨
```
http://localhost:9999/products
```
Features:
- Product catalog
- Cross-MFE counter demo
- Vue 3 components
- Error boundaries
- Performance monitoring

### React MFE
```
http://localhost:9999/users
```
Features:
- User management
- Authentication demo
- State management
- Counter controls

---

## 🛠️ Troubleshooting

### Shell App Not Running?
```powershell
cd packages\shell-app
npm start

# Should see:
# webpack compiled successfully
# Listening on http://localhost:9999
```

### Want to See Vue MFE Standalone?
```
http://localhost:3002
```
This shows the Vue MFE directly (not within shell).

### Check All Services Running
```powershell
Get-NetTCPConnection -LocalPort 9000,9999,3001,3002 | Select-Object LocalPort, State
```

Expected output:
```
LocalPort State
--------- -----
9000      Listen  ✅
9999      Listen  ✅
3001      Listen  ✅
3002      Listen  ✅
```

---

## 📝 Summary

**Wrong URL**: ❌ `http://localhost:9000/dashboard`
- Port 9000 = Shared library server
- Dashboard = Angular MFE (broken)

**Correct URLs**: ✅
- `http://localhost:9999/` - Home
- `http://localhost:9999/users` - React MFE
- `http://localhost:9999/products` - **Vue MFE (FIXED!)** 🎉

---

## 🎯 Try This Now

1. Open a new browser tab
2. Go to: **http://localhost:9999**
3. Click on **"Products"** button
4. See the Vue MFE working! ✨

The Vue MFE should load without any errors and display the product catalog with the cross-MFE counter demo!
