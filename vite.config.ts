import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        intro: resolve(__dirname, 'intro.html'),
        birthday: resolve(__dirname, 'birthday.html'),
        shop: resolve(__dirname, 'shop.html'),
        slot: resolve(__dirname, 'slot.html'),
        fact: resolve(__dirname, 'fact.html'),
        fortune: resolve(__dirname, 'fortune.html'),
        history: resolve(__dirname, 'history.html'),
        letters: resolve(__dirname, 'letters.html'),
        blackjack: resolve(__dirname, 'blackjack.html'),
        runner: resolve(__dirname, 'runner.html'),
      }
    }
  }
})
