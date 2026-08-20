// Script to add `cache: 'no-store'` to all GET fetch() calls in client components.
// Run with: node scripts/add-no-store.cjs

const fs = require('fs')
const path = require('path')

const dirs = [
  path.join(__dirname, '..', 'src', 'components'),
  path.join(__dirname, '..', 'src', 'lib'),
]

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
      patchFile(fullPath)
    }
  }
}

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8')
  let changed = false

  // Match simple GET fetch calls: fetch('/api/...') or fetch(`/api/...${...}`)
  // We need to add { cache: 'no-store' } as the second argument
  // But not if it already has a second argument

  // Pattern 1: fetch('/api/...') with no options - just a string URL
  content = content.replace(
    /fetch\((['"`])(\/api\/[^'"`]+)\1\s*\)/g,
    (match, quote, url) => {
      // Check if next char is ',' or ')' - if ',', skip
      const idx = content.indexOf(match)
      const after = content.substring(idx + match.length, idx + match.length + 1)
      if (after === ',') return match
      changed = true
      return `fetch(${quote}${url}${quote}, { cache: 'no-store' })`
    }
  )

  // Pattern 2: fetch(`/api/...${var}...`) with no options - template literal
  content = content.replace(
    /fetch\((`\/api\/[^`]+`)\s*\)/g,
    (match, url) => {
      const idx = content.indexOf(match)
      const after = content.substring(idx + match.length, idx + match.length + 1)
      if (after === ',') return match
      changed = true
      return `fetch(${url}, { cache: 'no-store' })`
    }
  )

  if (changed) {
    fs.writeFileSync(file, content)
    console.log('Patched:', file)
  }
}

dirs.forEach(walk)
console.log('Done.')
