import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ipLogger from './plugins/ip-logger.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ipLogger()],
})
