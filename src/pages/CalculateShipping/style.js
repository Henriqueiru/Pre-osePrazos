import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 8,
    marginLeft: 'auto',
    marginBottom: 180,
    marginRight: 'auto',
  },
  saveButton: {
    color: theme.palette.white,
    background: theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  },
  clearButton: {
    color: theme.palette.white,
    background: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.error.dark,
    },
  },
  congratsAlertContainer: {
    bottom: 150,
  },
  congratsAlertContent: {
    '& > .swal2-html-container': {
      display: 'flex !important',
      flexDirection: 'column',
    },
    '& > .swal2-html-container > span:first-child': {
      fontSize: 20,
    },
    '& > .swal2-html-container > span:last-child': {
      fontSize: 16,
      marginTop: 10,
    },
  },
}));

export default useStyles;
