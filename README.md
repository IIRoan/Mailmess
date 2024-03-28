<div style="display:flex;">
    <img src="https://github.com/IIRoan/Mailmess/blob/main/public/logo192.png?raw=true" alt="Logo" style="width:30%;">
    <img src="https://github.com/IIRoan/Mailmess/blob/main/public/screenshot.png?raw=true" alt="Screenshot" style="width:40%;">
</div>

# MailMess Extension

MailMess is a browser extension that automatically generates email aliases for the website you are currently on. You can use email maskers and relays such as Firefox Relay, Addy.io or SimpleLogin

<a href="https://addons.mozilla.org/en-US/firefox/addon/mailmess/">
  <img src="public/badge.png" alt="Download on addons store"></img>
</a>

## Features

- **Easy**: Quickly generate a new email for each website
- **Customizable**: Choose if you want to add random string to a catch all adress
- **Automatic**: When registering on a website, an icon appears that when clicks fills the email with a generated email using the rules set in the dropdown

## Usage

After installing the extension, you can start using it by:

1. Clicking on the extension icon in your browser toolbar.
2. Entering your email suffix.
3. Optionally, enabling the feature to add a random string to the email address for privacy.
4. Copying the generated email address to your clipboard with a click.

## Development environment

Clone the Repository:

```bash
git clone https://github.com/IIRoan/Mailmess.git
```

Install Dependencies:

```bash
cd Mailmess
npm install
```

Start the Development Server:

```bash
npm start
```

Build to final:

```bash
npm run build
cd dist
web-ext build
```

Use web-ext run inside /dist to try it out

## Contributing

We welcome contributions from the community. If you would like to contribute, please fork the repository, make your changes, and submit a pull request.

## Contact

For any questions or support, please open an issue on GitHub.

Thank you for using MailMess!
