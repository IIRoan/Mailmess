import { IconButton, Icon, Size } from '@skiff-org/skiff-ui';

const Footer = () => {

    const handleClick = (url: string) => {
        window.open(url, '_blank');
      };

    return (
        <footer className="footer">
        <IconButton icon={Icon.CodeBlock} size={Size.SMALL} onClick={() => handleClick("https://github.com/IIRoan/Mailmess")} />
        <IconButton icon={Icon.Bug} size={Size.SMALL} onClick={() => handleClick("https://github.com/IIRoan/Mailmess/issues")} />
        </footer>
        );
    };
    

    export default Footer;