import { defineConfig } from 'tsup'
import { readFileSync, writeFileSync } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineConfig([
  /* Default core entrypoint - Add your own entrypoints here */
  {
    entry: ['packages/core/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    minify: false,
    external: ['react', 'react-dom', 'react-dom/client'],
    async onSuccess() {
      try {
        // Build Tailwind CSS
        await execAsync('npx tailwindcss -i packages/core/styles.css -o dist/temp-styles.css --minify')

        // Read the compiled CSS
        const css = readFileSync('dist/temp-styles.css', 'utf-8')

        // Replace CSS placeholder in all generated JS files (CJS and ESM)
        const jsFiles = ['dist/index.js', 'dist/index.mjs']

        for (const jsFile of jsFiles) {
          try {
            let content = readFileSync(jsFile, 'utf-8')
            // Replace the placeholder with actual CSS, properly escaping backslashes and backticks
            const escapedCss = css
              .replace(/\\/g, '\\\\') // Double-escape existing backslashes first
              .replace(/`/g, '\\`') // Then escape backticks
            content = content.replace(/\/\* CSS_PLACEHOLDER \*\//g, escapedCss)
            writeFileSync(jsFile, content)
          } catch (error) {
            console.warn(`⚠️  Could not update ${jsFile}:`, error.message)
          }
        }

        console.log('✅ CSS injected into all JS outputs successfully')
      } catch (error) {
        console.error('❌ Failed to inject styles:', error)
      }
    },
  },
])
