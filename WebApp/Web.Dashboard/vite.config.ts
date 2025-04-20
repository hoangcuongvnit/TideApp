import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { env } from 'process';
import dynamicImport from 'vite-plugin-dynamic-import';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';

const target = env.ASPNETCORE_HTTPS_PORT ? `https://host.docker.internal:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://host.docker.internal:7145';
console.log('Target API: ' + target);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          'babel-plugin-macros'
        ]
      }
    }),
    dynamicImport(),
    mkcert()
  ],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: target,
        changeOrigin: true,
        secure: false,
      },
    },
    //host: "0.0.0.0",
    port: 8080
  },
  build: {
    outDir: 'build',
    target: env.VITE_BUILD_TARGET || 'esnext'
  }
});
