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

        // Store the domain and subdomain part in local storage
        localStorage.setItem('emailSuffix', domainAndSubdomain);

        // Update the full email state with the current domain and the stored domain and subdomain part
        const fullEmail = `${window.location.hostname}${domainAndSubdomain}`;
        setGeneratedEmail(fullEmail);
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
    const copyGeneratedEmailToClipboard = () => {
        navigator.clipboard.writeText(generatedEmail);
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
                    <IconButton icon={Icon.Copy} size={Size.SMALL} onClick={copyGeneratedEmailToClipboard} />
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