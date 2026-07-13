import csv
import re
import os

def parse_md(filepath):
    results = []
    current_category = "Unknown"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            
            # Match category
            cat_match = re.match(r'^## Tab \d+: "([^"]+)"', line)
            if cat_match:
                current_category = cat_match.group(1)
                continue
                
            # Match table row
            if line.startswith('|') and not line.startswith('| Rank') and not line.startswith('|---'):
                parts = [p.strip() for p in line.split('|')]
                if len(parts) >= 4:
                    rank = parts[1]
                    title = parts[2]
                    url = parts[3]
                    
                    if url and url.startswith('http'):
                        results.append({
                            'Category': current_category,
                            'Title': title,
                            'URL': url,
                            'Source': 'agency_research_sheet_v2.md'
                        })
    return results

def parse_csv(filepath):
    results = []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            results.append({
                'Category': row.get('Category', 'Unknown'),
                'Title': row.get('Title', ''),
                'URL': row.get('URL', ''),
                'Source': 'google_search_results_ranked.csv'
            })
    return results

def main():
    v2_path = r'c:\Users\Akshat Darshi\.gemini\antigravity-ide\brain\44dc3a09-d55c-496a-bbf1-70c7b55deb8f\agency_research_sheet_v2.md'
    csv_path = 'google_search_results_ranked.csv'
    
    v2_results = []
    if os.path.exists(v2_path):
        v2_results = parse_md(v2_path)
        print(f"Found {len(v2_results)} results in V2 md.")
    else:
        print(f"V2 md not found at {v2_path}")
        
    csv_results = []
    if os.path.exists(csv_path):
        csv_results = parse_csv(csv_path)
        print(f"Found {len(csv_results)} results in CSV.")
    else:
        print(f"CSV not found at {csv_path}")

    # Combine and deduplicate
    seen_urls = set()
    combined_results = []
    
    # We'll prioritize V2 if duplicates exist just to keep the manual clean titles, or just keep first seen
    for item in v2_results + csv_results:
        url = item['URL'].strip()
        # Clean URL slightly if needed, e.g. remove trailing slash
        clean_url = url.rstrip('/')
        
        if clean_url not in seen_urls:
            seen_urls.add(clean_url)
            combined_results.append(item)
            
    # Sort by Category, then by Source so V2 comes first
    combined_results.sort(key=lambda x: (x['Category'].lower(), x['Source']))

    output_file = 'combined_search_results_deduped.csv'
    with open(output_file, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['Category', 'Title', 'URL', 'Source'])
        writer.writeheader()
        writer.writerows(combined_results)
        
    print(f"Total unique results after combining: {len(combined_results)}")
    print(f"Saved to {output_file}")

if __name__ == '__main__':
    main()
