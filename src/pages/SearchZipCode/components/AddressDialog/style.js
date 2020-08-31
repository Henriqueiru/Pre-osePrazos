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
  title: {
    color: theme.palette.grey[900],
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  addressContainer: {
    display: 'flex',
    '& > p:first-child': {
      width: '33.333333%',
    },
    '& > p:last-child': {
      width: '66.666667%',
      paddingLeft: 8,
    },
  },
  adPlaceholderImage: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

export default useStyles;
