export {}

declare module '#app' {
  interface NuxtApp {
    $auth: {
      login: (email: string, password: string) => Promise<void>
      logout: () => void
    }
  }
  interface NuxtApp {
    $axios: AxiosInstance
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance
    $auth: NuxtApp['$auth']
  }
}
