import asyncio
import json
import os
import re
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

def extract_agencies_from_html(url, html):
    soup = BeautifulSoup(html, 'html.parser')
    agencies = set()
    
    def add_agency(name):
        if not name: return
        clean = re.sub(r'\s+', ' ', name).strip()
        clean = re.sub(r'^\d+[\.\)]\s*', '', clean)
        lower = clean.lower()
        if 2 < len(clean) < 50 and all(x not in lower for x in ['contact', 'about us', 'services', 'how to choose', 'read more', 'learn more']):
            agencies.add(clean)

    if 'clutch.co' in url:
        for el in soup.select('.company_info h3.company_info__title a'): add_agency(el.text)
        for el in soup.select('.provider-info__name a'): add_agency(el.text)
        for el in soup.select('.directory-list h3.company_info__title a'): add_agency(el.text)
    elif 'designrush.com' in url:
        for el in soup.select('h3.agency-name a'): add_agency(el.text)
        for el in soup.select('.agency-details h2'): add_agency(el.text)
    elif 'goodfirms.co' in url:
        for el in soup.select('h3.agency-name'): add_agency(el.text)
        for el in soup.select('.provider-name'): add_agency(el.text)
    elif 'themanifest.com' in url:
        for el in soup.select('.provider-card__title a'): add_agency(el.text)
        for el in soup.select('h3.provider-card__title'): add_agency(el.text)
    else:
        for el in soup.select('h2, h3'):
            text = el.text.strip()
            if re.match(r'^\d+[\.\)]\s+[A-Za-z]', text):
                add_agency(text)

    return list(agencies)

async def main():
    input_file = "scraped_search_results.json"
    output_file = "extracted_agencies.json"
    user_data_dir = "C:/Users/Akshat Darshi/.gemini/antigravity-ide/brain/b820361e-d8c1-4127-8b30-893205277340/browser_profile"

    with open(input_file, 'r', encoding='utf-8') as f:
        scraped_data = json.load(f)

    progress = {}
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                progress = json.load(f)
        except Exception:
            pass

    async with async_playwright() as p:
        print("Launching browser...")
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()

        try:
            url_count = 0
            for category, urls_map in scraped_data.items():
                print(f"\nProcessing category: {category}")
                for search_url, results in urls_map.items():
                    for link_obj in results:
                        target_url = link_obj.get("url")
                        if not target_url or "reddit.com" in target_url or "quora.com" in target_url:
                            continue
                            
                        if target_url in progress:
                            print(f"Skipping (already extracted): {target_url}")
                            continue

                        url_count += 1
                        print(f"[{url_count}] Fetching: {target_url}")
                        try:
                            # Using wait_until=domcontentloaded to speed up navigation
                            await page.goto(target_url, wait_until="domcontentloaded", timeout=20000)
                            await page.wait_for_timeout(2000) # Give it 2s to run JS
                            
                            html = await page.content()
                            
                            if "Access denied" in html or "cloudflare" in html.lower() or "Please verify you are a human" in html:
                                print("[!] Cloudflare/Captcha detected. Waiting 10s for manual/auto solve...")
                                await page.wait_for_timeout(10000)
                                html = await page.content()
                                
                            agencies = extract_agencies_from_html(target_url, html)
                            print(f"Found {len(agencies)} agencies.")
                            progress[target_url] = agencies

                            with open(output_file, 'w', encoding='utf-8') as f:
                                json.dump(progress, f, indent=2)

                        except Exception as e:
                            print(f"Failed to fetch {target_url}: {e}")
                            progress[target_url] = [] # Mark as empty to avoid infinite retry on dead links
                            
        finally:
            await context.close()

if __name__ == "__main__":
    asyncio.run(main())
