import asyncio
from playwright.async_api import async_playwright

async def main():
    user_data_dir = "C:/Users/Akshat Darshi/.gemini/antigravity-ide/brain/b820361e-d8c1-4127-8b30-893205277340/browser_profile"
    url = "https://www.google.com/search?q=best+ux+agencies&gl=us&hl=en&pws=0"
    
    async with async_playwright() as p:
        context = await p.chromium.launch_persistent_context(
            user_data_dir=user_data_dir,
            headless=False,
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        print("Navigating to google...")
        await page.goto(url, wait_until="domcontentloaded")
        await page.wait_for_timeout(5000)
        
        content = await page.content()
        with open("google_search_success.html", "w", encoding="utf-8") as f:
            f.write(content)
        
        print("HTML saved to google_search_success.html")
        await context.close()

if __name__ == "__main__":
    asyncio.run(main())
