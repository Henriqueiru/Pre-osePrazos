import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Grid,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
} from '@material-ui/core';
import { Scope } from '@unform/core';
import { Form } from '@unform/web';
import moment from 'moment';
import { TextField, Select, Switch } from 'unform-material-ui';
import * as Yup from 'yup';

import API from '~/services/api';
import { setHistoryCalculateShipping } from '~/store/actions/historyCalculateShipping';
import { dimensionsFormatter } from '~/utils/formatter.utils';
import { dimensionsMask, currencyMask } from '~/utils/mask.utils';

import useStyles from './style';

function OrderTab({
  calculateShipping,
  formRef,
  zipsCodes,
  setZipsCodesError,
  setResultApi,
}) {
  const packaging = useSelector((state) => state.packaging);
  const setup = useSelector((state) => state.setup);
  const historyCalculateShipping = useSelector(
    (state) => state.historyCalculateShipping
  );

  const classes = useStyles();
  const dispatch = useDispatch();

  const [objectFormat, setObjectFormat] = useState('');
  const [serviceFurther, setServiceFurther] = useState({});
  const [accordion, setAccordion] = useState(false);
  const [dimensionsErrorMessage, setDimensionsErrorMessage] = useState(null);

  useMemo(() => {
    const { order } = calculateShipping;

    setObjectFormat(order.objectFormat);
    setServiceFurther(order.additionalService);

    setTimeout(() => {
      formRef.current.setData({ ...order });
    }, 500);
  }, [calculateShipping, formRef]);

  function applyCurrencyMask(event) {
    event.target.value = currencyMask(event.target.value);

    return event.target.value;
  }

  function applyDimensionsMask(event) {
    event.target.value = dimensionsMask(event.target.value);

    clearDimensionsErrorMessage();
    clearPackagingOnForm();

    return event.target.value;
  }

  function handleChangeSelectObjectFormat(event) {
    setObjectFormat(event.target.value);

    clearPackagingOnForm();
    clearDimensionsOnForm();
  }

  function handleChangeSelectPackaging(event) {
    const { setFieldValue } = formRef.current;
    const { datasets } = packaging;

    let dimensions = {};

    datasets.forEach((data) => {
      if (data.id === event.target.value) {
        dimensions = data.dimensions;
      }
    });

    setFieldValue('dimensions.height', dimensions.height);
    setFieldValue('dimensions.length', dimensions.length);
    setFieldValue('dimensions.width', dimensions.width);
    setFieldValue('dimensions.diameter', dimensions.diameter);
  }

  function handleChangeExpasionPanel(panel) {
    setAccordion(!accordion ? panel : false);
  }

  function handleChangeSwitchServiceFurther(event) {
    setServiceFurther({
      ...serviceFurther,
      [event.target.name]: event.target.checked,
    });
  }

  function renderItemsPackagingByObjectFormat(format) {
    const { datasets } = packaging;

    if (datasets.length) {
      return datasets.map((value) => {
        if (value.format === format) {
          return (
            <MenuItem key={value.id} value={value.id}>
              {value.name}
            </MenuItem>
          );
        }

        return <div key={value.id} />;
      });
    }

    return <div />;
  }

  function renderItemsDimensionsItemsByObjectFormat(object) {
    const items = {
      1: (
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Altura"
              name="height"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Largura"
              name="width"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>

          <Grid item xs={4}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Comprimento"
              name="length"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>
        </Grid>
      ),
      2: (
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Diâmetro"
              name="diameter"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Comprimento"
              name="length"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>
        </Grid>
      ),
      3: (
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Largura"
              name="width"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              className={classes.textFieldLabel}
              type="tel"
              label="Comprimento"
              name="length"
              inputProps={{
                maxLength: 5,
              }}
              fullWidth
              onChange={applyDimensionsMask}
            />
          </Grid>
        </Grid>
      ),
    };

    return items[object];
  }

  function renderWeightItemsByServiceType(serviceType) {
    const { largeFormats } = serviceType;
    const limit = largeFormats ? 167 : 30;

    const items = [
      <MenuItem key={300} value={0.299}>
        Até 300 g
      </MenuItem>,
      <MenuItem key={500} value={0.499}>
        Até 500 g
      </MenuItem>,
      <MenuItem key={0.999} value={0.999}>
        Até 1 Kg
      </MenuItem>,
    ];

    for (let i = 1; i < limit; i += 1) {
      items.push(
        <MenuItem key={i} value={parseFloat(`${i}.999`)}>
          Até {i + 1} Kg
        </MenuItem>
      );
    }

    return items;
  }

  function clearPackagingOnForm() {
    const { packagingKey, dimensions } = formRef.current.getData();

    if (packagingKey) {
      const { setFieldValue } = formRef.current;

      setFieldValue('packagingKey', '');

      setFieldValue('dimensions.diameter', dimensions.diameter);
      setFieldValue('dimensions.height', dimensions.height);
      setFieldValue('dimensions.length', dimensions.length);
      setFieldValue('dimensions.width', dimensions.width);
    }
  }

  function clearDimensionsOnForm() {
    const { setFieldValue } = formRef.current;

    setFieldValue('dimensions.diameter', '');
    setFieldValue('dimensions.height', '');
    setFieldValue('dimensions.length', '');
    setFieldValue('dimensions.width', '');
  }

  function clearDimensionsErrorMessage() {
    setDimensionsErrorMessage(null);
    formRef.current.setErrors({});
  }

  function handleSubmitForm(formData) {
    const data = { ...formData, zipsCodes };

    validateFields(data);
  }

  async function validateFields(formData) {
    const { dimensions } = formData;

    try {
      const schema = Yup.object().shape({
        zipsCodes: Yup.object().shape({
          origin: Yup.string()
            .required('O CEP de origem é obrigatório.')
            .matches(/^(?!d*00).*$/, 'CEP inválido'),
          destination: Yup.string()
            .required('O CEP de destino é obrigatório.')
            .matches(/^(?!d*00).*$/, 'CEP inválido'),
        }),
      });

      await schema.validate(formData, {
        abortEarly: false,
      });

      const strDimensions = dimensionsFormatter(dimensions);

      validateDimensions({ objectFormat, dimensions: strDimensions });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};
        const errorMessagesZipsCodes = {};

        err.inner.forEach((error) => {
          if (
            error.path === 'zipsCodes.origin' ||
            error.path === 'zipsCodes.destination'
          ) {
            const path = error.path.split('.')[1];

            errorMessagesZipsCodes[path] = error.message;
          } else {
            errorMessages[error.path] = error.message;
          }
        });

        setZipsCodesError(errorMessagesZipsCodes);
        formRef.current.setErrors(errorMessages);
      }
    }
  }

  async function validateDimensions(data) {
    const { largeFormats } = setup.generalSetup.serviceType;

    try {
      const schema = Yup.object()
        .shape({
          objectFormat: Yup.number(),
          dimensions: Yup.object()
            .when('objectFormat', {
              is: (value) => value === 1,
              then: Yup.object().shape({
                height: Yup.number()
                  .typeError(`De 1 a ${largeFormats ? 150 : 100} cm`)
                  .min(1, `De 1 a ${largeFormats ? 150 : 100} cm`)
                  .max(
                    largeFormats ? 150 : 100,
                    `De 1 a ${largeFormats ? 150 : 100} cm`
                  ),
                length: Yup.number()
                  .typeError(`De 15 a ${largeFormats ? 150 : 100} cm`)
                  .min(15, `De 15 a ${largeFormats ? 150 : 100} cm`)
                  .max(
                    largeFormats ? 150 : 100,
                    `De 15 a ${largeFormats ? 150 : 100} cm`
                  ),
                width: Yup.number()
                  .typeError(`De 10 a ${largeFormats ? 150 : 100} cm`)
                  .min(10, `De 10 a ${largeFormats ? 150 : 100} cm`)
                  .max(
                    largeFormats ? 150 : 100,
                    `De 15 a ${largeFormats ? 150 : 100} cm`
                  ),
              }),
            })
            .when('objectFormat', {
              is: (value) => value === 2,
              then: Yup.object().shape({
                diameter: Yup.number()
                  .typeError('De 5 a 91 cm')
                  .min(5, 'De 5 a 91 cm')
                  .max(91, 'De 5 a 91 cm'),
                length: Yup.number()
                  .typeError('De 18 a 100 cm')
                  .min(18, 'De 18 a 100 cm')
                  .max(100, 'De 18 a 100 cm'),
              }),
            })
            .when('objectFormat', {
              is: (value) => value === 3,
              then: Yup.object().shape({
                length: Yup.number()
                  .typeError('De 16 a 60 cm')
                  .min(16, 'De 16 a 60 cm')
                  .max(60, 'De 16 a 60 cm'),
                width: Yup.number()
                  .typeError('De 11 a 60 cm')
                  .min(11, 'De 11 a 60 cm')
                  .max(60, 'De 11 a 60 cm'),
              }),
            }),
        })
        .test('calculations', function calculations(value) {
          const element = this;
          const { diameter, height, length, width } = value.dimensions;

          if (
            Number.isNaN(diameter) ||
            Number.isNaN(height) ||
            Number.isNaN(length) ||
            Number.isNaN(width)
          ) {
            return true;
          }

          const calculationValidation = {
            1() {
              const sum = height + length + width;
              const limit = largeFormats ? 300 : 200;

              return sum <= limit;
            },
            2() {
              const sum = length + diameter * 2;

              return sum <= 200;
            },
            3() {
              const sum = width + length;

              return sum <= 120;
            },
          };
          const calculationFunction = calculationValidation[value.objectFormat];
          const valid = calculationFunction();

          if (!valid && value.objectFormat === 1) {
            return element.createError({
              path: 'dimensions.height',
              message: `Soma das dimensões: máximo ${
                largeFormats ? 300 : 200
              } cm`,
            });
          }

          if (!valid && value.objectFormat === 2) {
            return element.createError({
              path: 'dimensions.diameter',
              message: 'Comprimento + dobro do diâmetro:  máximo 200 cm',
            });
          }

          if (!valid && value.objectFormat === 3) {
            return element.createError({
              path: 'dimensions.width',
              message: 'Soma das dimensões: máximo 120 cm',
            });
          }

          return true;
        });

      await schema.validate(data, {
        abortEarly: false,
      });

      assembleParametersForAPI();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach((error) => {
          if (error.type === 'calculations') {
            setDimensionsErrorMessage(error.message);
          } else {
            errorMessages[error.path] = error.message;
          }
        });

        formRef.current.setErrors(errorMessages);
      }
    }
  }

  function assembleParametersForAPI() {
    const { dimensions, additionalService, weight } = formRef.current.getData();
    const { origin, destination } = zipsCodes;

    const { serviceCode, tables } = setup.packagingSetup;

    let params = `sCepOrigem=${origin}&sCepDestino=${destination}&nVlPeso=${weight}&nCdFormato=${objectFormat}&StrRetorno=json&sEndereco=s`;
    let cdService = '&nCdServico=';
    let sTable = '&sTabela=';

    params += `&nVlAltura=${
      dimensions.height ? dimensions.height : 0
    }&nVlLargura=${dimensions.width ? dimensions.width : 0}&nVlDiametro=${
      dimensions.diameter ? dimensions.diameter : 0
    }&nVlComprimento=${dimensions.length ? dimensions.length : 0}`;

    params += `&sCdMaoPropria=${
      additionalService.ownHands ? 'S' : 'N'
    }&nVlValorDeclarado=${
      additionalService.price
        ? parseFloat(
            additionalService.price.replace(/[^0-9,]*/g, '').replace(',', '.')
          ).toFixed(2)
        : 0
    }&sCdAvisoRecebimento=${
      additionalService.acknowledgmentOfReceipt ? 'S' : 'N'
    }`;

    serviceCode.forEach((code, i) => {
      const lastElement = serviceCode.length - 1;

      cdService += `${code}`;
      cdService += lastElement !== i ? ',' : '';
    });

    tables.forEach((table, y) => {
      const lastElement = tables.length - 1;

      sTable += `${table}`;
      sTable += lastElement !== y ? ',' : '';
    });

    params += `${cdService}${sTable}`;

    getDataByAPI(params);
  }

  async function getDataByAPI(parameters) {
    const response = await API.get(`m/CalcPrecoPrazo?${parameters}`);

    if (response.data) {
      const { Servicos } = response.data.cResultado;

      let dataApi = { services: [] };

      Object.entries(Servicos).forEach((data) => {
        if (data[0] === 'EnderecoOrigem') {
          dataApi = {
            ...dataApi,
            address: {
              ...dataApi.address,
              origin: { zipCode: zipsCodes.origin, ...data[1] },
            },
          };
        }

        if (data[0] === 'EnderecoDestino') {
          dataApi = {
            ...dataApi,
            address: {
              ...dataApi.address,
              destination: {
                zipCode: zipsCodes.destination,
                ...data[1],
              },
            },
          };
        }

        if (data[0] !== 'EnderecoOrigem' && data[0] !== 'EnderecoDestino') {
          dataApi.services.push(data[1].cServico);
        }
      });

      setResultApi({
        api: dataApi,
        formData: formRef.current.getData(),
      });

      const isServicesNull = dataApi.services.filter((service) => {
        return service.Valor !== '0,00';
      });

      if (
        dataApi.address.origin.Logradouro !== 'CEP inexistente' &&
        dataApi.address.destination.Logradouro !== 'CEP inexistente' &&
        isServicesNull.length !== 0
      ) {
        mountDataHistory(dataApi);
      }
    }

    formRef.current.setErrors({});
    setDimensionsErrorMessage(null);
  }

  function mountDataHistory(args) {
    const { packagingKey, ...rest } = formRef.current.getData();
    const { handlingFee } = setup.generalSetup;
    const { id, datasets } = historyCalculateShipping;

    let packingValue = '0';

    if (packagingKey) {
      packaging.datasets.forEach((data) => {
        if (data.id === packagingKey) {
          packingValue = data.price;
        }
      });
    }

    datasets.push({
      id,
      createdAt: moment().format(),
      handlingFee,
      formData: {
        ...rest,
        packagingKey,
        packingValue,
      },
      ...args,
      objectType: 0,
    });

    dispatch(setHistoryCalculateShipping({ id: id + 1, datasets }));
  }

  return (
    <Form ref={formRef} onSubmit={handleSubmitForm}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Select
            className={classes.fullWidth}
            label="Formato"
            name="objectFormat"
            onChange={handleChangeSelectObjectFormat}
          >
            <MenuItem value={1}>Caixa/Pacote</MenuItem>
            <MenuItem value={2}>Rolo/Cilindro ou Esfera</MenuItem>
            <MenuItem value={3}>Envelope</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={6}>
          <Select className={classes.fullWidth} label="Peso" name="weight">
            {renderWeightItemsByServiceType(setup.generalSetup.serviceType)}
          </Select>
        </Grid>
      </Grid>

      <Box mt={1}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              className={classes.fullWidth}
              label="Embalagem (opcional)"
              name="packagingKey"
              onChange={handleChangeSelectPackaging}
            >
              <MenuItem value="">Nenhuma embalagem</MenuItem>

              {renderItemsPackagingByObjectFormat(objectFormat)}
            </Select>
          </Grid>
        </Grid>
      </Box>

      <Box mt={2}>
        <Scope path="dimensions">
          {renderItemsDimensionsItemsByObjectFormat(objectFormat)}
        </Scope>
      </Box>

      {dimensionsErrorMessage && (
        <Box mt={2}>
          <Typography className={classes.dimensionsErrorMessage} color="error">
            {dimensionsErrorMessage}
          </Typography>
        </Box>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Accordion
            expanded={accordion === 'additionalServicePanel'}
            elevation={0}
            onChange={() => handleChangeExpasionPanel('additionalServicePanel')}
          >
            <AccordionSummary
              className={classes.accordionSummary}
              expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
            >
              <Typography variant="h3">Serviços Adicionais</Typography>
            </AccordionSummary>

            <AccordionDetails className={classes.accordionDetails}>
              <Scope path="additionalService">
                <FormGroup>
                  <FormControlLabel
                    label="MP - Mão Própria"
                    control={
                      <Switch
                        name="ownHands"
                        checked={!!serviceFurther.ownHands}
                        onChange={handleChangeSwitchServiceFurther}
                      />
                    }
                  />

                  <FormControlLabel
                    label="AR - Aviso de Recebimento"
                    control={
                      <Switch
                        name="acknowledgmentOfReceipt"
                        checked={!!serviceFurther.acknowledgmentOfReceipt}
                        onChange={handleChangeSwitchServiceFurther}
                      />
                    }
                  />

                  <FormControlLabel
                    label="VD - Valor Declarado (seguro)"
                    control={
                      <Switch
                        name="valueStatement"
                        checked={!!serviceFurther.valueStatement}
                        onChange={handleChangeSwitchServiceFurther}
                      />
                    }
                  />
                </FormGroup>

                {serviceFurther.valueStatement && (
                  <Box mt={2} display="flex" alignItems="center">
                    <Typography className={classes.valueStatementText}>
                      Informe o valor do objeto a ser enviado:
                    </Typography>

                    <TextField
                      type="tel"
                      name="price"
                      placeholder="R$ 0,00"
                      inputProps={{
                        maxLength: 12,
                      }}
                      onChange={applyCurrencyMask}
                    />
                  </Box>
                )}
              </Scope>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item xs={12}>
          <Button
            className={classes.calculateShippingButton}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            Preços e Prazos
          </Button>
        </Grid>
      </Grid>
    </Form>
  );
}

export default OrderTab;
