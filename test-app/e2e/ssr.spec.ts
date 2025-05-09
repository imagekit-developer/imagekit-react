import { test, expect } from "@playwright/test";

test("SSR test case", async ({ page }) => {
  await page.goto("/ssr");

  // Scroll to the bottom of the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await page.waitForTimeout(2000); // Wait for 2 seconds

  // Locate the output element (adjust selector as needed)
  const outputElement = page.locator('.container');

  // Grab the entire HTML from the element
  const outputHtml = await outputElement.evaluate(el => el.outerHTML);

  // Compare against a stored snapshot
  expect(outputHtml).toMatchSnapshot();
});
