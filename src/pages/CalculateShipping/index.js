import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Typography,
  useTheme,
  TextField,
  Box,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Swal from 'sweetalert2';

import undrawHappyAnnouncement from '~/assets/image/undraw_happy_announcement_ac67.svg';
import {
  setCalculateShipping,
  cleanCalculateShipping,
} from '~/store/actions/calculateShipping';
import { cepMask } from '~/utils/mask.utils';

import { CalculationDialog, OrderTab, PrintedTab } from './components';
import useStyles from './style';

function CalculateShipping() {
  const calculateShipping = useSelector((state) => state.calculateShipping);
  const historyCalculateShipping = useSelector(
    (state) => state.historyCalculateShipping
  );

  const classes = useStyles();
  const dispatch = useDispatch();
  const formRef = useRef(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const [tabs, setTabs] = useState(0);
  const [tabType, setTabType] = useState('order');
  const [zipsCodes, setZipsCodes] = useState({});
  const [zipsCodesError, setZipsCodesError] = useState({});
  const [resultApi, setResultApi] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [openCalculationDialog, setOpenCalculationDialog] = useState(false);

  const TabPanel = useCallback(({ children, value, index }) => {
    return (
      <Typography component="div" id={index} hidden={value !== index}>
        {value === index && children}
      </Typography>
    );
  }, []);

  useEffect(() => {
    setZipsCodes({ ...calculateShipping.zipsCodes });
  }, [calculateShipping]);

  useEffect(() => {
    const type = tabs === 0 ? 'order' : 'printed';

    setTabType(type);
  }, [tabs]);

  useEffect(() => {
    if (resultApi) {
      setOpenCalculationDialog(true);
    }
  }, [resultApi]);

  function applyCepMask(event) {
    event.target.value = cepMask(event.target.value);

    setZipsCodesError({});

    setZipsCodes({ ...zipsCodes, [event.target.name]: event.target.value });
  }

  function handleChangeTabPanel(event, tab) {
    setTabs(tab);
  }

  function saveCalculateShippingInRedux() {
    const calculateData = calculateShipping;
    const formData = formRef.current.getData();

    const newData = { ...calculateData, zipsCodes, [tabType]: { ...formData } };

    dispatch(setCalculateShipping(newData));
    setSuccessMessage(
      `Dados de ${tabs === 0 ? 'Encomendas' : 'Impressos'} salvos com sucesso.`
    );
  }

  function removeCalculateShippingInRedux() {
    dispatch(cleanCalculateShipping(tabType));

    setSuccessMessage(
      `Dados de ${
        tabs === 0 ? 'Encomendas' : 'Impressos'
      } apagados com sucesso.`
    );
  }

  function closeCalculationDialog() {
    setResultApi(null);
    setOpenCalculationDialog(false);
    isShowCongratsAlert();
  }

  function isShowCongratsAlert() {
    const { id } = historyCalculateShipping;

    if (id === 10 || id === 100 || id === 1000) {
      const texts = {
        10: {
          message: `<span>Você fez ${id} cotações!</span> <span>Que tal divulgar nosso site?</span>`,
          button: 'Parabens!',
        },
        100: {
          message: `<span>Você fez ${id} cotações!</span> <span>Que tal divulgar nosso site?</span>`,
          button: 'Muito Bem!',
        },
        1000: {
          message: `<span>Você fez ${id} cotações!</span> <span>Que tal divulgar nosso site?</span>`,
          button: 'Muito Bem!',
        },
      };

      Swal.fire({
        width: 400,
        imageUrl: undrawHappyAnnouncement,
        imageHeight: 85,
        imageAlt: 'undrawHappyAnnouncement',
        html: texts[id].message,
        confirmButtonText: texts[id].button,
        confirmButtonColor: '#004169',
        customClass: {
          container: classes.congratsAlertContainer,
          content: classes.congratsAlertContent,
        },
      });
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <CardContent>
          <Grid container spacing={3} justify="flex-end">
            <Grid item xs={4} sm={4}>
              <Button
                variant="contained"
                fullWidth
                disableElevation
                onClick={() => navigate('/historico')}
              >
                Histórico
              </Button>
            </Grid>

            <Grid item xs={4} sm={4}>
              <Button
                className={classes.saveButton}
                variant="contained"
                fullWidth
                disableElevation
                onClick={saveCalculateShippingInRedux}
              >
                Salvar
              </Button>
            </Grid>

            <Grid item xs={4} sm={4}>
              <Button
                className={classes.clearButton}
                variant="contained"
                fullWidth
                disableElevation
                onClick={removeCalculateShippingInRedux}
              >
                Limpar
              </Button>
            </Grid>

            {successMessage && (
              <Grid item xs={12}>
                <Alert
                  severity="success"
                  onClose={() => setSuccessMessage(null)}
                >
                  {successMessage}
                </Alert>
              </Grid>
            )}
          </Grid>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  type="tel"
                  label="CEP Origem"
                  name="origin"
                  value={zipsCodes.origin || ''}
                  error={!!zipsCodesError.origin}
                  helperText={zipsCodesError.origin}
                  fullWidth
                  onChange={applyCepMask}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="tel"
                  label="CEP Destino"
                  name="destination"
                  value={zipsCodes.destination || ''}
                  error={!!zipsCodesError.destination}
                  helperText={zipsCodesError.destination}
                  fullWidth
                  onChange={applyCepMask}
                />
              </Grid>

              <Grid item xs={12}>
                <Tabs value={tabs} centered onChange={handleChangeTabPanel}>
                  <Tab label="Encomendas" />
                  <Tab label="Impressos" />
                </Tabs>
              </Grid>

              <Grid item xs={12}>
                <TabPanel value={tabs} index={0} dir={theme.direction}>
                  <OrderTab
                    calculateShipping={calculateShipping}
                    formRef={formRef}
                    zipsCodes={zipsCodes}
                    setZipsCodesError={setZipsCodesError}
                    setResultApi={setResultApi}
                  />
                </TabPanel>

                <TabPanel value={tabs} index={1} dir={theme.direction}>
                  <PrintedTab
                    calculateShipping={calculateShipping}
                    formRef={formRef}
                    zipsCodes={zipsCodes}
                    setZipsCodesError={setZipsCodesError}
                    setResultApi={setResultApi}
                  />
                </TabPanel>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {openCalculationDialog && (
        <CalculationDialog
          open={openCalculationDialog}
          close={closeCalculationDialog}
          apiData={resultApi}
          objectType={tabs}
        />
      )}
    </>
  );
}

export default CalculateShipping;
