# Authentication Setup & Troubleshooting

## ❌ Error: "Anonymous sign-ins are disabled"

This error occurs when **Email authentication is not enabled** in your Supabase project.

---

## ✅ Solution: Enable Email Authentication

### Step 1: Go to Supabase Dashboard

Open your Supabase project dashboard:
```
https://app.supabase.com/project/iarnsmmqgscrlqmlvvtq/auth/providers
```

Replace `iarnsmmqgscrlqmlvvtq` with your actual project ID.

### Step 2: Enable Email Provider

1. **Click on "Email"** in the Providers list
2. **Toggle to "Enabled"**
3. **Configure email settings**:

#### For Quick Testing (Recommended):
- ✅ **Uncheck "Confirm email"** - Users can log in immediately without email verification
- ✅ This allows instant testing of your authentication flow

#### For Production:
- ✅ **Keep "Confirm email" checked**
- ✅ Configure SMTP settings for email delivery
- ✅ Customize email templates

### Step 3: Save Changes

Click **Save** at the bottom of the page.

### Step 4: Test Again

Reload your app and try registering a new user!

---

## 🔨 Alternative: Use Mock Auth (For Testing Only)

If you want to test the UI without configuring Supabase:

### 1. Open Browser Console

Press `F12` or right-click > Inspect

### 2. Run Mock Auth Command

```javascript
enableMockAuth()
```

You should see:
```
⚠️  MOCK AUTH MODE ENABLED - For testing only!
✅ Mock auth service activated
```

### 3. Test Registration

Now you can register and login with any email/password combination!

**Note**: Mock auth data is stored only in localStorage and will be lost on page refresh.

---

## 📋 Supabase Email Settings Guide

### Minimum Configuration (Testing)

```
Authentication > Providers > Email
├── [✓] Enable Email provider
├── [ ] Confirm email (disabled for testing)
└── [Save]
```

### Production Configuration

```
Authentication > Providers > Email
├── [✓] Enable Email provider
├── [✓] Confirm email
├── SMTP Settings:
│   ├── SMTP Host: smtp.gmail.com (or your provider)
│   ├── SMTP Port: 587
│   ├── SMTP User: your-email@gmail.com
│   └── SMTP Password: your-app-password
└── [Save]
```

### Email Templates

Customize in: **Authentication > Email Templates**

- Confirmation email
- Magic link email
- Reset password email
- Email change confirmation

---

## 🧪 Testing Checklist

### Test Registration Flow

1. Navigate to `http://localhost:3001/login`
2. Click **"Sign Up"** tab
3. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123` (min 8 chars)
   - Confirm Password: `password123`
4. Click **"Create Account"**

**Expected Results**:
- ✅ If email confirmation is **disabled**: Immediately logged in
- ✅ If email confirmation is **enabled**: "Check your email" message

### Test Login Flow

1. Go to **"Login"** tab
2. Enter registered email and password
3. Click **"Login with Email"**

**Expected Result**:
- ✅ Redirected to protected dashboard
- ✅ User email shown in header
- ✅ "Logout" button appears

### Test Protected Routes

1. While logged out, navigate to: `http://localhost:3001/`
2. **Expected**: Redirected to `/login`
3. After logging in, navigate to: `http://localhost:3001/`
4. **Expected**: Dashboard shown

### Test Logout

1. Click **"Logout"** button in header
2. **Expected**: Redirected to `/login`
3. Try accessing `http://localhost:3001/`
4. **Expected**: Redirected to `/login` again

---

## 🔍 Debug Commands

Run these in browser console:

### Check Supabase Configuration
```javascript
checkSupabaseConfig()
```

### Enable Mock Auth (Testing)
```javascript
enableMockAuth()
```

### Check Current User
```javascript
await sharedServices.supabaseAuthService.getCurrentUser()
```

### Manual Login Test
```javascript
await sharedServices.supabaseAuthService.signIn('test@example.com', 'password123')
```

---

## 🐛 Common Issues

### Issue 1: "Authentication service not available"
**Cause**: Shared library not loaded  
**Fix**: Ensure shell app is running on port 9000

### Issue 2: "Invalid login credentials"
**Cause**: User not registered or wrong password  
**Fix**: Register the user first

### Issue 3: OAuth not working
**Cause**: OAuth providers not configured in Supabase  
**Fix**: Enable Google/GitHub in Authentication > Providers

### Issue 4: CORS errors
**Cause**: Supabase URL not in allowed list  
**Fix**: Check Supabase > Settings > API > Site URL

---

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Email Auth Setup](https://supabase.com/docs/guides/auth/auth-email)
- [OAuth Setup](https://supabase.com/docs/guides/auth/social-login)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## ✅ Quick Fix Summary

**Fastest way to get authentication working:**

1. Go to https://app.supabase.com/project/YOUR_PROJECT/auth/providers
2. Enable **Email** provider
3. **Uncheck** "Confirm email" (for testing)
4. Click **Save**
5. Reload your app
6. Try registering!

**That's it!** 🎉
