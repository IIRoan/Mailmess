// Helper function to generate a random alphanumeric string
const generateRandomString = (length: number) => {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length),
    );
  }
  return text;
};

// Function to generate an email
function generateEmail() {
  return new Promise((resolve, reject) => {
    const storedSuffix = localStorage.getItem("emailSuffix");
    const isRandomStringEnabled =
      localStorage.getItem("isRandomStringEnabled") === "true";
    if (storedSuffix) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
          const parsedUrl = new URL(tabs[0].url);
          let hostname = parsedUrl.hostname;

          // Attempt to extract the main part of the domain
          const domainParts = hostname.split(".");
          let mainPart = domainParts.slice(-2, -1)[0]; // This attempts to get the second last part of the domain

          // This simple approach has limitations and may not work correctly for all domain structures
          const domain = mainPart;
          const randomSuffix = isRandomStringEnabled
            ? `-${generateRandomString(5)}`
            : "";
          const email = `${domain}${randomSuffix}${storedSuffix}`;
          resolve(email);
        } else {
          reject(new Error("Failed to get the active tab's hostname"));
        }
      });
    } else {
      reject(new Error("No email suffix stored"));
    }
  });
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "generateEmail") {
    generateEmail()
      .then((generatedEmail) => {
        // Send the generated email back to the content script
        sendResponse({ email: generatedEmail });
      })
      .catch((error) => {
        console.error("Error generating email:", error);
        // Send an error response back to the content script
        sendResponse({ error: "Failed to generate email" });
      });
    return true; // Indicate that the response will be sent asynchronously
  }
});
// Add an empty export statement to mark the file as a module
export {};
