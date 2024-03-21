// content-script.ts

// Function to generate a random email
function generateEmail(): string {
 return `user${Math.floor(Math.random() * 1000)}@example.com`;
}

// Function to inject the icon into the TextField
function injectIcon(): void {
 // Wait for the DOM to be fully loaded before injecting the icon
 document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement | null;
    if (emailInput) {
      const icon = document.createElement('img');
      icon.src = 'public/logo192.png'; // Ensure this path is correct
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', () => {
        emailInput.value = generateEmail();
      });
      // Check if parentNode is not null before inserting the icon
      if (emailInput.parentNode) {
        emailInput.parentNode.insertBefore(icon, emailInput);
      }
    }
 });
}

// Call the function to inject the icon
injectIcon();

// Add an empty export statement to make this file a module
export {};
