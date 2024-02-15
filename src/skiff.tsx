import React, { useState, useEffect, useRef } from 'react';
import './styles.css';
import { Button } from '@skiff-org/skiff-ui';
import { InputField } from '@skiff-org/skiff-ui';
import { IconButton, Icon, Size } from '@skiff-org/skiff-ui';

function Skiff() {

    const [suffix, setSuffix] = useState('');
    const [fullEmail, setFullEmail] = useState('');

    // Retrieve the email suffix from local storage on component mount
    useEffect(() => {
        const storedSuffix = localStorage.getItem('emailSuffix');
        if (storedSuffix) {
            setSuffix(storedSuffix);
            // Generate the full email immediately after retrieving the suffix
            const domain = window.location.hostname;
            setFullEmail(`${domain}${storedSuffix}`);
        }
    }, []);

    // Function to handle changes in the suffix input field
    const handleSuffixChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSuffix(event.target.value);
    };

    // Function to save the email when the button is clicked
    const saveEmail = () => {
        // Extract the domain part from the email input
        const domainPartRegex = /@([^.]+)\.(.*)/;
        const matches = suffix.match(domainPartRegex);
        let domainAndSubdomain = '';
        if (matches && matches.length >= 3) {
            domainAndSubdomain = `@${matches[1]}.${matches[2]}`;
        }

        // Store the domain and subdomain part in local storage
        localStorage.setItem('emailSuffix', domainAndSubdomain);

        // Update the full email state with the current domain and the stored domain and subdomain part
        const fullEmail = `${window.location.hostname}${domainAndSubdomain}`;
        setFullEmail(fullEmail);
    };


    const emailInputRef = useRef(null);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(fullEmail);
    };


    return (
        <>
            <div className="App">
                <header className="mainbody">
                    <h1>MailMasker</h1>

                    <div className="input-container">
                    <InputField
                        icon={Icon.Envelope}
                        placeholder='Enter email suffix'
                        value={suffix}
                        onChange={handleSuffixChange}
                    />
                    <IconButton icon={Icon.Save} size={Size.SMALL} onClick={saveEmail} />

                    </div>

                    <div className="input-container">
                    <InputField
                        icon={Icon.Envelope}
                        placeholder='Generated email'
                        value={fullEmail}
                        readOnly
                        ref={emailInputRef}
                    />
                    <IconButton icon={Icon.Copy} size={Size.SMALL} onClick={copyToClipboard} />
                    </div>
                </header>
            </div>
        </>
    );
}

export default Skiff;
