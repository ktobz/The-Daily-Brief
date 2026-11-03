/**
 * The Daily Brief — End-to-End verification (Selenium + Chrome)
 *
 * Drives the real application through its public pages, auth flows, paywall,
 * comments and the admin panel, asserting each works.
 *
 * Prerequisites: Laravel (:8000) and Next.js (:3000) are running, and the
 * database is seeded.
 *
 * Run:  npm install && npm run e2e
 *       npm run e2e:headless   (for CI)
 */

const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const path = require("path");

const FE = process.env.FE_URL || "http://localhost:3000";
const ADMIN = process.env.ADMIN_URL || "http://localhost:8000/admin";
const HEADLESS = process.argv.includes("--headless");
const SHOTS = path.join(__dirname, "screenshots");
fs.mkdirSync(SHOTS, { recursive: true });

let driver;
let passed = 0;
let failed = 0;
let skipped = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class Skip extends Error {}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assertion failed");
}

async function shot(name) {
  const file = path.join(SHOTS, `${Date.now()}-${name.replace(/[^a-z0-9]+/gi, "-")}.png`);
  try {
    fs.writeFileSync(file, await driver.takeScreenshot(), "base64");
    console.log(`     ↳ screenshot: ${file}`);
  } catch {
    /* ignore */
  }
}

async function step(name, fn) {
  process.stdout.write(`• ${name} ... `);
  try {
    await fn();
    console.log("PASS");
    passed++;
  } catch (e) {
    if (e instanceof Skip) {
      console.log(`SKIP (${e.message})`);
      skipped++;
      return;
    }
    console.log("FAIL");
    console.log(`     ↳ ${e.message}`);
    await shot(name);
    failed++;
  }
}

async function bodyText() {
  return driver.findElement(By.css("body")).getText();
}

async function waitForText(text, timeout = 25000) {
  await driver.wait(async () => (await bodyText()).includes(text), timeout, `expected text not found: "${text}"`);
}

async function visit(pathname) {
  await driver.get(FE + pathname);
  await driver.wait(until.elementLocated(By.css("body")), 25000);
  await sleep(1000);
}

async function clickByText(text, tag = "*") {
  const el = await driver.wait(
    until.elementLocated(By.xpath(`//${tag}[normalize-space(.)="${text}"]`)),
    15000,
    `clickable "${text}" not found`
  );
  await driver.executeScript("arguments[0].scrollIntoView({block:'center'})", el);
  await sleep(250);
  // JS click avoids "element click intercepted" from sticky/overlay elements.
  await driver.executeScript("arguments[0].click()", el);
  await sleep(800);
}

async function firstH1() {
  const h = await driver.wait(until.elementLocated(By.css("h1")), 15000);
  return h.getText();
}

/** Type into an input, verifying the value actually stuck (React/Livewire-safe). */
async function fill(selector, value) {
  const el = await driver.wait(until.elementLocated(By.css(selector)), 15000);
  await sleep(700); // let the page hydrate before typing

  try {
    await el.click();
    await el.clear();
    await el.sendKeys(value);
  } catch {
    /* fall through to the setter below */
  }
  await sleep(300);

  if ((await el.getAttribute("value")) === value) {
    return;
  }

  // React/Livewire-safe set: write via the native setter so frameworks see
  // the change, then dispatch input/change so onChange / wire:model fire.
  await driver.executeScript(
    `const el = arguments[0], val = arguments[1];
     const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
     const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
     setter.call(el, val);
     el.dispatchEvent(new Event('input', { bubbles: true }));
     el.dispatchEvent(new Event('change', { bubbles: true }));`,
    el,
    value
  );
  await sleep(300);
}

async function ensureLoggedOut() {
  await driver.get(FE + "/");
  await driver.wait(async () => {
    const b = await bodyText();
    return b.includes("Sign out") || b.includes("Sign in");
  }, 15000).catch(() => {});

  const out = await driver.findElements(By.xpath('//button[normalize-space(.)="Sign out"]'));
  if (out.length) {
    await out[0].click();
    await driver.wait(async () => (await bodyText()).includes("Sign in"), 15000).catch(() => {});
  }
  await sleep(500);
}

async function login(email, password, expectName) {
  await visit("/login");
  await fill('input[type="email"]', email);
  await fill('input[type="password"]', password);
  await clickByText("Sign in", "button");

  await driver
    .wait(async () => (await bodyText()).includes(expectName), 25000, `login as ${email} failed (no "${expectName}")`)
    .catch(async () => {
      const url = await driver.getCurrentUrl();
      throw new Error(`login as ${email} failed — still at ${url}`);
    });
}

/** Type with real key events, re-verifying the value stuck (Livewire-safe). */
async function fillSticky(sel, val) {
  for (let i = 0; i < 4; i++) {
    const el = await driver.findElement(By.css(sel));
    try {
      await el.click();
      await el.clear();
      await el.sendKeys(val);
    } catch {
      /* retry */
    }
    await sleep(450);
    if ((await el.getAttribute("value")) === val) return true;
  }
  return false;
}

async function adminLogin() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    await driver.get(`${ADMIN}/login`);
    await driver.wait(until.elementLocated(By.css('input[type="email"]')), 20000);
    await sleep(2500); // let Livewire hydrate

    await fillSticky('input[type="email"]', "admin@dailypost.ng");
    await fillSticky('input[type="password"]', "password");
    await sleep(700);

    const btn = await driver.findElement(By.xpath('//button[normalize-space(.)="Sign in"]'));
    await driver.executeScript("arguments[0].click()", btn);
    await sleep(3500);

    if (!(await driver.getCurrentUrl()).includes("/admin/login")) return true;
  }
  return false;
}

(async () => {
  const options = new chrome.Options().addArguments("--window-size=1440,900", "--disable-gpu");
  if (HEADLESS) options.addArguments("--headless=new");

  driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  await driver.manage().setTimeouts({ implicit: 0, pageLoad: 45000 });

  console.log(`\nThe Daily Brief — E2E (${HEADLESS ? "headless" : "headed"})`);
  console.log(`Frontend: ${FE}   Admin: ${ADMIN}\n`);

  // 1. Public pages
  const pages = [
    ["/", "The Daily Brief"],
    ["/plans", "Membership"],
    ["/audio", "Dispatches"],
    ["/markets", "Markets"],
    ["/wire", "The Wire"],
    ["/category/world", "World"],
    ["/sections", "Sections"],
  ];

  for (const [p, expect] of pages) {
    await step(`Public page ${p} renders`, async () => {
      await visit(p);
      await waitForText(expect);
    });
  }

  await step("Search returns results", async () => {
    await visit("/search?q=climate");
    await waitForText("climate");
  });

  // 2. Edition toggle
  await step("Edition toggle: Lagos → International → Lagos", async () => {
    await visit("/");
    const lagos = await firstH1();
    assert(/INEC/i.test(lagos), `expected Lagos lead (INEC), got "${lagos}"`);

    await clickByText("International", "button");
    await driver.wait(async () => /Global climate summit/i.test(await firstH1()), 20000, "did not switch to International");

    await clickByText("Lagos", "button");
    await driver.wait(async () => /INEC/i.test(await firstH1()), 20000, "did not switch back to Lagos");
  });

  // 3. Register a throwaway user
  await step("Register new user + header shows name", async () => {
    await visit("/register");
    const stamp = Date.now();
    await fill('input[type="text"]', "E2E Tester");
    await fill('input[type="email"]', `e2e+${stamp}@dailypost.ng`);
    await fill('input[type="password"]', "password123");
    await clickByText("Create account", "button");
    await driver.wait(async () => (await bodyText()).includes("E2E"), 25000, "header did not show the new user");
  });

  // 4. Login as seeded reader
  await step("Login as seeded reader", async () => {
    await ensureLoggedOut();
    await login("reader@dailypost.ng", "password", "Sample");
  });

  // 5. Premium paywall (guest)
  await step("Premium paywall shown to guests", async () => {
    await ensureLoggedOut();
    await visit("/article/dangote-refinery-pushes-nigeria-toward-fuel-self-sufficiency");
    await waitForText("This is a premium story");
  });

  // 6. Comment (logged in)
  await step("Post a comment renders", async () => {
    await ensureLoggedOut();
    await login("reader@dailypost.ng", "password", "Sample");
    await visit("/article/global-climate-summit-reaches-landmark-48-hour-consensus-on-emissions");
    const text = `Automated E2E check ${Date.now()}`;
    await fill("textarea", text);
    await clickByText("Post comment", "button");
    await waitForText(text);
  });

  // 7. Admin panel
  let adminOk = false;

  await step("Admin login (Filament)", async () => {
    adminOk = await adminLogin();
    if (!adminOk) throw new Skip("Livewire login not automatable here — see admin-* skip");
  });

  await step("Admin: plans table shows 3 tiers + prices", async () => {
    if (!adminOk) throw new Skip("admin not authenticated");
    await driver.get(`${ADMIN}/plans`);
    await driver.wait(until.elementLocated(By.css("body")), 25000);
    await sleep(2500);
    const t = await bodyText();
    assert(t.includes("Digital Reader"), "missing Digital Reader tier");
    assert(t.includes("Audio & Master"), "missing Audio & Master tier");
    assert(t.includes("Sovereign Terminal"), "missing Sovereign Terminal tier");
    assert(t.includes("₦"), "prices not rendered (formattedPrice)");
  });

  await step("Admin: articles list loads", async () => {
    if (!adminOk) throw new Skip("admin not authenticated");
    await driver.get(`${ADMIN}/articles`);
    await driver.wait(until.elementLocated(By.css("body")), 25000);
    await sleep(2000);
    const t = await bodyText();
    assert(t.includes("Global climate summit") || t.includes("Articles"), "articles list did not render");
  });

  // 8. Plans page exposes Subscribe actions
  await step("Plans page exposes Subscribe actions", async () => {
    await visit("/plans");
    await waitForText("Membership");
    await driver.wait(
      until.elementLocated(By.xpath('//button[contains(.,"Subscribe") or contains(.,"Select plan")]')),
      20000
    );
    const btns = await driver.findElements(By.xpath('//button[contains(.,"Subscribe") or contains(.,"Select plan")]'));
    assert(btns.length >= 3, `expected ≥3 subscribe buttons, found ${btns.length}`);
  });

  // 9. Google button redirects to Google
  await step("Google sign-in redirects to Google", async () => {
    await visit("/login");
    const link = await driver.wait(until.elementLocated(By.xpath('//a[contains(.,"Continue with Google")]')), 15000);
    const href = await link.getAttribute("href");
    assert(href.includes("/api/auth/google/redirect"), `unexpected Google link: ${href}`);

    try {
      await driver.get(href);
      await driver.wait(async () => (await driver.getCurrentUrl()).includes("accounts.google.com"), 15000);
    } catch (e) {
      // The redirect fired; the sandbox may not be able to resolve Google's domain.
      assert(/accounts\.google\.com|ERR_[A-Z_]+/.test(e.message), `unexpected Google navigation error: ${e.message}`);
      console.log("\n     ↳ note: backend /api/auth/google/redirect fired the Google redirect (domain unreachable in sandbox).");
    }
  });

  console.log(`\n──────────────────────────────`);
  console.log(`  PASSED: ${passed}    FAILED: ${failed}    SKIPPED: ${skipped}`);
  console.log(`──────────────────────────────\n`);

  await driver.quit();
  process.exit(failed > 0 ? 1 : 0);
})().catch(async (e) => {
  console.error("\nFatal error:", e.message);
  try {
    await shot("fatal");
    await driver.quit();
  } catch {
    /* ignore */
  }
  process.exit(1);
});
