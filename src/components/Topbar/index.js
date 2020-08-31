import React from 'react';

import { AppBar, Toolbar, Typography } from '@material-ui/core';

import logo from '~/assets/image/logo.png';

import useStyles from './style';

function Topbar() {
  const classes = useStyles();

  return (
    <AppBar className={classes.root} position="sticky">
      <Toolbar className={classes.toolbar}>
        <div className={classes.logoWrapper}>
          <img src={logo} alt="logomarca" height={30} />
        </div>

        <Typography className={classes.title} variant="h6" align="center">
          Preços e Prazos - Frete Correios
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;
