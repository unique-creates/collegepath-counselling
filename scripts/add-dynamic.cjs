// Script to add `export const dynamic = 'force-dynamic'` to all GET API routes
// that don't already have it. Run with: bun run scripts/add-dynamic.js

const fs = require('fs')
const path = require('path')

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api')

function walkRoutes(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walkRoutes(fullPath)
    } else if (entry.name === 'route.ts') {
      patchRoute(fullPath)
    }
  }
}

function patchRoute(file) {
  let content = fs.readFileSync(file, 'utf8')
  if (content.includes('force-dynamic')) return // already done

  // Find the first import line
  const importMatch = content.match(/^import .+$/m)
  if (!importMatch) return

  // Insert `export const dynamic = 'force-dynamic'` after the last import
  const lines = content.split('\n')
  let lastImportIdx = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i
  }
  if (lastImportIdx === -1) return

  lines.splice(lastImportIdx + 1, 0, '', "export const dynamic = 'force-dynamic'")
  fs.writeFileSync(file, lines.join('\n'))
  console.log('Patched:', file)
}

walkRoutes(apiDir)
console.log('Done.')
