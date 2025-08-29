export {}

declare module '#app' {
  interface NuxtApp {
    $auth: {
      login: (email: string, password: string) => Promise<void>
      logout: () => void
    }
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $auth: NuxtApp['$auth']
  }
}
