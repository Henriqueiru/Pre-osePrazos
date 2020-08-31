import React, { useRef, useState, useEffect } from 'react';

import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
} from '@material-ui/core';
import { Form } from '@unform/web';
import { TextField } from 'unform-material-ui';
import * as Yup from 'yup';

import API from '~/services/api';
import { cepMask } from '~/utils/mask.utils';

import { AddressDialog } from './components';
import useStyles from './style';

function SearchZipCode() {
  const classes = useStyles();
  const formRef = useRef(null);

  const [resultApi, setResultApi] = useState(null);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);

  useEffect(() => {
    if (resultApi) {
      setOpenAddressDialog(true);
    }
  }, [resultApi]);

  function applyCepMask(event) {
    event.target.value = cepMask(event.target.value);

    formRef.current.setErrors({});

    return event.target.value;
  }

  function closeAddressDialog() {
    setResultApi(null);
    setOpenAddressDialog(false);
  }

  function handleFormSubmit(formData) {
    validateZipCode(formData);
  }

  async function validateZipCode(data) {
    try {
      const schema = Yup.object().shape({
        zipCode: Yup.string()
          .required('O CEP é obrigatório.')
          .matches(/^(?!d*00).*$/, 'CEP inválido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      getAddressInApi(data.zipCode);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  async function getAddressInApi(zipCode) {
    const response = await API.get(
      `/cep/ObterEndereco?sCep=${zipCode}&StrRetorno=json`
    );

    if (response.data) {
      const { Endereco } = response.data;

      setResultApi({ zipCode, ...Endereco });
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}>Pesquisar CEP</Typography>

          <Form ref={formRef} onSubmit={handleFormSubmit}>
            <Box mt={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    type="tel"
                    label="CEP"
                    name="zipCode"
                    fullWidth
                    onChange={applyCepMask}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    className={classes.searchButton}
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Form>
        </CardContent>
      </Card>

      {openAddressDialog && (
        <AddressDialog
          open={openAddressDialog}
          close={closeAddressDialog}
          apiData={resultApi}
        />
      )}
    </>
  );
}

export default SearchZipCode;
