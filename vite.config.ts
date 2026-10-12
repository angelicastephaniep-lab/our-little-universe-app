import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WA_OFFICIAL_NAMES = [
  'WhatsApp Image 2026-10-07 at 7.32.01 PM.jpeg',
  'WhatsApp Image 2026-09-18 at 4.40.44 PM.jpeg',
  'WhatsApp Image 2026-10-08 at 11.44.18 PM.jpeg',
  'WhatsApp Image 2026-09-21 at 2.49.27 PM.jpeg',
];

/**
 * Dev server middleware plugin to save photos uploaded via the camera button
 * directly to the project's disk inside /public/photos/ so they become permanent files.
 */
function photoSavePlugin(): Plugin {
  return {
    name: 'photo-save-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-photo', (req, res, next) => {
        if (req.method !== 'POST') return next();

        const chunks: Buffer[] = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf-8');
            const body = JSON.parse(rawBody);
            const { index, dataUrl, fileName } = body;

            if (!dataUrl || typeof index !== 'number') {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing dataUrl or index' }));
              return;
            }

            const targetName = fileName || WA_OFFICIAL_NAMES[index] || `foto${index + 1}.jpeg`;
            const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');

            const photosDir = path.resolve(__dirname, 'public/photos');
            if (!fs.existsSync(photosDir)) {
              fs.mkdirSync(photosDir, { recursive: true });
            }

            const targetPath = path.join(photosDir, targetName);
            fs.writeFileSync(targetPath, buffer);

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              success: true, 
              fileName: targetName, 
              path: `/photos/${targetName}` 
            }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Server error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    publicDir: 'public',
    plugins: [react(), tailwindcss(), photoSavePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
