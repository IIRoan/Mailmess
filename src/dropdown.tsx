import React, { useState, useEffect, useRef } from "react";
import {
  InputField,
  IconButton,
  Icon,
  Size,
  Dropdown,
  DropdownItem,
  Button,
  Type,
  Avatar,
  IconText,
  Divider,
  ThemeMode,
} from "@skiff-org/skiff-ui";
import "./styles.css";

function EmailGenerator() {
  // State to track the current tab's domain
  const [domain, setDomain] = useState("");

  // Initialize emailSuffix from localStorage
  const [emailSuffix, setEmailSuffix] = useState(() => {
    return localStorage.getItem("emailSuffix") || "";
  });

  // State to hold the complete generated email
  const [generatedEmail, setGeneratedEmail] = useState("");

  // State to hold if generated email is copied
  const [isCopied, setIsCopied] = useState(false);

  // State to change copy icon
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [icon, setIcon] = useState(Icon.Copy);

  // State to hold the error message underneath input
  const [errorMessage, setErrorMessage] = useState("");

  // State to hold the random string length
  const [randomStringLength, setRandomStringLength] = useState(() => {
    const savedLength = localStorage.getItem("randomStringLength");
    return savedLength ? Number(savedLength) : 0;
  });

  // State to hold the favicon URL
  const [faviconUrl, setFaviconUrl] = useState("");

  // Reference for the dropdown button
  const buttonRef = useRef(null);

  // State to control the visibility of the dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  // Options for the random string length
  const randomStringOptions = [
    {
      value: 0,
      label: "No random characters",
      icon: Icon.RadioEmpty,
    },
    {
      value: 3,
      label: "Add 3 random characters",
      icon: Icon.Lock,
    },
    {
      value: 5,
      label: "Add 5 random characters",
      icon: Icon.Lock,
    },
    {
      value: 7,
      label: "Add 7 random characters",
      icon: Icon.Lock,
    },
  ];

  // Helper function to generate a random alphanumeric string
  const generateRandomString = (length: number) => {
    const possibleChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possibleChars.charAt(
        Math.floor(Math.random() * possibleChars.length)
      );
    }
    return text;
  };

  // Handler for changes in the email suffix input field
  const handleEmailSuffixChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmailSuffix(event.target.value);
    setErrorMessage(""); // Clear error message on input change
  };

  // Helper function to validate the email
  const validateEmail = (email: string) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  // Effect hook to update local storage when the randomStringLength changes
  useEffect(() => {
    localStorage.setItem("randomStringLength", randomStringLength.toString());
  }, [randomStringLength]);

  // Effect hook to change icon on copy generated email
  useEffect(() => {
    if (animationTrigger) {
      setIcon(Icon.Check);
      setTimeout(() => {
        setIcon(Icon.Copy);
        setAnimationTrigger(false); // Reset the trigger for the next click
        setIsCopied(false); // Reset the IsCopied for the next click
      }, 1000); // Reset after 1 second
    }
  }, [animationTrigger]);

  // Function to get the hostname and favicon of the currently active tab
  const getActiveTabHostname = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        const parsedUrl = new URL(tabs[0].url);
        let hostname = parsedUrl.hostname;

        // Extract the main part of the domain
        const domainParts = hostname.split(".");
        let mainPart = domainParts.slice(-2, -1)[0];

        setDomain(mainPart);

        // Get the favicon URL
        if (tabs[0].favIconUrl) {
          setFaviconUrl(tabs[0].favIconUrl);
        }
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
    let domainAndSubdomain = "";
    if (matches && matches.length >= 3) {
      domainAndSubdomain = `@${matches[1]}.${matches[2]}`;
    }

    const randomSuffix =
      randomStringLength > 0
        ? `-${generateRandomString(randomStringLength)}`
        : "";

    const fullEmail = `${domain}${randomSuffix}${domainAndSubdomain}`;
    if (validateEmail(fullEmail)) {
      localStorage.setItem("emailSuffix", emailSuffix); // Save the actual emailSuffix
      setGeneratedEmail(fullEmail);
    } else {
      setErrorMessage("Invalid email suffix");
    }
  };

  // Function to copy the generated email to clipboard
  const copyGeneratedEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      setAnimationTrigger(true); // Trigger the animation
      setIsCopied(true);
    } catch (error) {
      console.error("Error copying email to clipboard:", error);
    }
  };

  // Effect hook to update generated email whenever dependencies change
  useEffect(() => {
    const randomSuffix =
      randomStringLength > 0
        ? `-${generateRandomString(randomStringLength)}`
        : "";
    const domainPartRegex = /@([^.]+)\.(.*)/;
    const matches = emailSuffix.match(domainPartRegex);
    let domainAndSubdomain = "";
    if (matches && matches.length >= 3) {
      domainAndSubdomain = `@${matches[1]}.${matches[2]}`;
    }

    const fullEmail = `${domain}${randomSuffix}${domainAndSubdomain}`;
    setGeneratedEmail(fullEmail);
  }, [domain, randomStringLength, emailSuffix]);

  // Get the label for the current random string length
  const currentOption = randomStringOptions.find(
    (option) => option.value === randomStringLength
  );

  return (
    <>
      <header className="mainbody">
        <h1 className="title">MailMess</h1>
        {faviconUrl && (
          <img
            src={faviconUrl}
            alt="favicon"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              width: "16px",
              height: "16px",
            }}
          />
        )}
        <div className="input-container">
          <InputField
            icon={Icon.Envelope}
            placeholder="Enter email suffix (e.g., @example.com)"
            value={emailSuffix}
            onChange={handleEmailSuffixChange}
          />
          <IconButton
            icon={Icon.Save}
            size={Size.SMALL}
            onClick={saveGeneratedEmail}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="input-container">
          <InputField
            icon={Icon.Envelope}
            placeholder="Generated email"
            value={generatedEmail}
            readOnly
          />
          <IconButton
            icon={icon}
            size={Size.SMALL}
            onClick={copyGeneratedEmailToClipboard}
            className={isCopied ? "copied" : ""}
          />
        </div>

        <div className="dropdown-container">
          <Button
            ref={buttonRef}
            type={Type.SECONDARY}
            onClick={() => setShowDropdown(!showDropdown)}
            fullWidth
          >
            {currentOption
              ? currentOption.label
              : "Select random character option"}
          </Button>
          <Dropdown
            portal
            buttonRef={buttonRef}
            setShowDropdown={setShowDropdown}
            showDropdown={showDropdown}
            width={350}
            gapFromAnchor={4}
          >
            {randomStringOptions.map((option, index) => (
              <React.Fragment key={option.value}>
                <DropdownItem
                  label={
                    <IconText
                      startIcon={option.icon}
                      label={option.label}
                      color="white"
                    />
                  }
                  onClick={() => {
                    setRandomStringLength(option.value);
                    setShowDropdown(false);
                  }}
                  active={randomStringLength === option.value}
                />
                {index < randomStringOptions.length - 1 && (
                  <Divider forceTheme={ThemeMode.DARK} />
                )}
              </React.Fragment>
            ))}
          </Dropdown>
        </div>
      </header>
    </>
  );
}

export default EmailGenerator;
