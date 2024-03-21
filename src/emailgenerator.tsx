import React, { useState, useEffect, useRef } from 'react';
import { InputField, Toggle, IconButton, Icon, Size } from '@skiff-org/skiff-ui';
import './styles.css';

function EmailGenerator() {
    // State to track if the random string toggle is on
    const [isRandomStringEnabled, setIsRandomStringEnabled] = useState(false);
    // State to hold the email suffix entered by the user
    const [emailSuffix, setEmailSuffix] = useState('');
    // State to hold the complete generated email
    const [generatedEmail, setGeneratedEmail] = useState('');
    // State to hold if generated email is copied
    const [isCopied, setIsCopied] = useState(false);
    // State to change copy icon
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [icon, setIcon] = useState(Icon.Copy);

    // Effect hook to change icon on copy generated email
    useEffect(() => {
        if (animationTrigger) {
            setIcon(Icon.Check);
            setTimeout(() => {
                setIcon(Icon.Copy);
                setAnimationTrigger(false); // Reset the trigger for the next click
                setIsCopied(false) // Reset the IsCopied for the next click
            }, 1000); // Reset after 1 second
        }
    }, [animationTrigger]);

    // Effect hook to load previously stored email suffix and generate the email
    useEffect(() => {
        const storedSuffix = localStorage.getItem('emailSuffix');
        if (storedSuffix) {
            setEmailSuffix(storedSuffix);
            const domain = window.location.hostname;
            const randomSuffix = isRandomStringEnabled ? `-${generateRandomString(5)}` : '';
            setGeneratedEmail(`${domain}${randomSuffix}${storedSuffix}`);
        }
    }, [isRandomStringEnabled]);

    // Handler for changes in the email suffix input field
    const handleEmailSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailSuffix(event.target.value);
    };

    // Function to save the email when the button is clicked
    const saveGeneratedEmail = () => {
        const domainPartRegex = /@([^.]+)\.(.*)/;
        const matches = emailSuffix.match(domainPartRegex);
        let domainAndSubdomain = '';
        if (matches && matches.length >= 3) {
            domainAndSubdomain = `@${matches[1]}.${matches[2]}`;
        }

        // Validate the email before saving
        const fullEmail = `${window.location.hostname}${domainAndSubdomain}`;
        if (validateEmail(fullEmail)) {
            // Store the domain and subdomain part in local storage
            localStorage.setItem('emailSuffix', domainAndSubdomain);

            // Update the full email state with the current domain and the stored domain and subdomain part
            setGeneratedEmail(fullEmail);
        } else {
            // Optionally, notify the user that the email is invalid
            alert('The email is not valid. Please enter a valid email suffix.');
        }
    };

    // Helper function to validate the email
    const validateEmail = (email: string) => {
        // Simple regex for email validation
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    };

    // Helper function to generate a random alphanumeric string
    const generateRandomString = (length: number) => {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return text;
    };

    const emailInputRef = useRef(null);

    // Function to copy the generated email to clipboard
    const copyGeneratedEmailToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedEmail);
            setAnimationTrigger(true); // Trigger the animation
            setIsCopied(true);
        } catch (error) {
            console.error('Error copying email to clipboard:', error);
        }
    };


    return (
        <>
            <header className="mainbody">
                <h1>MailMess</h1>

                <div className="input-container">
                    <InputField
                        icon={Icon.Envelope}
                        placeholder='Enter email suffix'
                        value={emailSuffix}
                        onChange={handleEmailSuffixChange}
                    />
                    <IconButton icon={Icon.Save} size={Size.SMALL} onClick={saveGeneratedEmail} />
                </div>

                <div className="input-container">
                    <InputField
                        icon={Icon.Envelope}
                        placeholder='Generated email'
                        value={generatedEmail}
                        readOnly
                        ref={emailInputRef}
                    />
                    <IconButton
                        icon={icon}
                        size={Size.SMALL}
                        onClick={copyGeneratedEmailToClipboard}
                        className={isCopied ? 'copied' : ''}
                    />

                </div>

                <div className='toggle'>
                    <Toggle
                        checked={isRandomStringEnabled}
                        onChange={() => setIsRandomStringEnabled(!isRandomStringEnabled)}
                    />
                    <span>Add  5 random letters/numbers after domain</span>
                </div>
            </header>
        </>
    );
}

export default EmailGenerator;
