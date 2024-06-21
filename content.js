console.log('Content script loaded');

function scrapeLinkedInData() {
    const results = [];
    document.querySelectorAll('.fsQsyrCZyNZvckewyGXOPPXpnQAIwisxc').forEach(profile => {
        const nameElement = profile.querySelector('.entity-result__title-text a span[aria-hidden="true"]');
        const profileUrlElement = profile.querySelector('.entity-result__title-text a');
        const currentPositionElement = profile.querySelector('.entity-result__primary-subtitle');
        const locationElement = profile.querySelector('.entity-result__secondary-subtitle');
        const badgeElement = profile.querySelector('.entity-result__badge-text span[aria-hidden="true"]');
        const summaryElement = profile.querySelector('.entity-result__summary');
        const servicesElement = profile.querySelector('.reusable-search-simple-insight__text-container span strong');
        const requestServicesElement = profile.querySelector('.reusable-search-premium-custom-cta-insight a');

        const name = nameElement ? nameElement.innerText : '';
        const profileUrl = profileUrlElement ? profileUrlElement.href : '';
        const currentPosition = currentPositionElement ? currentPositionElement.innerText : '';
        const location = locationElement ? locationElement.innerText : '';
        const badge = badgeElement ? badgeElement.innerText : '';
        const summary = summaryElement ? summaryElement.innerText.trim() : '';
        const services = servicesElement ? servicesElement.innerText.trim() : '';
        const requestServicesUrl = requestServicesElement ? requestServicesElement.href : '';

        results.push({
            Name: name,
            ProfileURL: profileUrl,
            CurrentPosition: currentPosition,
            Location: location,
            Badge: badge,
            Summary: summary,
            Services: services,
            RequestServicesURL: requestServicesUrl
        });
    });

    chrome.runtime.sendMessage({ action: 'scrapedData', data: results });
}

scrapeLinkedInData();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'scrapeData') {
        console.log('Received message to scrape data');
        const data = scrapeLinkedInData();
        sendResponse({ data: data });
    }
});
