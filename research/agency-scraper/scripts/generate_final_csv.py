import json
import csv
import os
from urllib.parse import urlparse

def get_publisher_name(url):
    domain = urlparse(url).netloc.lower()
    domain = domain.replace('www.', '')
    
    if domain == 'clutch.co': return 'Clutch'
    if domain == 'designrush.com': return 'DesignRush'
    if domain == 'goodfirms.co': return 'GoodFirms'
    if domain == 'themanifest.com': return 'The Manifest'
    if domain == 'uxstudioteam.com': return 'UX Studio'
    if domain == 'reddit.com': return 'Reddit'
    if domain == 'quora.com': return 'Quora'
    if domain == 'awesomic.com': return 'Awesomic'
    if domain == 'superside.com': return 'Superside'
    if domain == 'cieden.com': return 'Cieden'
    if domain == '925studios.co': return '925Studios'
    
    # Generic capitalization
    name = domain.split('.')[0]
    return name.title()

def get_publisher_url(url):
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"

def main():
    scraped_file = 'scraped_search_results.json'
    extracted_file = 'extracted_agencies.json'
    output_csv = 'final_agency_list.csv'
    
    if not os.path.exists(scraped_file) or not os.path.exists(extracted_file):
        print("Missing required JSON files.")
        return
        
    with open(scraped_file, 'r', encoding='utf-8') as f:
        scraped = json.load(f)
        
    with open(extracted_file, 'r', encoding='utf-8') as f:
        extracted = json.load(f)
        
    rows = []
    
    # Keep track of unique agency-category pairs so we don't have infinite duplicates
    seen = set()
    
    for category, queries in scraped.items():
        for query_url, results in queries.items():
            for res in results:
                article_url = res.get('url', '')
                article_title = res.get('title', '')
                
                publisher_name = get_publisher_name(article_url)
                publisher_url = get_publisher_url(article_url)
                
                agencies = extracted.get(article_url, [])
                for agency in agencies:
                    # Clean agency name
                    agency_clean = agency.strip()
                    
                    key = (category, agency_clean.lower())
                    if key not in seen:
                        seen.add(key)
                        rows.append({
                            'Category': category,
                            'Publisher Name': publisher_name,
                            'Publisher Root URL': publisher_url,
                            'Article Title': article_title,
                            'Article URL': article_url,
                            'Extracted Agency Name': agency_clean
                        })
                        
    # Sort by Category, then Publisher
    rows.sort(key=lambda x: (x['Category'], x['Publisher Name'], x['Extracted Agency Name']))
    
    with open(output_csv, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=[
            'Category', 'Publisher Name', 'Publisher Root URL', 'Article Title', 'Article URL', 'Extracted Agency Name'
        ])
        writer.writeheader()
        writer.writerows(rows)
        
    print(f"Successfully generated {output_csv} with {len(rows)} records!")

if __name__ == '__main__':
    main()
