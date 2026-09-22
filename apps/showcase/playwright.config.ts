import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:3010', trace: 'retain-on-failure' },
  webServer: {
    command: 'npx --offline --yes pnpm@9.15.0 dev --port 3010',
    url: 'http://127.0.0.1:3010',
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
