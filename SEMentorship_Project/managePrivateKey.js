document.addEventListener('DOMContentLoaded', function () {
    const inputForm = document.getElementById('inputPrivateKey');
    const inputKey = document.getElementById('inputKey');
    const savedValueSpan = document.getElementById('savedValue');

    // Clear the saved API key from local storage when the extension is loaded
    localStorage.removeItem('privateKey');

    inputForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const inputValue = inputKey.value.trim(); // Trim whitespace
        if (inputValue) {
            localStorage.setItem('privateKey', inputValue);
            fetchProfilesWithSavedKey(inputValue);
        } else {
            savedValueSpan.textContent = 'API Key cannot be empty';
            savedValueSpan.className = 'error'; // Apply error class
        }
    });

    function fetchProfilesWithSavedKey(apiKey) {
        if (typeof fetchProfiles === 'function') {
            fetchProfiles('https://a.klaviyo.com/api/profiles/?fields[profile]=created,properties.First Purchase Date', apiKey)
            .then(() => {
                inputForm.style.display = 'none';
                savedValueSpan.textContent = 'API Key is valid.';
                savedValueSpan.className = 'success'; // Apply success class
            })
            .catch(error => {
                savedValueSpan.textContent = 'API Key not recognized';
                savedValueSpan.className = 'error'; // Apply error class
                console.error('Error:', error);
            });
        } else {
            console.error('fetchProfiles function is not defined');
        }
    }
});

