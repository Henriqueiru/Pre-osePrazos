import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  toolBar: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  bottomNavigation: {
    width: '100%',
    maxWidth: 672,
    display: 'flex',
    justifyContent: 'center',
  },
  bottomNavigationAction: {
    color: theme.palette.secondary.main,
    fontSize: 16,
    '& .MuiBottomNavigationAction-label': {
      marginTop: 5,
      opacity: 1,
      transitionDelay: '0.1s',
    },
  },
  carouselRoot: {
    width: 320,
    height: 100,
    cursor: 'pointer',
  },
}));

export default useStyles;
