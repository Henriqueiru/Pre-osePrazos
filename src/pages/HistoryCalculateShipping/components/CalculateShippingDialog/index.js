import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import {
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';

import {
  faTimes,
  faAngleDown,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  Divider,
  Box,
  Badge,
  useMediaQuery,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useTheme } from '@material-ui/styles';
import { toPng } from 'html-to-image';
import moment from 'moment';

import AdPlaceholder from '~/assets/image/ad-placeholder-320x100.png';
import { currencyFormatter } from '~/utils/formatter.utils';
import { removeMask } from '~/utils/mask.utils';

import useStyles from './style';

function CalculateShippingDialog({ close, apiData, objectType, ...rest }) {
  const setup = useSelector((state) => state.setup);

  const classes = useStyles();
  const theme = useTheme();
  const serviceCode = [
    {
      4510: 'PAC',
      4596: 'PAC',
      4669: 'PAC',
      4812: 'PAC',
      3085: 'PAC',
      3298: 'PAC',
      3336: 'PAC',
      4618: 'PACGF',
      4693: 'PACGF',
      3107: 'PACGF',
      3328: 'PACGF',
      4014: 'SEDEX',
      4553: 'SEDEX',
      4162: 'SEDEX',
      4316: 'SEDEX',
      3050: 'SEDEX',
      3220: 'SEDEX',
      3280: 'SEDEX',
      4537: 'SEDEXGF',
      4318: 'SEDEXGF',
      3042: 'SEDEXGF',
      3212: 'SEDEXGF',
      4235: 'Mini Envios',
      4227: 'Mini Envios',
      4391: 'Mini Envios',
      4790: 'SEDEX 10',
      4782: 'SEDEX 12',
      3158: 'SEDEX 10',
      3140: 'SEDEX 12',
      4804: 'SEDEX Hoje',
      3204: 'SEDEX Hoje',
    },
    {
      10154: 'Carta',
      10162: 'Carta',
      20419: 'Imp. Normal',
      20362: 'Imp. Normal',
      20370: 'Imp. Urgente',
      20397: 'Imp. Urgente',
    },
  ];

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  function mountDeliveryMessage(homeDelivery, saturdayDelivery) {
    if (homeDelivery === 'N') {
      return 'Entrega na agência mais próxima.';
    }

    if (homeDelivery === 'S' && saturdayDelivery === 'N') {
      return 'Entrega domiciliar de segunda a sexta-feira.';
    }

    return 'Entrega domiciliar de segunda a sábado.';
  }

  function mountDeadlineMessage(deadline) {
    if (deadline !== '0') {
      if (deadline === '1') {
        return '1 dia útil';
      }
      return `${deadline} dias úteis`;
    }
    return 'Indisponível';
  }

  function mountSharedMessage() {
    const { address, services } = apiData;

    const data = { title: '', url: 'https://precoseprazos.com.br' };

    const isSedexService1012 = services.filter((service) => {
      const { Codigo, PrazoEntrega } = service;

      return (
        (serviceCode[objectType][Codigo] === 'SEDEX 10' ||
          serviceCode[objectType][Codigo] === 'SEDEX 12') &&
        PrazoEntrega !== '0'
      );
    });

    data.title = `Cotação feita em ${moment(apiData.createdAt).format(
      'DD/MM/YYYY'
    )} \nDe ${address.origin.zipCode} para ${address.destination.zipCode}\n\n`;

    services.forEach((service) => {
      const { Codigo, PrazoEntrega, Valor } = service;

      if (
        serviceCode[objectType][Codigo] !== 'SEDEX 10' &&
        serviceCode[objectType][Codigo] !== 'SEDEX 12'
      ) {
        data.title += `${serviceCode[objectType][Codigo]}: `;

        if (Valor !== '0,00') {
          data.title += `${mountDeadlineMessage(PrazoEntrega)}`;
          data.title += `, ${calculateTotalValueOfService(Valor)} \n`;
        } else {
          data.title += 'Indisponível\n';
        }
      }

      if (
        isSedexService1012.length > 0 &&
        isSedexService1012[0].Codigo === Codigo
      ) {
        data.title += `${serviceCode[objectType][Codigo]}: `;

        data.title += `${mountDeadlineMessage(PrazoEntrega)}`;

        data.title += `, ${calculateTotalValueOfService(Valor)} \n`;
      }

      if (
        serviceCode[0][Codigo] === 'SEDEX 12' &&
        isSedexService1012.length === 0
      ) {
        data.title += 'SEDEX 10/12: Indisponível\n';
      }
    });

    data.title +=
      '\nConheça a mais completa calculadora de frete dos Correios:';

    return data;
  }

  function calculateTotalValueOfService(serviceValue) {
    const { handlingFee, formData } = apiData;
    const strValue = parseInt(removeMask(serviceValue), 10);

    return currencyFormatter(
      strValue + parseInt(formData.packingValue, 10) + parseInt(handlingFee, 10)
    );
  }

  function renderServiceItems(data) {
    const { printedSetup } = setup;
    const { handlingFee, formData } = apiData;

    const isSedexService1012 = data.filter((services) => {
      const { Codigo, PrazoEntrega } = services;

      return (
        (serviceCode[objectType][Codigo] === 'SEDEX 10' ||
          serviceCode[objectType][Codigo] === 'SEDEX 12') &&
        PrazoEntrega !== '0'
      );
    });

    return data.map((value) => {
      if (
        serviceCode[objectType][value.Codigo] !== 'SEDEX 10' &&
        serviceCode[objectType][value.Codigo] !== 'SEDEX 12'
      ) {
        return (
          <Grid item key={value.Codigo} xs={12}>
            <Accordion elevation={0}>
              <Badge
                className={classes.accordionSummaryBadge}
                badgeContent={
                  value.obsFim ? (
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  ) : (
                    ''
                  )
                }
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <AccordionSummary
                  className={classes.accordionSummary}
                  id={value.Codigo}
                  expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography
                        className={classes.accordionSummaryTextHeader}
                      >
                        {serviceCode[objectType][value.Codigo]}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography
                        className={classes.accordionSummaryTextHeader}
                      >
                        {mountDeadlineMessage(value.PrazoEntrega)}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      {value.Erro === 0 && (
                        <Typography
                          className={classes.accordionSummaryTextHeader}
                        >
                          {calculateTotalValueOfService(value.Valor)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </AccordionSummary>
              </Badge>

              <AccordionDetails className={classes.accordionDetails}>
                {value.Valor !== '0,00' ? (
                  <>
                    <div className={classes.accordionDetailsItems}>
                      <Typography>Valor sem adicionais</Typography>

                      <Typography>
                        {currencyFormatter(
                          removeMask(value.ValorSemAdicionais)
                        )}
                      </Typography>
                    </div>

                    {formData.additionalService.ownHands && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>MP - Mão Própria</Typography>

                        <Typography>
                          {currencyFormatter(removeMask(value.ValorMaoPropria))}
                        </Typography>
                      </div>
                    )}

                    {formData.additionalService.acknowledgmentOfReceipt && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>AR - Aviso de Recebimento</Typography>

                        <Typography>
                          {currencyFormatter(
                            removeMask(value.ValorAvisoRecebimento)
                          )}
                        </Typography>
                      </div>
                    )}

                    {formData.additionalService.valueStatement && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>VD - Valor Declarado</Typography>

                        <Typography>
                          {currencyFormatter(
                            removeMask(value.ValorValorDeclarado)
                          )}
                        </Typography>
                      </div>
                    )}

                    {value.TaxaFormato && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Taxa de Formato</Typography>

                        <Typography>
                          {currencyFormatter(removeMask(value.TaxaFormato))}
                        </Typography>
                      </div>
                    )}

                    {objectType === 1 && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>
                          {printedSetup.recordType === '10154,20362,20370'
                            ? 'Registro Nacional'
                            : 'Registro Módico'}
                        </Typography>

                        <Typography>
                          {currencyFormatter(removeMask(value.ValorRegistro))}
                        </Typography>
                      </div>
                    )}

                    {formData.packingValue !== '0' && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Custo de Embalagem</Typography>

                        <Typography>
                          {currencyFormatter(formData.packingValue)}
                        </Typography>
                      </div>
                    )}

                    {handlingFee !== '0' && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Taxa de Manuseio</Typography>

                        <Typography>
                          {currencyFormatter(handlingFee)}
                        </Typography>
                      </div>
                    )}

                    <Box
                      className={classes.accordionDetailsItemsSubtitle}
                      mt={1}
                    >
                      {value.PesoCubico && (
                        <Typography>
                          Frete calculado pelo peso cúbico: {value.PesoCubico}{' '}
                          Kg
                        </Typography>
                      )}

                      <Typography>
                        {mountDeliveryMessage(
                          value.EntregaDomiciliar,
                          value.EntregaSabado
                        )}
                      </Typography>
                    </Box>

                    {value.obsFim && (
                      <Alert severity="info" style={{ marginTop: 8 }}>
                        {value.obsFim}
                      </Alert>
                    )}
                  </>
                ) : (
                  <Alert severity="error">{value.MsgErro}</Alert>
                )}
              </AccordionDetails>
            </Accordion>

            <Divider />
          </Grid>
        );
      }

      if (
        isSedexService1012.length > 0 &&
        isSedexService1012[0].Codigo === value.Codigo
      ) {
        return (
          <Grid item key={value.Codigo} xs={12}>
            <Accordion elevation={0}>
              <Badge
                className={classes.accordionSummaryBadge}
                badgeContent={
                  value.obsFim ? (
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  ) : (
                    ''
                  )
                }
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <AccordionSummary
                  className={classes.accordionSummary}
                  id={value.Codigo}
                  expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Typography
                        className={classes.accordionSummaryTextHeader}
                      >
                        {serviceCode[objectType][value.Codigo]}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography
                        className={classes.accordionSummaryTextHeader}
                      >
                        {mountDeadlineMessage(value.PrazoEntrega)}
                      </Typography>
                    </Grid>

                    <Grid item xs={4}>
                      {value.Erro === 0 && (
                        <Typography
                          className={classes.accordionSummaryTextHeader}
                        >
                          {calculateTotalValueOfService(value.Valor)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </AccordionSummary>
              </Badge>

              <AccordionDetails className={classes.accordionDetails}>
                {value.Valor !== '0,00' ? (
                  <>
                    <div className={classes.accordionDetailsItems}>
                      <Typography>Valor sem adicionais</Typography>

                      <Typography>
                        {currencyFormatter(
                          removeMask(value.ValorSemAdicionais)
                        )}
                      </Typography>
                    </div>

                    {formData.additionalService.ownHands && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>MP - Mão Própria</Typography>

                        <Typography>
                          {currencyFormatter(removeMask(value.ValorMaoPropria))}
                        </Typography>
                      </div>
                    )}

                    {formData.additionalService.acknowledgmentOfReceipt && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>AR - Aviso de Recebimento</Typography>

                        <Typography>
                          {currencyFormatter(
                            removeMask(value.ValorAvisoRecebimento)
                          )}
                        </Typography>
                      </div>
                    )}

                    {formData.additionalService.valueStatement && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>VD - Valor Declarado</Typography>

                        <Typography>
                          {currencyFormatter(
                            removeMask(value.ValorValorDeclarado)
                          )}
                        </Typography>
                      </div>
                    )}

                    {formData.packingValue !== '0' && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Custo de Embalagem</Typography>

                        <Typography>
                          {currencyFormatter(formData.packingValue)}
                        </Typography>
                      </div>
                    )}

                    {value.TaxaFormato && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Taxa de Formato</Typography>

                        <Typography>
                          {currencyFormatter(removeMask(value.TaxaFormato))}
                        </Typography>
                      </div>
                    )}

                    {handlingFee !== '0' && (
                      <div className={classes.accordionDetailsItems}>
                        <Typography>Taxa de Manuseio</Typography>

                        <Typography>
                          {currencyFormatter(handlingFee)}
                        </Typography>
                      </div>
                    )}

                    <Box mt={1}>
                      {value.PesoCubico && (
                        <Typography>
                          Frete calculado pelo peso cúbico: {value.PesoCubico}{' '}
                          Kg
                        </Typography>
                      )}

                      <Typography>
                        {mountDeliveryMessage(
                          value.EntregaDomiciliar,
                          value.EntregaSabado
                        )}
                      </Typography>
                    </Box>

                    {value.obsFim && (
                      <Alert severity="info">{value.obsFim}</Alert>
                    )}
                  </>
                ) : (
                  <Alert severity="error">{value.MsgErro}</Alert>
                )}
              </AccordionDetails>
            </Accordion>

            <Divider />
          </Grid>
        );
      }

      if (
        isSedexService1012.length === 0 &&
        serviceCode[objectType][value.Codigo] !== 'SEDEX 10'
      ) {
        return (
          <Grid item key={value.Codigo} xs={12}>
            <Accordion elevation={0}>
              <AccordionSummary
                className={classes.accordionSummary}
                id={value.Codigo}
                expandIcon={<FontAwesomeIcon icon={faAngleDown} />}
              >
                <Grid container>
                  <Grid item xs={4}>
                    <Typography className={classes.accordionSummaryTextHeader}>
                      SEDEX 10/12
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography className={classes.accordionSummaryTextHeader}>
                      Indisponível
                    </Typography>
                  </Grid>
                  <Grid item xs={3} />
                </Grid>
              </AccordionSummary>

              <AccordionDetails className={classes.accordionDetails}>
                <Alert severity="error">{value.MsgErro}</Alert>
              </AccordionDetails>
            </Accordion>

            <Divider />
          </Grid>
        );
      }

      return <div key={value.Codigo} />;
    });
  }

  function renderServiceAddress(data) {
    const { destination, origin } = data;

    return (
      <>
        <Box mt={2}>
          <Typography>
            <strong>ORIGEM: </strong>
            {origin.zipCode}
          </Typography>

          <Typography>
            {origin.Logradouro && `${origin.Logradouro} - `}
            {origin.Bairro && `${origin.Bairro} - `}
            {`${origin.Cidade}/${origin.Estado}`}
          </Typography>
        </Box>

        <Box mt={2}>
          <Typography>
            <strong>DESTINO: </strong>
            {destination.zipCode}
          </Typography>

          <Typography>
            {destination.Logradouro && `${destination.Logradouro} - `}
            {destination.Bairro && `${destination.Bairro} - `}
            {`${destination.Cidade}/${destination.Estado}`}
          </Typography>
        </Box>
      </>
    );
  }

  function renderSocialMediaShareButtonsInDesktop() {
    const { address, services } = apiData;
    const isServicesNull = services.filter((service) => {
      return service.Valor !== '0,00';
    });

    if (
      address.origin.Logradouro === 'CEP inexistente' ||
      address.destination.Logradouro === 'CEP inexistente' ||
      isServicesNull.length === 0
    ) {
      return <div />;
    }

    const shareData = mountSharedMessage();

    return (
      <Box mb={3} display="flex" justifyContent="center" alignItems="center">
        <Typography className={classes.socialMediaSharedTitle}>
          Compartilhar:
        </Typography>

        <div className={classes.socialMediaButtonContainer}>
          <WhatsappShareButton
            title={shareData.title}
            url={shareData.url}
            windowWidth={800}
          >
            <WhatsappIcon size={30} round />
          </WhatsappShareButton>

          <TelegramShareButton
            title={shareData.title}
            url={shareData.url}
            windowWidth={800}
          >
            <TelegramIcon size={30} round />
          </TelegramShareButton>

          <FacebookShareButton
            quote={shareData.title}
            url={shareData.url}
            windowWidth={800}
          >
            <FacebookIcon size={30} round />
          </FacebookShareButton>

          <TwitterShareButton
            title={shareData.title}
            url={shareData.url}
            windowWidth={800}
          >
            <TwitterIcon size={30} round />
          </TwitterShareButton>
        </div>
      </Box>
    );
  }

  function renderShareButonsInMobile() {
    const { address, services } = apiData;
    const isServicesNull = services.filter((service) => {
      return service.Valor !== '0,00';
    });

    if (
      address.origin.Logradouro === 'CEP inexistente' ||
      address.destination.Logradouro === 'CEP inexistente' ||
      isServicesNull.length === 0
    ) {
      return <div />;
    }

    return (
      <Box
        mb={3}
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        <Typography className={classes.socialMediaSharedTitle}>
          Compartilhar:
        </Typography>

        <Button
          className={classes.sharedButton}
          variant="contained"
          disableElevation
          onClick={() => shareTextByMobile()}
        >
          Texto
        </Button>

        <Button
          className={classes.sharedButton}
          variant="contained"
          disableElevation
          onClick={() => shareImageByMobile()}
        >
          Imagem
        </Button>
      </Box>
    );
  }

  function shareTextByMobile() {
    const shareData = mountSharedMessage();

    if (navigator.share) {
      navigator.share({ text: shareData.title, url: shareData.url });
    }
  }

  function shareImageByMobile() {
    const element = document.querySelector('#capture');

    element.setAttribute('style', 'display: block');

    toPng(element, { backgroundColor: '#ffffff' }).then((dataUrl) => {
      element.setAttribute('style', 'display: none');

      fetch(dataUrl).then((res) => {
        res.arrayBuffer().then((buf) => {
          const file = new File([buf], 'image_data_url.jpg', {
            type: 'image/jpeg',
          });
          const shareData = mountSharedMessage();

          file.arrayBuffer = buf;

          if (navigator.share) {
            navigator.share({
              url: shareData.url,
              files: [file],
            });
          }
        });
      });
    });
  }

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

        {isDesktop
          ? renderSocialMediaShareButtonsInDesktop()
          : renderShareButonsInMobile()}

        <Grid className={classes.servicesHeader} container>
          <Grid item xs={3} sm={3}>
            <Typography variant="h3">Tipo</Typography>
          </Grid>

          <Grid item xs={4} sm={4}>
            <Typography variant="h3">Prazo</Typography>
          </Grid>

          <Grid item xs={5} sm={4}>
            <Typography variant="h3" align="left">
              Total
            </Typography>
          </Grid>
        </Grid>

        <Grid container>{renderServiceItems(apiData.services)}</Grid>

        {renderServiceAddress(apiData.address)}
      </DialogContent>

      <div id="capture" style={{ display: 'none' }}>
        <DialogTitle disableTypography>
          <Typography variant="h6" align="center">
            precoseprazos.com.br
          </Typography>
        </DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <Box mb={3} display="flex" justifyContent="center">
            <img
              className={classes.adPlaceholderImage}
              src={AdPlaceholder}
              alt="ad-placeholder"
            />
          </Box>

          <Grid className={classes.servicesHeader} container>
            <Grid item xs={3} sm={3}>
              <Typography variant="h3">Tipo</Typography>
            </Grid>

            <Grid item xs={4} sm={4}>
              <Typography variant="h3">Prazo</Typography>
            </Grid>

            <Grid item xs={5} sm={4}>
              <Typography variant="h3" align="left">
                Total
              </Typography>
            </Grid>
          </Grid>

          <Grid container>{renderServiceItems(apiData.services)}</Grid>

          <Box mt={2}>
            <Typography>
              <strong>ORIGEM: </strong>
              {apiData.address.origin.zipCode}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography>
              <strong>DESTINO: </strong>
              {apiData.address.destination.zipCode}
            </Typography>
          </Box>
        </DialogContent>
      </div>
    </Dialog>
  );
}

export default CalculateShippingDialog;
