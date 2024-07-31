const fetchProfiles = async (url, apiKey, totalDaysDifference = 0, validProfilesCount = 0) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            revision: '2024-05-15',
            Authorization: `Klaviyo-API-Key ${apiKey}`
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Invalid API Key');
        }

        const data = await response.json();
        const listResponse = data.data;
        listResponse.forEach(profile => {
            const createdDate = new Date(profile.attributes.created);
            const firstPurchaseDate = new Date(profile.attributes.properties['First Purchase Date']);

            if (!isNaN(createdDate) && !isNaN(firstPurchaseDate)) {
                const timeDifference = firstPurchaseDate - createdDate;
                const daysDifference = timeDifference / (1000 * 3600 * 24); // convert milliseconds to days
                totalDaysDifference += daysDifference;
                validProfilesCount += 1;
            }
        });

        if (data.links && data.links.next) {
            return fetchProfiles(data.links.next, apiKey, totalDaysDifference, validProfilesCount);
        } else {
            const averageDaysDifference = Math.floor(validProfilesCount > 0 ? (totalDaysDifference / validProfilesCount).toFixed(2) : "N/A");
            const finder = document.getElementById('listNames');
            finder.innerHTML = '';
            const averageItem = document.createElement('li');
            averageItem.textContent = `Average Days To First Order: ${averageDaysDifference}`;
            finder.appendChild(averageItem);
        }
    } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error; // Rethrow error to be caught in managePrivateKey.js
    }
};

// Make sure fetchProfiles is accessible globally
window.fetchProfiles = fetchProfiles;

  