import React, { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { Topbar, BottomNavigationMenu } from '~/components';

import { WelcomeAlertDialog } from './components';

function Main() {
  const [welcomeAlertDialog, setWelcomeDialog] = useState(false);

  useMemo(() => {
    const alertStatus = localStorage.getItem('welcomeAlert');

    if (!alertStatus) {
      localStorage.setItem('welcomeAlert', true);

      setWelcomeDialog(true);
    }
  }, []);

  return (
    <>
      <Topbar />

      <main>
        <Outlet />
      </main>

      <BottomNavigationMenu />

      {welcomeAlertDialog && (
        <WelcomeAlertDialog
          open={welcomeAlertDialog}
          close={setWelcomeDialog}
        />
      )}
    </>
  );
}

export default Main;
