
// Define a function to check for email input fields and modify them
function modifyEmailInputs() {
    observer.disconnect();

    // Find all email input fields
    const emailFields = document.querySelectorAll('input[type="email"], [aria-label="email"]');

    emailFields.forEach((emailField: Element) => {
        // Assert the type of emailField to HTMLInputElement
        const inputField = emailField as HTMLInputElement;

        if (!inputField.parentNode || inputField.parentNode.querySelector('img')) {
            return; // Skip this input field if it already has the modifications
        }

        // Create a container to hold the email input and the image
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // Create the image element
        const img = document.createElement('img');
        img.src = chrome.runtime.getURL('static/logo192.png');
        img.style.position = 'absolute';
        img.style.right = '5px'; 
        img.style.top = '50%';
        img.style.transform = 'translateY(-50%)';
        img.style.cursor = 'pointer';
        img.style.width = '20px'; 
        img.style.height = '20px';

        // Modify the click event listener for the image
        img.addEventListener('click', () => {
            // Send a message to the background script to generate an email
            chrome.runtime.sendMessage({ action: 'generateEmail' }, response => {
                if (response && response.email) {
                    inputField.value = response.email;
                }
            });
        });

        // Wrap the email input field with the container
        if (inputField.parentNode) {
            inputField.parentNode.insertBefore(container, inputField);
        }
        container.appendChild(inputField);
        container.appendChild(img);
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    modifyEmailInputs();
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to modify email input fields in case they are already present
modifyEmailInputs();

export {};
