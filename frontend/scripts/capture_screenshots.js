import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('public', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Chrome from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  const pagesToCapture = [
    {
      name: '01_homepage_hero.png',
      url: 'http://localhost:5173/',
      waitMs: 3000,
      scrollTo: 0
    },
    {
      name: '02_homepage_sound_systems.png',
      url: 'http://localhost:5173/',
      waitMs: 2000,
      scrollTo: 1200
    },
    {
      name: '03_homepage_craft_process.png',
      url: 'http://localhost:5173/',
      waitMs: 2000,
      scrollTo: 2200
    },
    {
      name: '04_homepage_dealership_desk.png',
      url: 'http://localhost:5173/',
      waitMs: 2000,
      scrollTo: 3200
    },
    {
      name: '05_about_welcome_hero.png',
      url: 'http://localhost:5173/about',
      waitMs: 3000,
      scrollTo: 0
    },
    {
      name: '06_about_paisa_vasool_philosophy.png',
      url: 'http://localhost:5173/about',
      waitMs: 2000,
      scrollTo: 700
    },
    {
      name: '07_about_made_in_india_amplifiers.png',
      url: 'http://localhost:5173/about',
      waitMs: 2000,
      scrollTo: 1400
    },
    {
      name: '08_about_why_choose_us_pillars.png',
      url: 'http://localhost:5173/about',
      waitMs: 2000,
      scrollTo: 2100
    },
    {
      name: '09_about_contact_touch.png',
      url: 'http://localhost:5173/about',
      waitMs: 2000,
      scrollTo: 2800
    },
    {
      name: '10_products_catalog.png',
      url: 'http://localhost:5173/products',
      waitMs: 3000,
      scrollTo: 100
    },
    {
      name: '11_services_custom_audio.png',
      url: 'http://localhost:5173/services',
      waitMs: 3000,
      scrollTo: 100
    },
    {
      name: '12_contact_factory_desk.png',
      url: 'http://localhost:5173/contact',
      waitMs: 3000,
      scrollTo: 100
    },
    {
      name: '13_client_demo_page.png',
      url: 'http://localhost:5173/demo-radhe-radios.html',
      waitMs: 2500,
      scrollTo: 0
    },
    {
      name: '14_client_demo_amplifiers.png',
      url: 'http://localhost:5173/demo-radhe-radios.html',
      waitMs: 2000,
      scrollTo: 1100
    }
  ];

  for (const item of pagesToCapture) {
    console.log(`Navigating to ${item.url} for ${item.name}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, item.waitMs));

      if (item.scrollTo > 0) {
        await page.evaluate((y) => {
          window.scrollTo({ top: y, behavior: 'instant' });
        }, item.scrollTo);
        await new Promise(r => setTimeout(r, 1200));
      }

      const filePath = path.join(OUTPUT_DIR, item.name);
      await page.screenshot({ path: filePath, fullPage: false });
      console.log(`Saved screenshot: ${filePath}`);
    } catch (err) {
      console.error(`Error capturing ${item.name}:`, err.message);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(console.error);
