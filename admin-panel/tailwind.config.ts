// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [],
  theme: {
    extend: {
      colors: {} // ✅ ensure colors exists
    }
  },
  plugins: []
}

export default config
