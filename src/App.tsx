import EmailGenerator from "./emailgenerator";
import Footer from "./footer";
import { AppThemeProvider } from "@skiff-org/skiff-ui";

function App() {
  return (
    <AppThemeProvider>
      <EmailGenerator />
      <Footer />
    </AppThemeProvider>
  );
}
export default App;
