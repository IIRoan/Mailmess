import React from 'react';
import { IconButton, Icon, Size } from '@skiff-org/skiff-ui';

const Footer = () => {

    const handleClick = (url: string) => {
        window.open(url, '_blank');
      };

    return (
        <footer className="footer">
        <IconButton icon={Icon.CodeBlock} size={Size.SMALL} onClick={() => handleClick("https://github.com")} />
        <IconButton icon={Icon.Bug} size={Size.SMALL} onClick={() => handleClick("https://github.com")} />
        <IconButton icon={Icon.Settings} size={Size.SMALL} onClick={() => handleClick("#")} />
        </footer>
        );
    };
    

    export default Footer;