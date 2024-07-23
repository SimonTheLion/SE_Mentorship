const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      revision: '2024-05-15',
      Authorization: 'Klaviyo-API-Key redacted'
    }
  };
  
  const fetchProfiles = async (url, totalDaysDifference = 0, validProfilesCount = 0) => {
    try {
      const response = await fetch(url, options);
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
  
      // Check if there's a next page
      if (data.links && data.links.next) {
        // Fetch the next page
        return fetchProfiles(data.links.next, totalDaysDifference, validProfilesCount);
      } else {
        // No more pages, calculate and display the average
        const averageDaysDifference = Math.floor(validProfilesCount > 0 ? (totalDaysDifference / validProfilesCount).toFixed(2) : "N/A");
        const finder = document.getElementById('listNames');
        finder.innerHTML = '';
        const averageItem = document.createElement('li');
        averageItem.textContent = `Average Days To First Order: ${averageDaysDifference}`;
        finder.appendChild(averageItem);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };
  
  // Initial fetch call
  fetchProfiles('https://a.klaviyo.com/api/profiles/?fields[profile]=created,properties.First Purchase Date');
  