import React, { useState, useEffect } from "react";
import {
  InputField,
  Toggle,
  IconButton,
  Icon,
  Size,
} from "@skiff-org/skiff-ui";
import "./styles.css";

function EmailGenerator() {
    // State to track the current tab's domain
    const [domain, setDomain] = useState('');
    // State to track if the random string toggle is on
    const [isRandomStringEnabled, setIsRandomStringEnabled] = useState(() => {
        const savedToggleState = localStorage.getItem('isRandomStringEnabled');
        return savedToggleState ? JSON.parse(savedToggleState) : false;
    });
    // State to hold the email suffix entered by the user
    const [emailSuffix, setEmailSuffix] = useState('');
    // State to hold the complete generated email
    const [generatedEmail, setGeneratedEmail] = useState('');
    // State to hold if generated email is copied
    const [isCopied, setIsCopied] = useState(false);
    // State to change copy icon
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const [icon, setIcon] = useState(Icon.Copy);
    // State to hold the error message underneath input
    const [errorMessage, setErrorMessage] = useState("");

    // Helper function to generate a random alphanumeric string
    const generateRandomString = (length: number) => {
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
            text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return text;
    };

    // Handler for changes in the email suffix input field
    const handleEmailSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmailSuffix(event.target.value);
        setErrorMessage(""); // Clear error message on input change
    };

    // Helper function to validate the email
    const validateEmail = (email: string) => {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    };



    // Effect hook to update local storage when the toggle state changes
    useEffect(() => {
        localStorage.setItem('isRandomStringEnabled', JSON.stringify(isRandomStringEnabled));
    }, [isRandomStringEnabled]);

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
            const randomSuffix = isRandomStringEnabled ? `-${generateRandomString(5)}` : '';
            setGeneratedEmail(`${domain}${randomSuffix}${storedSuffix}`);
        }
    }, [isRandomStringEnabled, domain]);

    // Function to get the hostname of the currently active tab
    const getActiveTabHostname = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0 && tabs[0].url) {
                const parsedUrl = new URL(tabs[0].url);
                let hostname = parsedUrl.hostname;

                // Attempt to extract the main part of the domain
                const domainParts = hostname.split('.');
                let mainPart = domainParts.slice(-2, -1)[0]; // This attempts to get the second last part of the domain

                // This simple approach has limitations and may not work correctly for all domain structures
                setDomain(mainPart);
            }
        });
    };
    // Call getActiveTabHostname when the component mounts
    useEffect(() => {
        getActiveTabHostname();
    }, []);


    // Function to save the email when the button is clicked
    const saveGeneratedEmail = () => {
        const domainPartRegex = /@([^.]+)\.(.*)/;
        const matches = emailSuffix.match(domainPartRegex);
        let domainAndSubdomain = '';
        if (matches && matches.length >= 3) {
            domainAndSubdomain = `@${matches[1]}.${matches[2]}`;
        }

        const fullEmail = `${domain}${domainAndSubdomain}`;
        if (validateEmail(fullEmail)) {
            localStorage.setItem('emailSuffix', domainAndSubdomain);
            setGeneratedEmail(fullEmail);
        } else {
            setErrorMessage("Invalid E-Mail suffix");
        }
    };

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
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="input-container">
                    <InputField
                        icon={Icon.Envelope}
                        placeholder='Generated email'
                        value={generatedEmail}
                        readOnly
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
                    <span>Add 5 random letters/numbers after domain</span>
                </div>
            </header>
        </>
    );
}

export default EmailGenerator;
