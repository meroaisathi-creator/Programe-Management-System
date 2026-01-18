import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Repo को नाम ठ्याक्कै यहाँ राख्नुहोला (Case Sensitive हुन्छ)
  base: "/Program-Management-System/",
})