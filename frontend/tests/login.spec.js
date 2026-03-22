const { test, expect } = require('@playwright/test');

test.describe('Authentication Flows', () => {

  test('User can navigate to login and attempt authentication', async ({ page }) => {
    // 1. Navigate to the login page via the base URL
    await page.goto('/login');

    // 2. Wait for the page form to load (checking for either "Email Address" or unique heading)
    // We target inputs by their apparent placeholder or type, avoiding deep DOM coupling
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Check visibility
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // 3. Fill in the credentials
    await emailInput.fill('test.streamer@example.com');
    await passwordInput.fill('securepassword123');

    // 4. Click the login button (it contains the text 'Sign In' or 'Login')
    const loginButton = page.locator('button[type="submit"]');
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // 5. Verification: Check if validation kicks in (since this is a test account and the backend might reject it)
    // Here we just ensure we didn't crash on click.
    // If the system works perfectly, it should trigger a network request.
    
    // We can also verify that we stay on the page with a toast error, or redirect if it succeeds.
    // Since we don't know the test account credentials on the live DB, we just ensure it didn't throw an unhandled React error.
    const crashText = page.locator('text="Something went wrong"');
    await expect(crashText).not.toBeVisible();
  });

});
