import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { PersistGate } from 'redux-persist/es/integration/react';

import MainRoutes from '~/routes';
import { store, persistor } from '~/store';
import Theme from '~/theme';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <MainRoutes />
          </Router>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
