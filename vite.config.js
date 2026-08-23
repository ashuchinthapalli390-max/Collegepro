import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { authServerPlugin } from './src/server/authMiddleware.js';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), authServerPlugin()],
});
