document.addEventListener('DOMContentLoaded', () => {
    // Find all email input fields
    const emailFields = document.querySelectorAll('input[type="email"]');
    console.log("Content script loaded");
    console.log("email fields: ", emailFields);

    emailFields.forEach((emailField: Element) => {
        // Assert the type of emailField to HTMLInputElement
        const inputField = emailField as HTMLInputElement;

        // Create a container to hold the email input and the image
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        // Create the image element
        const img = document.createElement('img');
        img.src = 'logo192.png';
        img.style.position = 'absolute';
        img.style.right = '0';
        img.style.top = '0';
        img.style.cursor = 'pointer';

        // Add click event listener to the image
        img.addEventListener('click', () => {
            inputField.value = 'example@example.com';
        });

        // Wrap the email input field with the container
        if (inputField.parentNode) {
            inputField.parentNode.insertBefore(container, inputField);
        }
        container.appendChild(inputField);
        container.appendChild(img);
    });
});
export {};
