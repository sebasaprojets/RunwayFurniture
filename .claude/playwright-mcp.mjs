#!/usr/bin/env node
// Starts the Playwright MCP server. In Claude Code cloud containers the browser lives in
// /opt/pw-browsers, so point the server at it; everywhere else Playwright finds Chrome itself.
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'

const env = { ...process.env }
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'
if (!env.PLAYWRIGHT_MCP_EXECUTABLE_PATH && existsSync(root)) {
  const dir = readdirSync(root)
    .filter((d) => /^chromium-\d+$/.test(d))
    .sort()
    .pop()
  const chrome = dir && `${root}/${dir}/chrome-linux/chrome`
  if (chrome && existsSync(chrome)) env.PLAYWRIGHT_MCP_EXECUTABLE_PATH = chrome
}

const args = ['-y', '@playwright/mcp@0.0.83', '--headless', '--isolated', ...(process.platform === 'linux' ? ['--no-sandbox'] : [])]
const child = spawn('npx', args, { stdio: 'inherit', env, shell: process.platform === 'win32' })
child.on('exit', (code) => process.exit(code ?? 0))
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => child.kill(sig))
