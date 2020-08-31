import React, { forwardRef } from 'react';
import { Carousel } from 'react-responsive-carousel';

import {
  Dialog,
  Slide,
  DialogContent,
  Box,
  Typography,
  Button,
} from '@material-ui/core';

import undrawBusinessman from '~/assets/image/undraw_businessman_97x4.svg';
import undrawFireworks from '~/assets/image/undraw_fireworks_q5ji.svg';
import undrawOnlineMessaging from '~/assets/image/undraw_online_messaging_9ro6.svg';
import undrawSuperThankYout from '~/assets/image/undraw_super_thank_you_obwk.svg';

import useStyles from './style';

function WelcomeAlertDialog({ close, ...rest }) {
  const classes = useStyles();

  const sliderItems = [
    {
      id: 0,
      image: undrawFireworks,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    },
    {
      id: 1,
      image: undrawBusinessman,

      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    },
    {
      id: 2,
      image: undrawOnlineMessaging,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    },
    {
      id: 3,
      image: undrawSuperThankYout,
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting',
    },
  ];

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  function renderCarouselItems() {
    return sliderItems.map((item, index) => (
      <Box key={item.id}>
        <img
          className={classes.sliderContentImage}
          src={item.image}
          alt="undraw"
        />

        <Typography className={classes.sliderContentText}>
          {item.text}
        </Typography>

        {index === sliderItems.length - 1 && (
          <Button
            className={classes.sliderContentButton}
            variant="contained"
            onClick={() => close(false)}
          >
            Começar!
          </Button>
        )}
      </Box>
    ));
  }

  return (
    <Dialog
      maxWidth="xs"
      TransitionComponent={Transition}
      {...rest}
      fullWidth
      keepMounted
      onClose={() => close(false)}
    >
      <DialogContent>
        <Carousel
          className={classes.carouselRoot}
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
        >
          {renderCarouselItems()}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

export default WelcomeAlertDialog;
