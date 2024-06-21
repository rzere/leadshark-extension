chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fetchEmail') {
        const proxyUrl = 'http://localhost:3001/proxy'; // URL of your proxy server

        fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: request.profileUrl })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);
            if (data.response && data.response.email && data.response.email.email) {
                sendResponse({ email: data.response.email.email });
            } else {
                sendResponse({ error: 'No email found' });
            }
        })
        .catch(error => {
            console.error('Error fetching email:', error);
            sendResponse({ error: 'Error fetching email' });
        });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
