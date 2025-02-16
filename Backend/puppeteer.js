import puppeteer from 'puppeteer';

export async function fetchPublisherData(publisherName) {
    const searchQuery = encodeURIComponent(publisherName);  // Converts spaces to +
    const searchURL = `https://scholar.google.com/citations?hl=en&view_op=search_venues&vq=${searchQuery}&btnG=`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(searchURL, { waitUntil: 'networkidle2' });

    // Extract publication names and h5-index values
    const results = await page.evaluate(() => {
        let data = [];
        const rows = document.querySelectorAll('.gsc_mp_table tbody tr');

        rows.forEach(row => {
            const name = row.querySelector('.gsc_mvt_t')?.innerText.trim();
            const hIndex = row.querySelector('.gsc_mvt_n')?.innerText.trim();
            if (name && hIndex) {
                data.push({ name, hIndex });
            }
        });

        return data;
    });

    console.log(results);

    await browser.close();
    return results;
}