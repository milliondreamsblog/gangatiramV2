import asyncio
import json
import csv
import os
import random
import re
from playwright.async_api import async_playwright
from urllib.parse import quote

CATEGORY = "Best Framer Agencies"
MAX_AGENCIES = 20
OUTPUT_FILE = "linkedin_results.json"
USER_DATA_DIR = "C:/Users/Akshat Darshi/.gemini/antigravity-ide/brain/b820361e-d8c1-4127-8b30-893205277340/browser_profile"

def get_first_n_agencies(category, n):
    agencies = []
    seen = set()
    with open('final_agency_list.csv', 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Category'] == category:
                name = row['Extracted Agency Name']
                if name not in seen:
                    seen.add(name)
                    agencies.append(name)
                    if len(agencies) >= n:
                        break
    return agencies

async def extract_search_results(page):
    """Extract people results from LinkedIn search page using JavaScript evaluation."""
    results = await page.evaluate('''() => {
        const items = [];
        
        // Method 1: Look for search result list items
        const resultContainers = document.querySelectorAll('li.reusable-search__result-container');
        for (const container of resultContainers) {
            // Get name - try multiple approaches
            let name = '';
            const nameSpan = container.querySelector('span[dir="ltr"] > span[aria-hidden="true"]');
            if (nameSpan) name = nameSpan.textContent.trim();
            if (!name) {
                const nameLink = container.querySelector('a.app-aware-link span[aria-hidden="true"]');
                if (nameLink) name = nameLink.textContent.trim();
            }
            
            // Get title/subtitle  
            let title = '';
            const subtitleEl = container.querySelector('.entity-result__primary-subtitle');
            if (subtitleEl) title = subtitleEl.textContent.trim();
            if (!title) {
                const summaryEl = container.querySelector('.entity-result__summary');
                if (summaryEl) title = summaryEl.textContent.trim();
            }
            
            // Get profile URL
            let profileUrl = '';
            const linkEl = container.querySelector('a.app-aware-link[href*="/in/"]');
            if (linkEl) profileUrl = linkEl.getAttribute('href').split('?')[0];
            
            if (name && name !== 'LinkedIn Member') {
                items.push({ name, title, profile_url: profileUrl });
            }
        }
        
        // Method 2: Fallback - just look for any link to a profile with nearby text
        if (items.length === 0) {
            const allLinks = document.querySelectorAll('a[href*="linkedin.com/in/"]');
            for (const link of allLinks) {
                const name = link.textContent.trim();
                if (name && name.length > 2 && name.length < 60 && name !== 'LinkedIn Member') {
                    items.push({
                        name: name,
                        title: '',
                        profile_url: link.getAttribute('href').split('?')[0]
                    });
                    break; // Just get the first one
                }
            }
        }
        
        return items;
    }''')
    return results

async def search_linkedin(page, agency_name, role_keywords, search_type):
    """Search LinkedIn for a person at the given agency with the given role."""
    query = f"{agency_name} {role_keywords}"
    search_url = f"https://www.linkedin.com/search/results/people/?keywords={quote(query)}&origin=GLOBAL_SEARCH_HEADER"
    
    print(f"  [{search_type}] Searching: {query}")
    
    try:
        await page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
        await page.wait_for_timeout(4000)  # Wait for JS rendering
        
        # Check if redirected to login
        if "login" in page.url or "signup" in page.url:
            print("  [!] LinkedIn login required! Please log in...")
            await page.wait_for_timeout(60000)
            await page.goto(search_url, wait_until="domcontentloaded", timeout=25000)
            await page.wait_for_timeout(4000)
        
        # Check for "no results"
        content = await page.content()
        if 'No results found' in content:
            print(f"  [{search_type}] -> No results found.")
            return None
            
        # Check for rate limiting / captcha
        if 'challenge' in page.url or 'checkpoint' in page.url:
            print(f"  [{search_type}] -> LinkedIn challenge/captcha! Waiting 30s...")
            await page.wait_for_timeout(30000)
            return None
        
        # Extract results
        results = await extract_search_results(page)
        
        if results and len(results) > 0:
            best = results[0]
            print(f"  [{search_type}] -> Found: {best['name']} | {best.get('title', 'N/A')}")
            return best
        else:
            # Debug: save a screenshot and log
            debug_file = f"debug_linkedin_{agency_name.replace(' ', '_')}_{search_type}.html"
            with open(debug_file, 'w', encoding='utf-8') as f:
                f.write(content[:5000])
            print(f"  [{search_type}] -> No results parsed. Debug saved to {debug_file}")
            return None
        
    except Exception as e:
        print(f"  [{search_type}] -> Error: {e}")
        return None

async def main():
    agencies = get_first_n_agencies(CATEGORY, MAX_AGENCIES)
    print(f"Processing {len(agencies)} agencies for category: {CATEGORY}\n")
    
    # Load existing results
    results = {}
    if os.path.exists(OUTPUT_FILE):
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            results = json.load(f)
    
    async with async_playwright() as p:
        print("Launching browser...")
        context = await p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
            viewport={"width": 1280, "height": 900}
        )
        page = await context.new_page()
        
        # Check LinkedIn login
        print("Checking LinkedIn login...")
        await page.goto("https://www.linkedin.com/feed/", wait_until="domcontentloaded", timeout=20000)
        await page.wait_for_timeout(5000)
        
        if "login" in page.url or "signup" in page.url:
            print("\n*** NOT LOGGED IN TO LINKEDIN! ***")
            print("*** Please log in in the browser window. ***")
            print("*** Waiting 60 seconds... ***\n")
            await page.wait_for_timeout(60000)
        else:
            print("[OK] LinkedIn login detected!\n")
        
        try:
            for i, agency in enumerate(agencies):
                key = f"{CATEGORY}|{agency}"
                
                if key in results and results[key].get("founder") is not None:
                    print(f"[{i+1}/{len(agencies)}] Skipping {agency} (already done)")
                    continue
                
                print(f"\n[{i+1}/{len(agencies)}] ===== {agency} =====")
                
                entry = {"agency": agency, "category": CATEGORY}
                
                # Search 1: Founder / Co-Founder / CEO
                founder = await search_linkedin(page, agency, "founder OR co-founder OR CEO", "FOUNDER")
                entry["founder"] = founder
                
                # Delay
                delay = random.uniform(8, 14)
                print(f"  (waiting {delay:.0f}s...)")
                await page.wait_for_timeout(int(delay * 1000))
                
                # Search 2: CMO / Marketing / Growth / SEO
                marketing = await search_linkedin(page, agency, "CMO OR head of marketing OR growth OR head of SEO", "MARKETING")
                entry["marketing"] = marketing
                
                results[key] = entry
                
                # Save after each agency
                with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                    json.dump(results, f, indent=2)
                
                # Delay before next agency
                delay = random.uniform(12, 22)
                print(f"  (waiting {delay:.0f}s before next agency...)")
                await page.wait_for_timeout(int(delay * 1000))
                
        finally:
            await context.close()
    
    # Print summary
    found_founder = sum(1 for v in results.values() if v.get("founder"))
    found_marketing = sum(1 for v in results.values() if v.get("marketing"))
    print(f"\n{'='*50}")
    print(f"[DONE] Results saved to {OUTPUT_FILE}")
    print(f"  Agencies processed: {len(results)}")
    print(f"  Founders found: {found_founder}")
    print(f"  Marketing people found: {found_marketing}")

if __name__ == "__main__":
    asyncio.run(main())
