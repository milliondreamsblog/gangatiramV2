import fs from 'fs/promises';
import { parse } from 'node-html-parser';

function extractAgenciesFromHtml(url: string, root: any): string[] {
    const agencies: Set<string> = new Set();
    
    // Helper to clean and validate name
    const addAgency = (name: string) => {
        let clean = name.replace(/\s+/g, ' ').trim();
        // Remove common listicle numbers (e.g. "1. ", "10. ")
        clean = clean.replace(/^\d+[\.\)]\s*/, '');
        // Filter out obvious non-agency headings
        const lower = clean.toLowerCase();
        if (clean.length > 2 && clean.length < 50 && 
            !lower.includes('contact') && 
            !lower.includes('about us') && 
            !lower.includes('services') &&
            !lower.includes('how to choose')) {
            agencies.add(clean);
        }
    };

    // Site-specific selectors for the major directories
    if (url.includes('clutch.co')) {
        root.querySelectorAll('.company_info h3.company_info__title a').forEach((el: any) => addAgency(el.text));
        root.querySelectorAll('.provider-info__name a').forEach((el: any) => addAgency(el.text));
    } else if (url.includes('designrush.com')) {
        root.querySelectorAll('h3.agency-name a').forEach((el: any) => addAgency(el.text));
        root.querySelectorAll('.agency-details h2').forEach((el: any) => addAgency(el.text));
    } else if (url.includes('goodfirms.co')) {
        root.querySelectorAll('h3.agency-name').forEach((el: any) => addAgency(el.text));
        root.querySelectorAll('.provider-name').forEach((el: any) => addAgency(el.text));
    } else if (url.includes('themanifest.com')) {
        root.querySelectorAll('.provider-card__title a').forEach((el: any) => addAgency(el.text));
    } else {
        // Generic fallback for blogs and listicles (usually h2 or h3)
        root.querySelectorAll('h2, h3').forEach((el: any) => {
            const text = el.text.trim();
            // Listicles often use "1. Agency Name"
            if (/^\d+[\.\)]\s+[A-Za-z]/.test(text)) {
                addAgency(text);
            }
        });
    }

    return Array.from(agencies);
}

async function fetchAndExtractAgencies(url: string): Promise<string[]> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(15000)
        });
        
        if (!response.ok) {
            console.warn(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
            return [];
        }
        
        const html = await response.text();
        const root = parse(html);
        return extractAgenciesFromHtml(url, root);
    } catch (error: any) {
        console.warn(`Error fetching ${url}: ${error.message}`);
        return [];
    }
}

async function main() {
    const inputPath = 'scraped_search_results.json';
    const outputPath = 'extracted_agencies.json';
    
    // Read the scraped URLs
    const dataRaw = await fs.readFile(inputPath, 'utf-8');
    const scrapedData = JSON.parse(dataRaw);
    
    // Load progress if any
    let progress: Record<string, string[]> = {};
    try {
        const progressRaw = await fs.readFile(outputPath, 'utf-8');
        progress = JSON.parse(progressRaw);
    } catch (e) {
        // File doesn't exist yet
    }

    let urlCount = 0;
    
    // Collect all URLs to process
    for (const [category, urlsMap] of Object.entries(scrapedData)) {
        console.log(`\nProcessing category: ${category}`);
        
        for (const [searchUrl, results] of Object.entries(urlsMap as any)) {
            const links = results as any[];
            for (const linkObj of links) {
                const targetUrl = linkObj.url;
                
                if (progress[targetUrl]) {
                    console.log(`Skipping (already extracted): ${targetUrl}`);
                    continue;
                }
                
                urlCount++;
                console.log(`[${urlCount}] Fetching: ${targetUrl}`);
                
                const agencies = await fetchAndExtractAgencies(targetUrl);
                console.log(`Found ${agencies.length} agencies.`);
                
                progress[targetUrl] = agencies;
                
                // Save progress
                await fs.writeFile(outputPath, JSON.stringify(progress, null, 2));
                
                // Rate limiting delay (1 second)
                await new Promise(r => setTimeout(r, 1000));
            }
        }
    }
    
    console.log(`\nAgency extraction completed! Data saved to ${outputPath}`);
}

main().catch(console.error);
