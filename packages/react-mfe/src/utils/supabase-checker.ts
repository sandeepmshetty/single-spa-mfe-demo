/**
 * Supabase Configuration Checker
 * Run this to verify your Supabase setup
 */

export const checkSupabaseConfig = async () => {
  const sharedServices = (globalThis as any).sharedServices;
  
  console.group('🔍 Supabase Configuration Check');
  
  // 1. Check if service is available
  if (!sharedServices?.supabaseAuthService) {
    console.error('❌ Supabase Auth Service not available!');
    console.log('Make sure shared-library is loaded and services are initialized.');
    console.groupEnd();
    return;
  }
  
  console.log('✅ Supabase Auth Service is available');
  
  // 2. Check environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  console.log('Environment Variables:');
  console.log('  SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('  SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
  
  // 3. Test connection
  try {
    console.log('\n📡 Testing Supabase connection...');
    const { data, error } = await sharedServices.supabaseAuthService.getCurrentUser();
    
    if (error && error.message.includes('anonymous')) {
      console.error('❌ Anonymous sign-ins are disabled in Supabase');
      console.log('\n📋 To fix this, go to Supabase Dashboard:');
      console.log('   1. Navigate to Authentication > Providers');
      console.log('   2. Enable "Email" provider');
      console.log('   3. Configure email settings (or disable email confirmation for testing)');
      console.log('   4. Save changes');
    } else if (error) {
      console.error('❌ Connection error:', error.message);
    } else {
      console.log('✅ Connected to Supabase successfully');
      if (data.user) {
        console.log('✅ User is logged in:', data.user.email);
      } else {
        console.log('ℹ️  No user currently logged in');
      }
    }
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
  }
  
  console.groupEnd();
  
  // Return instructions
  return {
    supabaseUrl: supabaseUrl || 'NOT_SET',
    hasKey: !!supabaseKey,
    instructions: `
To enable email authentication in Supabase:

1. Go to: https://app.supabase.com/project/YOUR_PROJECT/auth/providers
2. Enable "Email" provider
3. For testing, you can:
   - Disable "Confirm email" (faster testing)
   - Or set up email templates and SMTP
4. Save and try again
    `.trim()
  };
};

// Auto-run if in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).checkSupabaseConfig = checkSupabaseConfig;
  console.log('💡 Run checkSupabaseConfig() in console to verify Supabase setup');
}
