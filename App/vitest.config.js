import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ["src/__tests__/setup.js"], // Opcional, para setup global (puedes crearlo si lo necesitas)
        coverage: {
            reporter: ['text', 'html'],
            exclude: ['src/__tests__/setup.js']
        }
    }
})