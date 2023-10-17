import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  setTimeout(() => {
    console.log(process.env.TUNNEL_SUBDOMAIN);
  }
  , 1000);
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
