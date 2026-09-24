import { defineConfig } from 'astro/config';

export default defineConfig({
  // Flat *.html output preserves the legacy page URLs used by inter-page links.
  build: { format: 'file' },
});
