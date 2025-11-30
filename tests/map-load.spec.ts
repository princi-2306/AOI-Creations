
import { test, expect } from '@playwright/test';

test('Map renders and AOI controls are visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Wait a bit for the map to initialize
  await page.waitForTimeout(2000);
  // The second container is usually the visible one
  const maps = page.locator('.leaflet-container');
  const mapCount = await maps.count();
  console.log(`Found ${mapCount} map containers`);
  
  // Try different map containers until we find the visible one
  let visibleMap = null;
  for (let i = 0; i < mapCount; i++) {
    const map = maps.nth(i);
    const isVisible = await map.isVisible();
    console.log(`Map ${i} visible: ${isVisible}`);
    if (isVisible) {
      visibleMap = map;
      break;
    }
  }
  
  // If no map found visible, use the first one and wait for it
  if (!visibleMap) {
    visibleMap = maps.first();
    await expect(visibleMap).toBeVisible({ timeout: 10000 });
  }
  
  console.log('Map container is visible');
  
  // Check for drawing controls with longer timeout
  const drawButton = page.locator('.leaflet-pm-icon-polygon').first();
  await expect(drawButton).toBeVisible({ timeout: 10000 });
  
  console.log('Drawing controls are visible');
});