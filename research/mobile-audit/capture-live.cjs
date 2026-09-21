const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright-core");

const url = process.argv[2] || "https://bricxlabs.com/";
const outputRoot = path.resolve(process.argv[3] || "research/mobile-audit/live");
const executablePath =
  process.env.BRICX_CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const viewports = [
  [320, 740],
  [360, 800],
  [390, 844],
  [393, 852],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];

async function inspectPage(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const selectorFor = (element) => {
      if (element.id) return `#${element.id}`;
      const classes = [...element.classList]
        .filter((name) => /^[a-zA-Z_-][\w-]*$/.test(name))
        .slice(0, 3)
        .map((name) => `.${name}`)
        .join("");
      return `${element.tagName.toLowerCase()}${classes}`;
    };
    const roundedRect = (rect) => ({
      x: Math.round(rect.x * 10) / 10,
      y: Math.round((rect.y + scrollY) * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      right: Math.round(rect.right * 10) / 10,
    });

    const viewport = {
      width: innerWidth,
      height: innerHeight,
      devicePixelRatio,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      bodyWidth: document.body.scrollWidth,
      metaViewport: document.querySelector('meta[name="viewport"]')?.content || null,
    };

    const documentOverflow = viewport.documentWidth > viewport.width + 1;
    const overflowCandidates = documentOverflow
      ? [...document.querySelectorAll("body *")]
          .filter(visible)
          .map((element) => ({
            element,
            rect: element.getBoundingClientRect(),
            style: getComputedStyle(element),
          }))
          .filter(
            ({ rect, style }) =>
              style.position !== "fixed" &&
              (rect.right > innerWidth + 1 || rect.left < -1 || rect.width > innerWidth + 1),
          )
          .slice(0, 80)
          .map(({ element, rect, style }) => ({
            selector: selectorFor(element),
            text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 100),
            rect: roundedRect(rect),
            overflowX: style.overflowX,
            position: style.position,
            transform: style.transform === "none" ? null : style.transform,
          }))
      : [];

    const sectionHeadings = [...document.querySelectorAll("h1, h2")]
      .filter(visible)
      .map((element) => ({
        level: element.tagName.toLowerCase(),
        text: (element.textContent || "").replace(/\s+/g, " ").trim(),
        rect: roundedRect(element.getBoundingClientRect()),
        fontSize: getComputedStyle(element).fontSize,
        lineHeight: getComputedStyle(element).lineHeight,
      }));

    const interactive = [...document.querySelectorAll('a[href], button, [role="button"], input, select, textarea')]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: selectorFor(element),
          label:
            element.getAttribute("aria-label") ||
            (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80) ||
            element.getAttribute("alt") ||
            "",
          rect: roundedRect(rect),
          href: element instanceof HTMLAnchorElement ? element.href : null,
        };
      });

    const smallTargets = interactive.filter(
      ({ rect }) => rect.width < 44 || rect.height < 44,
    );
    const images = [...document.images]
      .filter(visible)
      .map((image) => ({
        alt: image.alt,
        rect: roundedRect(image.getBoundingClientRect()),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        loading: image.loading,
        complete: image.complete,
        currentSrc: image.currentSrc,
      }));

    return {
      title: document.title,
      url: location.href,
      viewport,
      documentOverflow,
      overflowCandidates,
      sectionHeadings,
      interactiveCount: interactive.length,
      smallTargetCount: smallTargets.length,
      smallTargets: smallTargets.slice(0, 100),
      imageCount: images.length,
      brokenImages: images.filter(
        (image) => image.complete && (image.naturalWidth === 0 || image.naturalHeight === 0),
      ),
      eagerBelowFoldImages: images.filter(
        (image) => image.rect.y > innerHeight * 2 && image.loading !== "lazy",
      ).slice(0, 100),
      bodyTextSample: document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 500),
    };
  });
}

(async () => {
  fs.mkdirSync(outputRoot, { recursive: true });
  const browser = await chromium.launch({ executablePath, headless: true });
  const summary = [];

  try {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        isMobile: width <= 430,
        hasTouch: width <= 430,
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("requestfailed", (request) => {
        failedRequests.push({
          url: request.url(),
          error: request.failure()?.errorText || "unknown",
        });
      });

      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 45_000,
      });
      await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});
      await page.addStyleTag({
        content:
          "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;scroll-behavior:auto!important}",
      });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
        window.scrollTo(0, 0);
      });

      const label = `${width}x${height}`;
      const inspection = await inspectPage(page);
      const record = {
        label,
        status: response?.status() || null,
        ...inspection,
        consoleErrors,
        pageErrors,
        failedRequests,
      };
      fs.writeFileSync(
        path.join(outputRoot, `${label}.json`),
        JSON.stringify(record, null, 2),
      );
      await page.screenshot({
        path: path.join(outputRoot, `${label}-full.png`),
        fullPage: true,
        animations: "disabled",
      });
      await page.screenshot({
        path: path.join(outputRoot, `${label}-top.png`),
        fullPage: false,
        animations: "disabled",
      });
      summary.push({
        label,
        status: record.status,
        documentWidth: record.viewport.documentWidth,
        documentHeight: record.viewport.documentHeight,
        documentOverflow: record.documentOverflow,
        sectionHeadingCount: record.sectionHeadings.length,
        smallTargetCount: record.smallTargetCount,
        brokenImageCount: record.brokenImages.length,
        eagerBelowFoldImageCount: record.eagerBelowFoldImages.length,
        consoleErrorCount: consoleErrors.length,
        pageErrorCount: pageErrors.length,
        failedRequestCount: failedRequests.length,
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(
    path.join(outputRoot, "summary.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), url, summary }, null, 2),
  );
  console.log(JSON.stringify(summary, null, 2));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
