// Helper function to generate a random alphanumeric string
const generateRandomString = (length: number) => {
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }
    return text;
};

// Function to generate an email
function generateEmail() {
    const storedSuffix = localStorage.getItem('emailSuffix');
    const isRandomStringEnabled = localStorage.getItem('isRandomStringEnabled') === 'true';
    if (storedSuffix) {
        const domain = window.location.hostname;
        const randomSuffix = isRandomStringEnabled ? `-${generateRandomString(5)}` : '';
        return `${domain}${randomSuffix}${storedSuffix}`;
    }
    return '';
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received");
    if (request.action === 'generateEmail') {
        try {
            // Call your email generator function
            const generatedEmail = generateEmail();
            // Send the generated email back to the content script
            sendResponse({ email: generatedEmail });
        } catch (error) {
            console.error("Error generating email:", error);
            // Send an error response back to the content script
            sendResponse({ error: "Failed to generate email" });
        }
        return true;
    }
});
// Add an empty export statement to mark the file as a module
export {};