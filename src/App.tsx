import * as React from 'react';
import Skiff from './skiff'
import { AppThemeProvider } from '@skiff-org/skiff-ui';
import Footer from './footer'

function App() {
  return (
    <AppThemeProvider>
      <Skiff />
      <Footer />
    </AppThemeProvider>
  );
}
export default App
