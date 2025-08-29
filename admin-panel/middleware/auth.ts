import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
  const token = process.client ? localStorage.getItem('token') : null

  // If no token and not already on login page, redirect
  if (!token && to.path !== '/login') {
    return navigateTo('/login')
  }

  // If token exists and trying to access login page, redirect to dashboard
  if (token && to.path === '/login') {
    return navigateTo('/dashboard/salat')
  }
})


// export default defineNuxtRouteMiddleware((to) => {
//   if (process.client) {
//     const token = localStorage.getItem('token')
//     if (!token && to.path !== '/login') return navigateTo('/login')
//     if (token && to.path === '/login') return navigateTo('/dashboard')
//   }
// })