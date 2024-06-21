document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded');

    // Automatically trigger the export functionality
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log('Active tab:', tabs[0]);

        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: function() {
                const profiles = [];
                document.querySelectorAll('.reusable-search__entity-result-list .reusable-search__result-container, .update-components-actor__container').forEach(container => {
                    let nameElement, profileUrl, avatarElement, avatarUrl, primarySubtitleElement, primarySubtitle, secondarySubtitleElement, secondarySubtitle, badgeElement, badge, summaryElement, summary, servicesElement, services, requestServicesElement, requestServicesUrl;

                    // Handle old format
                    if (container.classList.contains('reusable-search__result-container')) {
                        nameElement = container.querySelector('.entity-result__title-text a span[aria-hidden="true"]');
                        profileUrl = nameElement ? nameElement.closest('a').href : null;
                        avatarElement = container.querySelector('.presence-entity__image');
                        avatarUrl = avatarElement ? avatarElement.src : null;
                        primarySubtitleElement = container.querySelector('.entity-result__primary-subtitle');
                        primarySubtitle = primarySubtitleElement ? primarySubtitleElement.textContent.trim() : null;
                        secondarySubtitleElement = container.querySelector('.entity-result__secondary-subtitle');
                        secondarySubtitle = secondarySubtitleElement ? secondarySubtitleElement.textContent.trim() : null;
                        badgeElement = container.querySelector('.entity-result__badge span[aria-hidden="true"]');
                        badge = badgeElement ? badgeElement.textContent.trim() : null;
                        summaryElement = container.querySelector('.entity-result__summary');
                        summary = summaryElement ? summaryElement.textContent.trim() : null;
                        servicesElement = container.querySelector('.reusable-search-simple-insight__text-container span strong');
                        services = servicesElement ? servicesElement.textContent.trim() : null;
                        requestServicesElement = container.querySelector('.reusable-search-premium-custom-cta-insight a');
                        requestServicesUrl = requestServicesElement ? requestServicesElement.href : null;
                    }

                    // Handle new format
                    if (container.classList.contains('update-components-actor__container')) {
                        nameElement = container.querySelector('.update-components-actor__name span[aria-hidden="true"]');
                        profileUrl = container.querySelector('.app-aware-link').href;
                        avatarElement = container.querySelector('.ivm-view-attr__img--centered');
                        avatarUrl = avatarElement ? avatarElement.src : null;
                        primarySubtitleElement = container.querySelector('.update-components-actor__description');
                        primarySubtitle = primarySubtitleElement ? primarySubtitleElement.textContent.trim() : null;
                        secondarySubtitleElement = container.querySelector('.update-components-actor__supplementary-actor-info');
                        secondarySubtitle = secondarySubtitleElement ? secondarySubtitleElement.textContent.trim() : null;
                        badge = null; // No badge in new format
                        summary = null; // No summary in new format
                        services = null; // No services in new format
                        requestServicesUrl = null; // No request services URL in new format
                    }

                    // Exclude companies
                    if (profileUrl && !profileUrl.includes('/company/')) {
                        profiles.push({
                            name: nameElement ? nameElement.textContent.trim() : null,
                            profileUrl,
                            avatarUrl,
                            primarySubtitle,
                            secondarySubtitle,
                            badge,
                            summary,
                            services,
                            requestServicesUrl
                        });
                    }
                });

                return profiles;
            }
        }, function(results) {
            if (results && results[0] && results[0].result) {
                populateTable(results[0].result);
            }
        });
    });

    function populateTable(profiles) {
        const tableBody = document.querySelector('#profileTable tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        profiles.forEach(profile => {
            const row = document.createElement('tr');

            const avatarCell = document.createElement('td');
            const avatarImg = document.createElement('img');
            avatarImg.src = profile.avatarUrl;
            avatarImg.className = 'avatar';
            avatarCell.appendChild(avatarImg);
            row.appendChild(avatarCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = profile.name;
            row.appendChild(nameCell);

            const urlCell = document.createElement('td');
            const urlLink = document.createElement('a');
            urlLink.href = profile.profileUrl;
            urlLink.textContent = profile.profileUrl;
            urlLink.target = '_blank';
            urlCell.appendChild(urlLink);
            row.appendChild(urlCell);

            const currentPositionCell = document.createElement('td');
            currentPositionCell.textContent = profile.primarySubtitle;
            row.appendChild(currentPositionCell);

            const locationCell = document.createElement('td');
            locationCell.textContent = profile.secondarySubtitle;
            row.appendChild(locationCell);

            const badgeCell = document.createElement('td');
            badgeCell.textContent = profile.badge;
            row.appendChild(badgeCell);

            const summaryCell = document.createElement('td');
            summaryCell.textContent = profile.summary;
            row.appendChild(summaryCell);

            const servicesCell = document.createElement('td');
            servicesCell.textContent = profile.services;
            row.appendChild(servicesCell);

            const requestServicesCell = document.createElement('td');
            const requestServicesLink = document.createElement('a');
            requestServicesLink.href = profile.requestServicesUrl;
            requestServicesLink.textContent = profile.requestServicesUrl;
            requestServicesLink.target = '_blank';
            requestServicesCell.appendChild(requestServicesLink);
            row.appendChild(requestServicesCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = 'N/A'; // Placeholder for email, will be updated by Enhance button
            row.appendChild(emailCell);

            const actionsCell = document.createElement('td');
            const enhanceButton = document.createElement('button');
            enhanceButton.textContent = 'Enhance';
            enhanceButton.addEventListener('click', function() {
                enhanceProfile(profile.profileUrl, profile.avatarUrl, emailCell, enhanceButton);
            });
            actionsCell.appendChild(enhanceButton);
            row.appendChild(actionsCell);

            tableBody.appendChild(row);
        });
    }

    function enhanceProfile(profileUrl, avatarUrl, emailCell, enhanceButton) {
        enhanceButton.disabled = true;
        enhanceButton.textContent = 'Loading...';

        // Call to Apollo API through proxy server
        fetch('http://localhost:3000/proxy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: profileUrl })
        })
            .then(response => response.json())
            .then(data => {
                if (data.person) {
                    displayProfileDetails(data.person, avatarUrl);
                } else {
                    emailCell.textContent = 'No email found';
                }
            })
            .catch(error => {
                console.error('Error fetching email from Apollo:', error);
                emailCell.textContent = 'Error';
            })
            .finally(() => {
                enhanceButton.disabled = false;
                enhanceButton.textContent = 'Enhance';
            });
    }

    function displayProfileDetails(person, avatarUrl) {
        const detailsContainer = document.getElementById('profileDetails');
        const tableContainer = document.getElementById('profileTableContainer');
        tableContainer.style.display = 'none';
        detailsContainer.style.display = 'block';

        detailsContainer.innerHTML = `
            <button id="backButton">Back</button>
            <h2>${person.name}</h2>
            <img src="${avatarUrl}" alt="${person.name}" class="avatar">
            <p><strong>LinkedIn:</strong> <a href="${person.linkedin_url}" target="_blank">${person.linkedin_url}</a></p>
            <p><strong>Email:</strong> <span id="email">${person.email ? person.email : 'N/A'}</span> <button id="checkAgainButton">Check Again with Prospeo</button></p>
            <p><strong>Title:</strong> ${person.title ? person.title : 'N/A'}</p>
            <p><strong>Location:</strong> ${person.city}, ${person.state}, ${person.country}</p>
            <p><strong>Twitter:</strong> ${person.twitter_url ? `<a href="${person.twitter_url}" target="_blank">${person.twitter_url}</a>` : 'N/A'}</p>
            <p><strong>GitHub:</strong> ${person.github_url ? `<a href="${person.github_url}" target="_blank">${person.github_url}</a>` : 'N/A'}</p>
            <p><strong>Facebook:</strong> ${person.facebook_url ? `<a href="${person.facebook_url}" target="_blank">${person.facebook_url}</a>` : 'N/A'}</p>
            ${person.employment_history.map(job => `
                <p><strong>${job.title}</strong> at ${job.organization_name} (${job.start_date} - ${job.end_date || 'Present'})</p>
            `).join('')}
        `;

        document.getElementById('backButton').addEventListener('click', function() {
            detailsContainer.style.display = 'none';
            tableContainer.style.display = 'block';
        });

        const checkAgainButton = document.getElementById('checkAgainButton');
        if (checkAgainButton) {
            checkAgainButton.addEventListener('click', function() {
                checkWithProspeo(person.linkedin_url, avatarUrl, checkAgainButton);
            });
        }
    }

    function checkWithProspeo(profileUrl, avatarUrl, button) {
        const apiUrl = 'http://localhost:3000/prospeo';
        button.disabled = true;

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: profileUrl })
        })
        .then(response => response.json())
        .then(data => {
            const emailElement = document.getElementById('email');
            if (data.response && data.response.email && data.response.email.email) {
                emailElement.textContent = data.response.email.email;
            } else {
                emailElement.textContent = 'No email found';
            }
        })
        .catch(error => {
            console.error('Error fetching email from Prospeo:', error);
            alert('Error fetching email');
        });
    }
});