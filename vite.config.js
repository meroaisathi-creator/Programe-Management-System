import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/health-branch-app/", // यो लाइन अनिवार्य छ (तपाईंको रिपोजिटरीको नाम)
})