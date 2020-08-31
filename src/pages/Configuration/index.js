import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  FormGroup,
  Button,
  Switch,
  useMediaQuery,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useTheme } from '@material-ui/styles';
import { Form } from '@unform/web';
import clsx from 'clsx';
import { TextField, Select } from 'unform-material-ui';

import { setSetup } from '~/store/actions/setup';
import { currencyFormatter } from '~/utils/formatter.utils';
import { removeMask, currencyMask } from '~/utils/mask.utils';

import useStyles from './style';

function Configuration() {
  const setup = useSelector((state) => state.setup);

  const classes = useStyles();
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const theme = useTheme();

  const [priceTableType, setPriceTableType] = useState('');
  const [contractType, setContractType] = useState('');
  const [serviceType, setServiceType] = useState({
    sedex1012: false,
    sedexToday: false,
    miniUploads: false,
    largeFormats: false,
  });
  const [successMessage, setSuccessMessage] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const renderListPriceItemsByContractType = useCallback(() => {
    const { generalSetup } = setup;

    const type = contractType || generalSetup.contractType;
    const items = {
      B: <MenuItem value="20">Encomenda 2.0</MenuItem>,
      V: (
        <>
          <MenuItem value="21">Encomenda 2.1</MenuItem>
          <MenuItem value="22">Encomenda 2.2</MenuItem>
          <MenuItem value="23">Encomenda 2.3</MenuItem>
          <MenuItem value="24">Encomenda 2.4</MenuItem>
          <MenuItem value="25">Encomenda 2.5</MenuItem>
          <MenuItem value="26">Encomenda 2.6</MenuItem>
          <MenuItem value="27">Encomenda 2.7</MenuItem>
          <MenuItem value="28">Encomenda 2.8</MenuItem>
          <MenuItem value="29">Encomenda 2.9</MenuItem>
        </>
      ),
      I: (
        <>
          <MenuItem value="51">Encomenda 5.1</MenuItem>
          <MenuItem value="52">Encomenda 5.2</MenuItem>
          <MenuItem value="53">Encomenda 5.3</MenuItem>
          <MenuItem value="54">Encomenda 5.4</MenuItem>
          <MenuItem value="55">Encomenda 5.5</MenuItem>
          <MenuItem value="56">Encomenda 5.6</MenuItem>
          <MenuItem value="57">Encomenda 5.7</MenuItem>
        </>
      ),
      BN: <MenuItem value="bro1">Bronze 1</MenuItem>,
      VN: (
        <>
          <MenuItem value="rat1">Prata 1</MenuItem>
          <MenuItem value="rat2">Prata 2</MenuItem>
          <MenuItem value="our1">Ouro 1</MenuItem>
          <MenuItem value="our2">Ouro 2</MenuItem>
          <MenuItem value="our3">Ouro 3</MenuItem>
          <MenuItem value="our4">Ouro 4</MenuItem>
          <MenuItem value="pla1">Platinum 1</MenuItem>
          <MenuItem value="pla2">Platinum 2</MenuItem>
          <MenuItem value="pla3">Platinum 3</MenuItem>
        </>
      ),
      IN: (
        <>
          <MenuItem value="dia1">Diamante 1</MenuItem>
          <MenuItem value="dia2">Diamante 2</MenuItem>
          <MenuItem value="dia3">Diamante 3</MenuItem>
          <MenuItem value="dia4">Diamante 4</MenuItem>
        </>
      ),
    };

    const { children } = items[type].props;

    if (typeof children === 'string') {
      return items[type];
    }

    return children.map((value) => {
      return value;
    });
  }, [setup, contractType]);

  useEffect(() => {
    const { generalSetup } = setup;
    const { setFieldValue } = formRef.current;

    setPriceTableType(generalSetup.priceTableType);
    setServiceType(generalSetup.serviceType);

    setFieldValue('handlingFee', currencyFormatter(generalSetup.handlingFee));

    if (generalSetup.priceTableType === 'contract') {
      setFieldValue('contractType', generalSetup.contractType);
    }
  }, [setup]);

  function applyCurrencyMask(element) {
    element.target.value = currencyMask(element.target.value);

    return element.target.value;
  }

  function handleChangeRadioPriceTableType(element) {
    const { generalSetup } = setup;
    const { setFieldValue } = formRef.current;

    setPriceTableType(element.target.value);
    resetSwitchServiceType(['miniUploads', 'largeFormats'], false);

    if (element.target.value === 'contract') {
      setFieldValue('contractType', generalSetup.contractType);
      setFieldValue('contractPrice', generalSetup.contractPrice);
    } else {
      setFieldValue('contractType', '');
      setFieldValue('contractPrice', '');
    }
  }

  function handleChangeSelecContractType(element) {
    const { value } = element.target;
    const items = {
      B: '20',
      V: '21',
      I: '51',
      BN: 'bro1',
      VN: 'rat1',
      IN: 'dia1',
    };

    if (value === 'I') {
      resetSwitchServiceType('largeFormats', false);
    }

    setContractType(value);
    setContractPriceInFormByContractType(items[value]);
  }

  function handleChangeSwitchServiceType(event) {
    const { name, checked } = event.target;

    if (name === 'largeFormats') {
      setServiceType({
        sedex1012: false,
        sedexToday: false,
        miniUploads: false,
        largeFormats: checked,
      });
    } else {
      setServiceType({
        ...serviceType,
        [name]: checked,
        largeFormats: false,
      });
    }
  }

  function setContractPriceInFormByContractType(value) {
    const { setFieldValue } = formRef.current;

    setFieldValue('contractPrice', value);
  }

  function resetSwitchServiceType(name, checked) {
    let newServiceType = {};

    if (typeof name === 'object') {
      name.forEach((service) => {
        newServiceType = { ...newServiceType, [service]: checked };
      });
    } else {
      newServiceType = { [name]: checked };
    }

    setServiceType({ ...serviceType, ...newServiceType });
  }

  function handleSubmitForm(dataForm) {
    const strSetup = JSON.parse(JSON.stringify(setup));

    mountGeneralConfigurationData(strSetup, dataForm);
  }

  function mountGeneralConfigurationData(setupData, formData) {
    const { handlingFee, contractPrice } = formData;

    setupData = {
      ...setupData,
      generalSetup: {
        ...setupData.generalSetup,
        serviceType,
        priceTableType,
        handlingFee:
          removeMask(handlingFee) !== '000' ? removeMask(handlingFee) : '0',
      },
    };

    if (priceTableType === 'atSight') {
      setupData.generalSetup.contractType = 'B';
      setupData.generalSetup.contractPrice = '20';
    } else {
      setupData.generalSetup.contractType = contractType;
      setupData.generalSetup.contractPrice = contractPrice;
    }

    assembleThePackagingConfiguration(setupData);
  }

  function assembleThePackagingConfiguration(setupData) {
    const { contractPrice } = formRef.current.getData();

    let newServiceCode = [];
    let newTables = [];

    if (priceTableType === 'atSight') {
      const { sedex1012, sedexToday } = serviceType;

      newServiceCode.push('04510', '04014');
      newTables.push('av');

      if (sedex1012) {
        newServiceCode.push('04790', '04782');
        newTables.push('s10av');
      }

      if (sedexToday) {
        newServiceCode.push('04804');
        newTables.push('shjav');
      }
    } else {
      const contracts = {
        B(services, table) {
          const arrCode = [];
          const arrTable = [];

          if (services.largeFormats) {
            arrCode.push('04618', '04537');
            arrTable.push(table);
          } else {
            const { miniUploads, sedex1012, sedexToday } = services;

            arrCode.push('04596', '04553');
            arrTable.push(table);

            if (miniUploads) {
              arrCode.push('04235');
              arrTable.push(`pcm${table}`);
            }

            if (sedex1012) {
              arrCode.push('04790', '04782');
              arrTable.push('s10av');
            }

            if (sedexToday) {
              arrCode.push('04804');
              arrTable.push('shjav');
            }
          }

          return { code: arrCode, table: arrTable };
        },
        V(services, table) {
          const arrCode = [];
          const arrTable = [];

          if (services.largeFormats) {
            arrCode.push('04693', '04138');
            arrTable.push(table);
          } else {
            const { miniUploads, sedex1012, sedexToday } = services;

            arrCode.push('04669', '04162');
            arrTable.push(table);

            if (miniUploads) {
              arrCode.push('04227');

              if (parseInt(table, 10) >= 21 && parseInt(table, 10) <= 25) {
                arrTable.push('pcm21');
              } else {
                arrTable.push(`pcm${table}`);
              }
            }

            if (sedex1012) {
              arrCode.push('04790', '04782');
              arrTable.push('s10av');
            }

            if (sedexToday) {
              arrCode.push('04804');
              arrTable.push('shjav');
            }
          }

          return { code: arrCode, table: arrTable };
        },
        I(services, table) {
          const { miniUploads, sedex1012, sedexToday } = services;
          const arrCode = [];
          const arrTable = [];

          arrCode.push('04812', '04316');
          arrTable.push(table);

          if (miniUploads) {
            arrCode.push('04391');
            arrTable.push(`pcm${table}`);
          }

          if (sedex1012) {
            arrCode.push('04790', '04782');
            arrTable.push('s10av');
          }

          if (sedexToday) {
            arrCode.push('04804');
            arrTable.push('shjav');
          }

          return { code: arrCode, table: arrTable };
        },
        BN(services, table) {
          const arrCode = [];
          const arrTable = [];

          if (services.largeFormats) {
            arrCode.push('03107', '03042');
            arrTable.push(table);
          } else {
            const { miniUploads, sedex1012, sedexToday } = services;

            arrCode.push('03085', '03050');
            arrTable.push(table);

            if (miniUploads) {
              arrCode.push('04235');
              arrTable.push(`pcm${table}`);
            }

            if (sedex1012) {
              arrCode.push('04790', '04782');
              arrTable.push('s10av');
            }

            if (sedexToday) {
              arrCode.push('04804');
              arrTable.push('shjav');
            }
          }

          return { code: arrCode, table: arrTable };
        },
        VN(services, table) {
          const arrCode = [];
          const arrTable = [];

          if (services.largeFormats) {
            arrCode.push('03328', '03212');
            arrTable.push(table);
          } else {
            const { miniUploads, sedex1012, sedexToday } = services;

            arrCode.push('03298', '03220');
            arrTable.push(table);

            if (miniUploads) {
              arrCode.push('04227');
              arrTable.push(`pcm${table}`);
            }

            if (sedex1012) {
              arrCode.push('03158', '03140');
              arrTable.push(`s10${table}`);
            }

            if (sedexToday) {
              arrCode.push('03204');
              arrTable.push(`shj${table}`);
            }
          }

          return { code: arrCode, table: arrTable };
        },
        IN(services, table) {
          const arrCode = [];
          const arrTable = [];

          if (services.largeFormats) {
            arrCode.push('03328', '03212');
            arrTable.push(table);
          } else {
            const { miniUploads, sedex1012, sedexToday } = services;

            arrCode.push('03336', '03280');
            arrTable.push(table);

            if (miniUploads) {
              arrCode.push('04391');
              arrTable.push(`pcm${table}`);
            }

            if (sedex1012) {
              arrCode.push('03158', '03140');
              arrTable.push(`s10${table}`);
            }

            if (sedexToday) {
              arrCode.push('03204');
              arrTable.push(`shj${table}`);
            }
          }

          return { code: arrCode, table: arrTable };
        },
      };

      const contractTypeFunction = contracts[contractType];
      const result = contractTypeFunction(serviceType, contractPrice);

      newServiceCode = [...result.code];
      newTables = [...result.table];
    }

    setupData.packagingSetup.serviceCode = [...newServiceCode];
    setupData.packagingSetup.tables = [...newTables];

    saveSetupInRedux(setupData);
  }

  function saveSetupInRedux(data) {
    dispatch(setSetup(data));
    setSuccessMessage('Configurações salvas com sucesso.');
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title}>Configurações</Typography>

        <Form ref={formRef} onSubmit={handleSubmitForm}>
          <Box>
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.subtitle}>
                  Taxa de Manuseio
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  type="tel"
                  name="handlingFee"
                  inputProps={{
                    maxLength: 9,
                  }}
                  fullWidth
                  onChange={applyCurrencyMask}
                />
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.subtitle}>
                  Tabela de Preços
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <RadioGroup
                  className={classes.formGroupContainer}
                  name="priceTableType"
                  value={priceTableType}
                  onChange={handleChangeRadioPriceTableType}
                >
                  <FormControlLabel
                    label="À vista"
                    value="atSight"
                    control={<Radio size="small" />}
                  />
                  <FormControlLabel
                    label="Contrato"
                    value="contract"
                    control={<Radio size="small" />}
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Box>

          <Box
            className={clsx(classes.fullWidth, {
              [classes.hidden]: priceTableType !== 'contract',
            })}
            mt={2}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Select
                  className={classes.fullWidth}
                  label="Tipo de Contrato"
                  name="contractType"
                  onChange={handleChangeSelecContractType}
                >
                  <MenuItem value="B">Básico</MenuItem>
                  <MenuItem value="V">Varejo</MenuItem>
                  <MenuItem value="I">Industrial</MenuItem>
                  <MenuItem value="BN">Básico Novo</MenuItem>
                  <MenuItem value="VN">Varejo Novo</MenuItem>
                  <MenuItem value="IN">Industrial Novo</MenuItem>
                </Select>
              </Grid>

              <Grid item xs={6}>
                <Select
                  className={classes.fullWidth}
                  label="Tabela de Preços"
                  name="contractPrice"
                >
                  {renderListPriceItemsByContractType()}
                </Select>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.subtitle}>
                  Outros Serviços
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormGroup className={classes.formGroupContainer}>
                  <FormControlLabel
                    label="SEDEX 10/12"
                    control={
                      <Switch
                        name="sedex1012"
                        size={isMobile ? 'small' : 'medium'}
                        checked={serviceType.sedex1012}
                        onChange={handleChangeSwitchServiceType}
                      />
                    }
                  />

                  <FormControlLabel
                    label="SEDEX Hoje"
                    control={
                      <Switch
                        name="sedexToday"
                        size={isMobile ? 'small' : 'medium'}
                        checked={serviceType.sedexToday}
                        onChange={handleChangeSwitchServiceType}
                      />
                    }
                  />
                </FormGroup>
              </Grid>

              <Grid item xs={12}>
                <FormGroup className={classes.formGroupContainer}>
                  <FormControlLabel
                    className={clsx({
                      [classes.hidden]: priceTableType !== 'contract',
                    })}
                    label="Mini Envios"
                    control={
                      <Switch
                        name="miniUploads"
                        size={isMobile ? 'small' : 'medium'}
                        checked={serviceType.miniUploads}
                        onChange={handleChangeSwitchServiceType}
                      />
                    }
                  />

                  <FormControlLabel
                    className={clsx({
                      [classes.hidden]:
                        priceTableType !== 'contract' || contractType === 'I',
                    })}
                    label="Gr. Formatos"
                    control={
                      <Switch
                        name="largeFormats"
                        size={isMobile ? 'small' : 'medium'}
                        checked={serviceType.largeFormats}
                        onChange={handleChangeSwitchServiceType}
                      />
                    }
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Grid container spacing={2}>
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

              <Grid item xs={12}>
                <Button
                  className={classes.saveButton}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                >
                  Salvar
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      </CardContent>
    </Card>
  );
}

export default Configuration;
