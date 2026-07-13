import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

async def main():
    url = "https://www.google.com/search?q=best+ux+agencies&gl=us&hl=en&pws=0"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        
        content = await page.content()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Save for debugging
        with open("google_search_debug.html", "w", encoding="utf-8") as f:
            f.write(content)
            
        print(f"Title: {await page.title()}")
        
        # Try generic link extraction
        links = []
        for a in soup.find_all('a'):
            href = a.get('href')
            if not href or not href.startswith('http') or 'google.com' in href or 'googleusercontent.com' in href:
                continue
            
            # Check if it has a descendant h3 or is inside something that looks like a search result
            h3 = a.find('h3')
            if h3:
                links.append((h3.text, href))
                continue
                
            # Or if it's inside an h3
            parent_h3 = a.find_parent('h3')
            if parent_h3:
                links.append((parent_h3.text, href))
                
        print(f"Found {len(links)} potential result links using generic selector.")
        for l in links[:5]:
            print(l)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
