import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      host: 'localhost',
      port: 1242,
      hmr: {
        clientPort: 1242,
      },
      https: false,
    },
    root: '.',
    envDir: './config',
    plugins: [react()],
  };
});
