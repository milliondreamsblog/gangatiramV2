import asyncio
import json
from playwright.async_api import async_playwright
from playwright_stealth import Stealth
from bs4 import BeautifulSoup

async def extract_links_from_page(page):
    content = await page.content()
    soup = BeautifulSoup(content, 'html.parser')
    
    results = []
    # Try preferred selector first
    for a in soup.select('div.yuRUbf a'):
        href = a.get('href')
        title = a.select_one('h3')
        if href and title and 'google.com' not in href and 'webcache.googleusercontent.com' not in href:
            results.append({
                'title': title.text.strip(),
                'url': href
            })
            if len(results) >= 20:
                break
                
    # Fallback selector
    if not results:
        for h3 in soup.select('h3'):
            parent_a = h3.find_parent('a')
            if parent_a:
                href = parent_a.get('href')
                if href and 'google.com' not in href and 'webcache.googleusercontent.com' not in href:
                    results.append({
                        'title': h3.text.strip(),
                        'url': href
                    })
                    if len(results) >= 20:
                        break
    return results

async def main():
    url = "https://www.google.com/search?q=best+ux+agencies&gl=us&hl=en&pws=0&num=30"
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        # Apply stealth to the page
        await Stealth().apply_stealth_async(page)
        
        print(f"Navigating to: {url}")
        await page.goto(url, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        
        content = await page.content()
        if "captcha" in content.lower() or "unusual traffic" in content.lower():
            print("[!] CAPTCHA Detected even with stealth.")
            
        results = await extract_links_from_page(page)
        
        print(f"Successfully scraped {len(results)} links.")
        with open("single_keyword_results.json", "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
