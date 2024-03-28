import Dropdown from "./dropdown";
import Footer from "./footer";
import { AppThemeProvider } from "@skiff-org/skiff-ui";

function App() {
  return (
    <AppThemeProvider>
      <Dropdown />
      <Footer />
    </AppThemeProvider>
  );
}
export default App;
