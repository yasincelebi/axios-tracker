import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
export default defineConfig({
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'axios-tracker',
            // the proper extensions will be added
            fileName: 'axios-tracker',
            formats: ['cjs', 'es'],
        },

    },
    plugins: [dts()]
})