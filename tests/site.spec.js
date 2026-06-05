// @ts-check
const { test, expect } = require('@playwright/test');

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Kingston 3 Consulting/);
  });

  test('hero headline is visible', async ({ page }) => {
    const hero = page.locator('.hero-home__headline');
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('define who you are');
  });

  test('hero CTAs are present and linked', async ({ page }) => {
    const bookBtn = page.locator('.hero-home__actions a').first();
    await expect(bookBtn).toBeVisible();
    await expect(bookBtn).toHaveAttribute('href', /calendly\.com/);
  });

  test('navigation links are all present', async ({ page }) => {
    const links = ['About', 'Services', 'Process', 'Insights', 'Contact'];
    for (const label of links) {
      await expect(page.locator(`.nav__links a:text("${label}")`).first()).toBeVisible();
    }
  });

  test('"Work With Me" nav CTA links to contact page', async ({ page }) => {
    const cta = page.locator('.nav__cta');
    await expect(cta).toHaveAttribute('href', '/contact.html');
  });

  test('marquee is rendered', async ({ page }) => {
    await expect(page.locator('.marquee')).toBeVisible();
  });

  test('stats bar shows Miami Herald credential', async ({ page }) => {
    await expect(page.locator('.stats')).toContainText('Miami Herald');
  });

  test('services section has 3 items', async ({ page }) => {
    const items = page.locator('.service-item');
    await expect(items).toHaveCount(3);
  });

  test('each service item links to its own page', async ({ page }) => {
    const hrefs = await page.locator('.service-item').evaluateAll(els =>
      els.map(el => el.getAttribute('href'))
    );
    expect(hrefs).toContain('/services/media-strategy.html');
    expect(hrefs).toContain('/services/literary-representation.html');
    expect(hrefs).toContain('/services/advocacy.html');
  });

  test('about section is visible', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('.about-strip')).toBeVisible();
    await expect(page.locator('.about-strip')).toContainText('Fabian');
  });

  test('process section has 4 steps', async ({ page }) => {
    await page.locator('#process').scrollIntoViewIfNeeded();
    await expect(page.locator('.process-step')).toHaveCount(4);
  });

  test('testimonials section is present', async ({ page }) => {
    await page.locator('#testimonials').scrollIntoViewIfNeeded();
    await expect(page.locator('.testimonial-card')).toHaveCount(3);
  });

  test('blog section has 3 articles', async ({ page }) => {
    await page.locator('#blog').scrollIntoViewIfNeeded();
    await expect(page.locator('.blog-card')).toHaveCount(3);
  });

  test('CTA banner is present with booking link', async ({ page }) => {
    await page.locator('.cta-banner').scrollIntoViewIfNeeded();
    const ctaLink = page.locator('.cta-banner__actions a').first();
    await expect(ctaLink).toHaveAttribute('href', /calendly\.com/);
  });

  test('GHL chat widget script is injected', async ({ page }) => {
    const ghlScript = page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]');
    await expect(ghlScript).toHaveCount(1);
  });

  test('footer has logo, nav links and social links', async ({ page }) => {
    const footer = page.locator('.footer');
    await expect(footer).toContainText('Kingston 3 Consulting');
    await expect(footer.locator('a[href*="linkedin"]')).toBeVisible();
    await expect(footer.locator('a[href*="instagram"]')).toBeVisible();
  });

  test('floating CTA button appears after scroll', async ({ page }) => {
    // Initially hidden
    const floatBtn = page.locator('.float-cta');
    await expect(floatBtn).not.toHaveClass(/visible/);
    // Scroll down to trigger
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(500);
    await expect(floatBtn).toHaveClass(/visible/);
  });

  test('nav becomes scrolled after scroll', async ({ page }) => {
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(400);
    await expect(page.locator('.nav')).toHaveClass(/scrolled/);
  });

  test('has valid meta description', async ({ page }) => {
    const meta = page.locator('meta[name="description"]');
    const content = await meta.getAttribute('content');
    expect(content?.length).toBeGreaterThan(50);
  });

  test('has Open Graph tags', async ({ page }) => {
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });

  test('has structured data JSON-LD', async ({ page }) => {
    const ld = page.locator('script[type="application/ld+json"]');
    await expect(ld).toHaveCount(1);
    const json = await ld.textContent();
    const parsed = JSON.parse(json || '{}');
    expect(parsed['@context']).toBe('https://schema.org');
  });
});

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
test.describe('Navigation', () => {
  test('mobile burger opens menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const burger = page.locator('.nav__burger');
    await expect(burger).toBeVisible();
    await burger.click();
    await expect(page.locator('.nav__mobile')).toHaveClass(/open/);
  });

  test('mobile menu closes on link click', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('.nav__burger').click();
    await page.locator('.nav__mobile a').first().click();
    await expect(page.locator('.nav__mobile')).not.toHaveClass(/open/);
  });

  test('services dropdown is visible on hover (desktop)', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__dropdown').hover();
    await expect(page.locator('.nav__dropdown-menu')).toBeVisible();
  });
});

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
test.describe('About page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/about.html'); });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/About Fabian Lyon/);
  });

  test('hero mentions Miami Herald', async ({ page }) => {
    await expect(page.locator('.page-hero')).toContainText('Miami Herald');
  });

  test('bio section is substantive', async ({ page }) => {
    const bio = page.locator('.richtext');
    await expect(bio).toContainText('Kobe Bryant');
    await expect(bio).toContainText('Usain Bolt');
    await expect(bio).toContainText('Nandi Mandela');
  });

  test('credentials grid has 4 cards', async ({ page }) => {
    const cards = page.locator('.include-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test('CTA links to Calendly', async ({ page }) => {
    const cta = page.locator('a[href*="calendly"]').first();
    await expect(cta).toBeVisible();
  });

  test('GHL widget is present', async ({ page }) => {
    await expect(page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]')).toHaveCount(1);
  });
});

// ─── SERVICES PAGES ──────────────────────────────────────────────────────────
test.describe('Services pages', () => {
  const servicePages = [
    { url: '/services.html', title: /Services/ },
    { url: '/services/media-strategy.html', title: /Media Strategy/ },
    { url: '/services/literary-representation.html', title: /Literary/ },
    { url: '/services/advocacy.html', title: /Advocacy/ },
  ];

  for (const { url, title } of servicePages) {
    test(`${url} loads and has correct title`, async ({ page }) => {
      await page.goto(url);
      await expect(page).toHaveTitle(title);
    });

    test(`${url} has page hero`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('.page-hero')).toBeVisible();
    });

    test(`${url} has CTA to contact or Calendly`, async ({ page }) => {
      await page.goto(url);
      const cta = page.locator('a[href*="contact"], a[href*="calendly"]').first();
      await expect(cta).toBeVisible();
    });

    test(`${url} has GHL widget`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]')).toHaveCount(1);
    });
  }
});

// ─── PROCESS PAGE ────────────────────────────────────────────────────────────
test.describe('Process page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/process.html'); });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Process/);
  });

  test('has page hero', async ({ page }) => {
    await expect(page.locator('.page-hero')).toBeVisible();
  });

  test('GHL widget present', async ({ page }) => {
    await expect(page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]')).toHaveCount(1);
  });
});

// ─── BLOG PAGES ──────────────────────────────────────────────────────────────
test.describe('Blog pages', () => {
  const blogPages = [
    '/blog/',
    '/blog/why-your-story.html',
    '/blog/signing-a-deal.html',
    '/blog/media-coverage.html',
  ];

  for (const url of blogPages) {
    test(`${url} loads successfully`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response?.status()).toBeLessThan(400);
    });

    test(`${url} has GHL widget`, async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]')).toHaveCount(1);
    });
  }

  test('blog index has 3 articles', async ({ page }) => {
    await page.goto('/blog/');
    const cards = page.locator('.blog-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test('blog post contains substantive content', async ({ page }) => {
    await page.goto('/blog/why-your-story.html');
    const body = await page.locator('body').textContent();
    expect(body?.length).toBeGreaterThan(2000);
  });
});

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/contact.html'); });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Work With Me|Contact/);
  });

  test('contact form is present with required fields', async ({ page }) => {
    await expect(page.locator('#contactForm')).toBeVisible();
    await expect(page.locator('#firstName')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#story')).toBeVisible();
  });

  test('form requires email validation', async ({ page }) => {
    await page.locator('#firstName').fill('Test');
    await page.locator('#email').fill('not-an-email');
    await page.locator('#story').fill('Test story');
    await page.locator('#contactForm [type="submit"]').click();
    const emailInput = page.locator('#email');
    const validState = await emailInput.evaluate(el => el.validity.valid);
    expect(validState).toBe(false);
  });

  test('Calendly link is present', async ({ page }) => {
    const calendly = page.locator('a[href*="calendly"]').first();
    await expect(calendly).toBeVisible();
  });

  test('GHL widget is present', async ({ page }) => {
    await expect(page.locator('script[data-widget-id="6a21b55c9372a70f7d875c90"]')).toHaveCount(1);
  });
});

// ─── 404 PAGE ────────────────────────────────────────────────────────────────
test.describe('404 page', () => {
  test('loads and is branded', async ({ page }) => {
    await page.goto('/404.html');
    const body = await page.locator('body').textContent();
    expect(body).toMatch(/404|not found|off the record/i);
  });

  test('has link back to homepage', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('a[href="/"]').first()).toBeVisible();
  });
});

// ─── PERFORMANCE & ACCESSIBILITY ─────────────────────────────────────────────
test.describe('Performance & accessibility', () => {
  test('hero image has loading="eager"', async ({ page }) => {
    await page.goto('/');
    const heroImg = page.locator('.hero-home__bg img');
    await expect(heroImg).toHaveAttribute('loading', 'eager');
  });

  test('all images have alt attributes', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('img:not([alt])');
    expect(await imgs.count()).toBe(0);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    await page.goto('/');
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('mobile viewport renders without horizontal scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});

// ─── BOOKING MODAL ───────────────────────────────────────────────────────────
test.describe('Booking Modal', () => {
  test('opens when Work With Me CTA is clicked', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__cta').click();
    await expect(page.locator('#bookingModal')).toHaveClass(/open/);
  });

  test('modal has intake form with required fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__cta').click();
    await expect(page.locator('#m_firstName')).toBeVisible();
    await expect(page.locator('#m_email')).toBeVisible();
    await expect(page.locator('#m_story')).toBeVisible();
  });

  test('closes on X button click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__cta').click();
    await expect(page.locator('#bookingModal')).toHaveClass(/open/);
    await page.locator('#modalClose').click();
    await expect(page.locator('#bookingModal')).not.toHaveClass(/open/);
  });

  test('closes on Escape key', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__cta').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#bookingModal')).not.toHaveClass(/open/);
  });

  test('closes on overlay click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.nav__cta').click();
    await page.locator('#bookingModal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('#bookingModal')).not.toHaveClass(/open/);
  });

  test('hero Book a Call button opens modal', async ({ page }) => {
    await page.goto('/');
    await page.locator('.hero-home__actions a').first().click();
    await expect(page.locator('#bookingModal')).toHaveClass(/open/);
  });
});

// ─── VSL SECTION ─────────────────────────────────────────────────────────────
test.describe('VSL Section', () => {
  test('VSL section is present on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.vsl-section')).toBeVisible();
  });

  test('VSL play button is visible', async ({ page }) => {
    await page.goto('/');
    await page.locator('.vsl-player').scrollIntoViewIfNeeded();
    await expect(page.locator('.vsl-player__btn')).toBeVisible();
  });

  test('VSL video modal opens on play click', async ({ page }) => {
    await page.goto('/');
    await page.locator('.vsl-player').click();
    await expect(page.locator('#videoModal')).toHaveClass(/open/);
  });

  test('VSL video modal closes on X', async ({ page }) => {
    await page.goto('/');
    await page.locator('.vsl-player').click();
    await page.locator('#videoModalClose').click();
    await expect(page.locator('#videoModal')).not.toHaveClass(/open/);
  });
});
