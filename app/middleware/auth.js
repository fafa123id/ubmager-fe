// middleware/auth.js
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path.startsWith('/auth')) {
    return;
  }

  const { user, checkAuth } = useAuth();
  const authInitialized = useState('auth_initialized');

  // ✅ TUNGGU sampai plugin selesai init
  if (!authInitialized.value) {
    console.log("Middleware [auth]: Waiting for auth initialization...");
    
    // Polling sampai initialized (biasanya cuma 100-500ms)
    await new Promise(resolve => {
      const checkInterval = setInterval(() => {
        if (authInitialized.value) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 10); // Check every 10ms
      
      // Timeout safety (max 5 detik)
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 5000);
    });
  }

  try {
    // Sekarang checkAuth pasti udah selesai dari plugin
    const isAuthed = await checkAuth();
    console.log(`Middleware [auth]: Auth check result: ${isAuthed}`);
    
    if (isAuthed) {
      console.log("Middleware [auth]: User authenticated. Allowing navigation.");
      return;
    }
    
    console.log("Middleware [auth]: User not authenticated. Redirecting to login.");
    
    if (!to.path.startsWith("/auth")) {
      nextTick(() => {
        useSwal().showError("Silakan masuk terlebih dahulu untuk mengakses halaman ini.");
      });
    }

    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, { replace: true });
    
  } catch (error) {
    console.error('Middleware [auth]: Error checking auth:', error);
    return navigateTo(`/auth/login?next=${encodeURIComponent(to.fullPath)}`, { replace: true });
  }
});