export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()
  
  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/')
  }
  
  // If user is authenticated and trying to access login page
  if (userStore.isAuthenticated && to.path === '/') {
    return navigateTo('/profile')
  }
})
