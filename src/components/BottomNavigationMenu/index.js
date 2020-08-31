import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router-dom';

import {
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Box,
} from '@material-ui/core';

import AdPlaceholder from '~/assets/image/ad-placeholder-320x100.png';
import Banner01 from '~/assets/image/banner.gif';
import Pages from '~/constants/pages';

import { BlogDialog } from './components';
import useStyles from './style';

function BottomNavigationMenu() {
  const classes = useStyles();
  const navigate = useNavigate();
  const items = [
    { id: 1, image: Banner01, link: 'https://www.lipsum.com/' },
    { id: 2, image: AdPlaceholder, link: 'https://www.lipsum.com/' },
    { id: 3, image: AdPlaceholder, link: 'https://www.lipsum.com/' },
    { id: 4, image: AdPlaceholder, link: 'https://www.lipsum.com/' },
    { id: 5, image: AdPlaceholder, link: 'https://www.lipsum.com/' },
  ];

  const [blogUrl, setBlogUrl] = useState(null);
  const [openBlogDialog, setOpenBlogDialog] = useState(false);

  useEffect(() => {
    if (blogUrl) {
      setOpenBlogDialog(true);
    }
  }, [blogUrl]);

  function renderBottomNavigationItems(pages) {
    return pages.map((page) => {
      return (
        <BottomNavigationAction
          className={classes.bottomNavigationAction}
          key={page.id}
          label={page.title}
          icon={page.icon}
          onClick={() => navigate(page.href)}
        />
      );
    });
  }

  function renderCarouselItems() {
    const strItems = randomCarouselItems(items);

    return strItems.map((item) => (
      <Box key={item.id} onClick={() => setBlogUrl(item)}>
        <img src={item.image} alt={`ad${item.id}`} />
      </Box>
    ));
  }

  function randomCarouselItems(args) {
    const newData = args;

    for (let i = 0; i < newData.length; i += 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [newData[i], newData[j]] = [newData[j], newData[i]];
    }

    return newData;
  }

  function closeBlogDialog() {
    setBlogUrl(null);
    setOpenBlogDialog(false);
  }

  return (
    <>
      <AppBar className={classes.appBar} position="fixed" color="primary">
        <Toolbar className={classes.toolBar}>
          <div className={classes.bottomNavigation}>
            {renderBottomNavigationItems(Pages)}
          </div>

          <Carousel
            className={classes.carouselRoot}
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            showArrows={false}
            interval={2000}
            autoPlay
            infiniteLoop
          >
            {renderCarouselItems()}
          </Carousel>
        </Toolbar>
      </AppBar>

      {openBlogDialog && (
        <BlogDialog
          open={openBlogDialog}
          close={closeBlogDialog}
          blog={blogUrl}
        />
      )}
    </>
  );
}

export default BottomNavigationMenu;
