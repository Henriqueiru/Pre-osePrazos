import React, { forwardRef } from 'react';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  IconButton,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';

import AdPlaceholder from '~/assets/image/ad-placeholder-320x100.png';

import useStyles from './style';

function AddressDialog({ close, apiData, ...rest }) {
  const classes = useStyles();

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Dialog
      className={classes.dialog}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      keepMounted
      {...rest}
      onClose={() => close()}
    >
      <DialogTitle className={classes.dialogTitle} disableTypography>
        <Typography variant="h6" align="center">
          precoseprazos.com.br
        </Typography>

        <IconButton className={classes.closeButton} onClick={() => close()}>
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <Box mb={3} display="flex" justifyContent="center">
          <img
            className={classes.adPlaceholderImage}
            src={AdPlaceholder}
            alt="ad-placeholder"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>CEP</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">{apiData.zipCode}</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Logradouro</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">
              {apiData.Logradouro && apiData.Logradouro}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Complemento</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">
              {apiData.Complemento && apiData.Complemento}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Bairro</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">
              {apiData.Bairro && apiData.Bairro}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Localidade</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">
              {apiData.Cidade && apiData.Cidade}
            </Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>UF</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography align="left">
              {apiData.Estado && apiData.Estado}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default AddressDialog;
