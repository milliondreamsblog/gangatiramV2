import json
import csv
import os

def main():
    scraped_file = 'scraped_search_results.json'
    output_md = 'agency_research_sheet_v3_clean.md'
    output_csv = 'google_search_results_ranked.csv'

    if not os.path.exists(scraped_file):
        print("Missing scraped_search_results.json")
        return

    with open(scraped_file, 'r', encoding='utf-8') as f:
        scraped = json.load(f)

    md = []
    md.append("# 🎯 Agency Research Sheet V3 — Google US Search Results (Ranked)")
    md.append("## Method: `google.com/search?q=...&gl=us&hl=en&pws=0` (Browser)")
    md.append("")
    md.append("> [!IMPORTANT]")
    md.append("> All results below are **scraped directly from Google US** using `gl=us&hl=en&pws=0` parameters through the browser.")
    md.append("> These are the **actual organic results** a US user would see.")
    md.append("> Results are **deduplicated** across multiple search queries per category.")
    md.append("")
    md.append("---")
    md.append("")

    csv_rows = []
    tab_counter = 1

    for category, queries in scraped.items():
        md.append(f"## Tab {tab_counter}: \"{category}\" — Google US Results")
        md.append("")

        # Collect all unique URLs across all queries for this category, preserving order
        seen_urls = set()
        unique_results = []

        for query_url, results in queries.items():
            for res in results:
                url = res.get('url', '')
                title = res.get('title', '')
                if url and url not in seen_urls:
                    seen_urls.add(url)
                    unique_results.append({
                        'title': title,
                        'url': url,
                        'source_query': query_url
                    })

        # Write markdown table
        md.append("| Rank | Title | URL |")
        md.append("|------|-------|-----|")

        for rank, item in enumerate(unique_results, 1):
            clean_title = item['title'].replace('|', '–').strip() if item['title'] else ""
            md.append(f"| {rank} | {clean_title} | {item['url']} |")

            csv_rows.append({
                'Category': category,
                'Rank': rank,
                'Title': item['title'].strip(),
                'URL': item['url'],
                'Source Query': item['source_query']
            })

        md.append("")
        md.append(f"**Total unique results: {len(unique_results)}**")
        md.append("")
        md.append("---")
        md.append("")
        tab_counter += 1

    # Summary
    md.append("## Summary")
    md.append("")
    md.append("| Category | Unique Results |")
    md.append("|----------|---------------|")
    for category, queries in scraped.items():
        seen = set()
        for results in queries.values():
            for res in results:
                url = res.get('url', '')
                if url:
                    seen.add(url)
        md.append(f"| {category} | {len(seen)} |")

    total = len(csv_rows)
    md.append(f"| **TOTAL** | **{total}** |")
    md.append("")

    # Write MD
    with open(output_md, 'w', encoding='utf-8') as f:
        f.write("\n".join(md))
    print(f"[OK] Generated {output_md} ({tab_counter - 1} categories)")

    # Write CSV
    with open(output_csv, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['Category', 'Rank', 'Title', 'URL', 'Source Query'])
        writer.writeheader()
        writer.writerows(csv_rows)
    print(f"[OK] Generated {output_csv} ({total} rows)")

if __name__ == '__main__':
    main()
