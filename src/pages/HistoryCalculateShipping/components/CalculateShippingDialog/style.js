import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  dialog: {
    [theme.breakpoints.down('xs')]: {
      '& .MuiDialog-paper': {
        width: '100%',
        margin: 10,
      },
    },
  },
  dialogTitle: {
    margin: 0,
    padding: 16,
  },
  closeButton: {
    color: theme.palette.grey[500],
    fontSize: 18,
    position: 'absolute',
    top: 12,
    right: 8,
  },
  dialogContent: {
    [theme.breakpoints.down('xs')]: {
      paddingRight: 10,
      paddingLeft: 10,
    },
  },
  adPlaceholderImage: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  socialMediaSharedTitle: {
    marginRight: 10,
  },
  socialMediaButtonContainer: {
    '& > *': {
      paddingRight: '8px !important',
      outline: 'none',
    },
  },
  sharedButton: {
    color: theme.palette.white,
    background: theme.palette.secondary.main,
    textTransform: 'capitalize',
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
  servicesHeader: {
    '& > div > *': {
      color: theme.palette.grey['900'],
      fontSize: 16,
      fontWeight: 700,
    },
    '& > div:nth-child(2) > h3': {
      marginLeft: 37,
    },
    '& > div:nth-child(3) > h3': {
      marginLeft: 27,
    },
    [theme.breakpoints.down('xs')]: {
      '& > div:nth-child(2) > h3': {
        marginLeft: 15,
      },
      '& > div:nth-child(3) > h3': {
        marginLeft: 5,
      },
    },
  },
  accordionSummary: {
    width: '100%',
    padding: 0,
  },
  accordionSummaryBadge: {
    width: '100%',
    '& > .MuiBadge-badge': {
      color: theme.palette.info.main,
      fontSize: 16,
      top: 11,
      right: 4,
      margin: 0,
      padding: 0,
      zIndex: 'auto',
      background: 'none',
    },
  },
  accordionSummaryTextHeader: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  accordionDetails: {
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  accordionDetailsItems: {
    width: '100%',
    display: 'flex',
    '& > p:first-child': {
      width: '63.55%',
    },
    [theme.breakpoints.down('xs')]: {
      '& > p': {
        fontSize: 13,
      },
      '& > p:first-child': {
        width: '60.55%',
      },
    },
  },
  accordionDetailsItemsSubtitle: {
    [theme.breakpoints.down('xs')]: {
      '& > p': {
        fontSize: 13,
      },
    },
  },
}));

export default useStyles;
