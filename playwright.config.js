// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  // Run global login setup before any tests execute
  globalSetup: './global_login.js',

  // Default timeout for each test (50 seconds)
  timeout: 50000,

  // Directory where all test files are located
  testDir: './tests',

  // Run test files in parallel
  fullyParallel: false,

  // Prevent accidental test.only from passing on CI pipeline
  forbidOnly: !!process.env.CI,

  // Retry failed tests only on CI (no retries locally)
  retries: process.env.CI ? 2 : 0,

  // Limit to 1 worker on CI to avoid resource issues; unlimited locally
  workers: 1,

  // Use HTML reporter to generate a visual test report
  reporter: 'html',

  use: {
    // Capture trace only when retrying a failed test (useful for debugging)
    trace: 'on-first-retry',

    // Use the saved authenticated session for all tests by default
    storageState: 'auth.json',
  },

  projects: [
    
    {
      // Run tests on Desktop Chrome only (other browsers commented out below)
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },

    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },

    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // Uncomment below to spin up a local dev server before running tests
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});