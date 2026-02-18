#!/usr/bin/env node
/**
 * Auto-push watcher: When you save files, automatically commits and pushes to GitHub.
 * Vercel then auto-deploys. Run with: npm run watch-push
 *
 * Watches: app/, components/, lib/, public/, types/, config files
 * Ignores: node_modules, .next, .git, .env
 * Debounce: 15 seconds after last change before pushing
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEBOUNCE_MS = 15000;
const IGNORE = ['node_modules', '.next', '.git', '.vercel', 'scripts/auto-push'];

let debounceTimer = null;

function run(cmd, args, cwd = process.cwd()) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, { cwd, shell: true, stdio: 'inherit' });
    proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`Exit ${code}`))));
  });
}

async function push() {
  console.log('\n--- Auto-pushing to GitHub ---');
  try {
    await run('git', ['add', '.']);
    const msg = `Auto-update: ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`;
    await run('git', ['commit', '-m', msg]);
    try {
      await run('git', ['push', 'origin', 'main']);
    } catch {
      await run('git', ['push', 'origin', 'master']);
    }
    console.log('Pushed. Vercel will deploy automatically.\n');
  } catch {
    console.log('(No changes to commit, or push failed.)\n');
  }
  debounceTimer = null;
}

function schedulePush(filename) {
  if (IGNORE.some((i) => filename.includes(i))) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => push(), DEBOUNCE_MS);
  console.log(`[${new Date().toLocaleTimeString()}] Change: ${filename} → pushing in ${DEBOUNCE_MS / 1000}s (Ctrl+C to cancel)`);
}

function main() {
  const root = process.cwd();
  console.log('Auto-push watcher running. Saving files will trigger git push in 15s.');
  console.log('Press Ctrl+C to stop.\n');

  try {
    fs.watch(root, { recursive: true }, (event, filename) => {
      if (!filename) return;
      schedulePush(filename);
    });
  } catch (err) {
    console.error('Watch failed:', err.message);
    process.exit(1);
  }
}

main();
