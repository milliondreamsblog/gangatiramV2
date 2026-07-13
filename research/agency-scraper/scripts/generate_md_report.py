import json
import os

def generate_report():
    scraped_file = 'scraped_search_results.json'
    extracted_file = 'extracted_agencies.json'
    output_file = 'agency_research_sheet_v3.md'
    
    if not os.path.exists(scraped_file):
        print("No scraped data found.")
        return
        
    with open(scraped_file, 'r', encoding='utf-8') as f:
        scraped = json.load(f)
        
    extracted = {}
    if os.path.exists(extracted_file):
        with open(extracted_file, 'r', encoding='utf-8') as f:
            extracted = json.load(f)
            
    md = []
    md.append("# 🎯 Agency Research Sheet V3 — Progress Snapshot")
    md.append("## This is an ongoing snapshot of the full scraping process")
    md.append("\n> [!NOTE]")
    md.append("> This report contains the currently scraped Google organic results and any agencies extracted from them so far.\n")
    
    tab_counter = 1
    for category, queries in scraped.items():
        md.append(f"## Tab {tab_counter}: \"{category}\" — Google US Results\n")
        
        # Flatten all links for this category
        all_links = {}
        for query, results in queries.items():
            for res in results:
                url = res.get('url')
                if url and url not in all_links and 'google.com' not in url:
                    all_links[url] = res.get('title')
        
        # Write table
        md.append("| Rank | Title | URL |")
        md.append("|------|-------|-----|")
        
        rank = 1
        urls_in_order = []
        for url, title in all_links.items():
            clean_title = title.replace('|', '-').strip() if title else ""
            md.append(f"| {rank} | {clean_title} | {url} |")
            urls_in_order.append(url)
            rank += 1
            
        md.append("\n### Extracted Agencies from the above articles:\n")
        
        has_agencies = False
        for url in urls_in_order:
            agencies = extracted.get(url, [])
            if agencies:
                has_agencies = True
                md.append(f"**From {url}:**")
                for i, agency in enumerate(agencies, 1):
                    md.append(f"{i}. {agency}")
                md.append("")
                
        if not has_agencies:
            md.append("*(Agency extraction for this category is still running or no agencies were found yet.)*\n")
            
        md.append("---\n")
        tab_counter += 1
        
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(md))
        
    print(f"Generated {output_file}")

if __name__ == '__main__':
    generate_report()
