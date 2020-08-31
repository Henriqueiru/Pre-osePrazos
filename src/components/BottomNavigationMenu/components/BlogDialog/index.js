import React, { forwardRef } from 'react';
import Iframe from 'react-iframe';

import {
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Slide,
  Box,
} from '@material-ui/core';

import useStyles from './style';

function BlogDialog({ blog, close, ...rest }) {
  const classes = useStyles();

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  });

  return (
    <Dialog
      TransitionComponent={Transition}
      fullScreen
      {...rest}
      onClose={() => close()}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            Blog Preços e Prazos
          </Typography>

          <Button color="inherit" autoFocus onClick={() => close()}>
            Retornar
          </Button>
        </Toolbar>
      </AppBar>

      <Box className={classes.iframeContainer}>
        <Iframe
          className={classes.iframeRoot}
          url={blog.link}
          display="initial"
          position="relative"
        />
      </Box>
    </Dialog>
  );
}

export default BlogDialog;
