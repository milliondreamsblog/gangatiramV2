import asyncio
import json
import os
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

SEARCH_CONFIGS = {
    "Best UX Agencies": [
        "https://www.google.com/search?q=best+ux+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+design+agencies+united+states&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+ux+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+design+agencies+north+america&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+ux+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best Web Design Agencies": [
        "https://www.google.com/search?q=best+web+design+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+web+design+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+website+design+companies+united+states&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+web+design+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+web+design+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+web+design+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+web+design+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best SaaS Design Agencies": [
        "https://www.google.com/search?q=best+saas+design+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+saas+design+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+saas+ux+agencies+north+america&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+saas+design+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+saas+design+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+saas+design+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+saas+design+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best Product Design Agencies": [
        "https://www.google.com/search?q=best+product+design+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+product+design+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+product+design+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+product+design+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+product+design+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+product+design+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best Framer Agencies": [
        "https://www.google.com/search?q=best+framer+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+framer+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+framer+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+framer+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+framer+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+framer+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best Webflow Agencies": [
        "https://www.google.com/search?q=best+webflow+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+webflow+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+webflow+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+webflow+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+webflow+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+webflow+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ],
    "Best MVP Design Agencies": [
        "https://www.google.com/search?q=best+mvp+design+agencies&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=top+mvp+design+agencies+usa&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+mvp+design+agencies+site%3Aclutch.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+mvp+design+agencies+site%3Adesignrush.com&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+mvp+design+agencies+site%3Agoodfirms.co&gl=us&hl=en&pws=0",
        "https://www.google.com/search?q=best+mvp+design+agencies+site%3Athemanifest.com&gl=us&hl=en&pws=0"
    ]
}

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
    output_file = "scraped_search_results.json"
    user_data_dir = "C:/Users/Akshat Darshi/.gemini/antigravity-ide/brain/b820361e-d8c1-4127-8b30-893205277340/browser_profile"
    
    # Load progress if it exists
    progress = {}
    if os.path.exists(output_file):
        try:
            with open(output_file, 'r', encoding='utf-8') as f:
                progress = json.load(f)
        except Exception:
            pass

    async with async_playwright() as p:
        print("Launching headed browser...")
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        try:
            for category, urls in SEARCH_CONFIGS.items():
                print(f"\n--- Category: {category} ---")
                if category not in progress:
                    progress[category] = {}
                    
                for url in urls:
                    if url in progress[category]:
                        print(f"Skipping (already scraped): {url}")
                        continue
                    
                    modified_url = url
                    if "&num=" not in url:
                        modified_url += "&num=30"
                        
                    print(f"Navigating to: {modified_url}")
                    await page.goto(modified_url, wait_until="domcontentloaded")
                    await page.wait_for_timeout(2000)
                    
                    # Wait for results or captcha solving
                    while True:
                        content = await page.content()
                        if "unusual traffic" in content.lower() and "about this page" in content.lower():
                            print("\n[!] CAPTCHA Detected! Please solve the captcha in the opened browser window...")
                            await asyncio.sleep(4)
                        else:
                            # Verify if search results actually loaded
                            results = await extract_links_from_page(page)
                            if results:
                                break
                            else:
                                print("Waiting for search results to load...")
                                await asyncio.sleep(2)
                                
                    print(f"Successfully scraped {len(results)} links.")
                    progress[category][url] = results
                    
                    # Save progress incrementally
                    with open(output_file, 'w', encoding='utf-8') as f:
                        json.dump(progress, f, indent=2)
                        
                    await asyncio.sleep(3)
                    
        finally:
            await context.close()
            
    print("\nScraping completed! Results saved to:", output_file)

if __name__ == "__main__":
    asyncio.run(main())
