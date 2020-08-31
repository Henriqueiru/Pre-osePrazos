import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Button,
  Tooltip,
  IconButton,
  Zoom,
  Box,
} from '@material-ui/core';
import { Scope } from '@unform/core';
import { Form } from '@unform/web';
import { TextField, Select } from 'unform-material-ui';
import * as Yup from 'yup';

import Case from '~/assets/image/caixa.svg';
import Envelope from '~/assets/image/envelope.svg';
import Roll from '~/assets/image/rolo.svg';
import { setPackaging } from '~/store/actions/packaging';
import { dimensionsFormatter } from '~/utils/formatter.utils';
import { removeMask, currencyMask, dimensionsMask } from '~/utils/mask.utils';

import useStyles from './style';

function Packaging() {
  const packaging = useSelector((state) => state.packaging);

  const classes = useStyles();
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const [packingFormat, setPackingFormat] = useState(1);
  const [rowSelected, setRowSelected] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { setData } = formRef.current;

    if (rowSelected) {
      const { price, format } = rowSelected;

      setTimeout(() => {
        setData({ ...rowSelected, price: currencyMask(price) });
      }, 100);

      setPackingFormat(format);
    }
  }, [rowSelected]);

  function applyPriceMask(e) {
    e.target.value = currencyMask(e.target.value);

    return e.target.value;
  }

  function applyDimensionsMask(e) {
    e.target.value = dimensionsMask(e.target.value);

    return e.target.value;
  }

  function renderDimensionsItemsByFormat(type) {
    const items = {
      1: (
        <>
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
        </>
      ),
      2: (
        <>
          <Grid item xs={6} sm={6}>
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

          <Grid item xs={6} sm={6}>
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
        </>
      ),
      3: (
        <>
          <Grid item xs={6} sm={6}>
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

          <Grid item xs={6} sm={6}>
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
        </>
      ),
    };

    return items[type];
  }

  function renderPackingList(data) {
    if (data.length) {
      return data.map((value) => {
        return (
          <Box className={classes.containerMyPackaging} key={value.id}>
            <Box display="flex" alignItems="center">
              {renderPackagingIconByFormat(value.format)}

              <Typography className={classes.myPackagingText}>
                {value.name}
              </Typography>
            </Box>

            <Box>
              <Tooltip
                title="Editar"
                placement="bottom"
                TransitionComponent={Zoom}
              >
                <IconButton
                  className={classes.myPackagingEditButton}
                  onClick={() => handleClickBtnEditPacking(value)}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Excluir"
                placement="bottom"
                TransitionComponent={Zoom}
              >
                <IconButton
                  className={classes.myPackagingDeleteButton}
                  onClick={() => removePackingInRedux(value.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      });
    }

    return <div />;
  }

  function renderPackagingIconByFormat(format) {
    if (format === 1) {
      return <img src={Case} alt="caseImg" height={16} />;
    }

    if (format === 2) {
      return <img src={Roll} alt="rollImg" height={16} />;
    }

    return <img src={Envelope} alt="envelopeImg" height={12} />;
  }

  function handleClickBtnEditPacking(data) {
    setRowSelected(data);
    window.scrollTo(0, 0);
  }

  function handleSubmitForm(data) {
    setLoading(true);
    validationFields(data);
  }

  async function validationFields(data) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório.'),
        format: Yup.string().required('O formato é obrigatório.'),
        price: Yup.string().required('O preço é obrigatório.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const dimensions = dimensionsFormatter(data.dimensions);

      validateDimensions(dimensions);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach((error) => {
          errorMessages[error.path] = error.message;
        });

        formRef.current.setErrors(errorMessages);
        setLoading(false);
      }
    }
  }

  async function validateDimensions(dimensions) {
    try {
      const schema = Yup.object().shape({
        height: Yup.number()
          .typeError('A altura é obrigatória.')
          .min(1, 'A altura não pode ser menor que 1.')
          .max(150, 'A altura não pode ser maior que 150.'),
        width: Yup.number()
          .typeError('A largura é obrigatória.')
          .min(1, 'A largura não pode ser menor que 1.')
          .max(150, 'A largura não pode ser maior que 150.'),
        length: Yup.number()
          .typeError('O comprimento é obrigatório.')
          .min(1, 'O comprimento não pode ser menor que 1.')
          .max(150, 'O comprimento não pode ser maior que 150.'),
        diameter: Yup.number()
          .typeError('O diâmetro é obrigatório.')
          .min(1, 'O diâmetro não pode ser menor que 1.')
          .max(150, 'O diâmetro não pode ser maior que 150.'),
      });

      await schema.validate(dimensions, {
        abortEarly: false,
      });

      mountData();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorMessages = {};

        err.inner.forEach((error) => {
          errorMessages[`dimensions.${error.path}`] = error.message;
        });

        formRef.current.setErrors(errorMessages);
        setLoading(false);
      }
    }
  }

  function mountData() {
    const formData = formRef.current.getData();
    const data = JSON.parse(JSON.stringify(packaging));

    if (formData.id) {
      const { id } = formData;
      const { datasets } = data;
      const indexElement = datasets.findIndex(
        (el) => el.id === parseInt(id, 10)
      );

      datasets.splice(indexElement, 1, {
        ...formData,
        id: parseInt(id, 10),
        price:
          removeMask(formData.price) !== '000'
            ? removeMask(formData.price)
            : '0',
      });
    } else {
      const { datasets } = data;
      data.id += 1;

      datasets.push({
        ...formData,
        id: data.id,
        price:
          removeMask(formData.price) !== '000'
            ? removeMask(formData.price)
            : '0',
      });
    }

    savePackingInRedux(data);
  }

  function savePackingInRedux(data) {
    dispatch(setPackaging(data));
    resetElementsState();
  }

  function removePackingInRedux(id) {
    const { datasets } = JSON.parse(JSON.stringify(packaging));

    datasets.forEach((data, index) => {
      if (data.id === id) {
        datasets.splice(index, 1);
      }
    });

    dispatch(setPackaging({ ...packaging, datasets }));
    resetElementsState();
  }

  function resetElementsState() {
    formRef.current.reset();
    formRef.current.setFieldValue('format', 1);
    formRef.current.setErrors({});

    setPackingFormat(1);
    setLoading(false);

    handleClickBtnEditPacking('');
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography className={classes.title}>Embalagens</Typography>

        <Typography className={classes.subtitle}>Nova Embalagem</Typography>

        <Form ref={formRef} onSubmit={handleSubmitForm}>
          <TextField className={classes.hidden} name="id" />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Nome" name="name" fullWidth />
            </Grid>

            <Grid item xs={6}>
              <Select
                className={classes.fullWidth}
                label="Formato"
                name="format"
                defaultValue={packingFormat}
                onChange={(e) => setPackingFormat(e.target.value)}
              >
                <MenuItem value={1}>Caixa/Pacote</MenuItem>
                <MenuItem value={2}>Rolo/Cilindro ou Esfera</MenuItem>
                <MenuItem value={3}>Envelope</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <TextField
                type="tel"
                label="Preço"
                name="price"
                inputProps={{
                  maxLength: 9,
                }}
                fullWidth
                onChange={applyPriceMask}
              />
            </Grid>
          </Grid>

          <Box mt={1}>
            <Grid container spacing={1}>
              <Scope path="dimensions">
                {renderDimensionsItemsByFormat(packingFormat)}
              </Scope>
            </Grid>
          </Box>

          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  className={classes.addButton}
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Aguarde ...' : 'Adicionar'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>

        <Typography className={classes.subtitle}>Minhas Embalagens</Typography>

        {renderPackingList(packaging.datasets)}
      </CardContent>
    </Card>
  );
}

export default Packaging;
