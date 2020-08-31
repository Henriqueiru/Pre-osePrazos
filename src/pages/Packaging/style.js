import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 8,
    marginLeft: 'auto',
    marginBottom: 180,
    marginRight: 'auto',
  },
  title: {
    color: theme.palette.grey[900],
    fontSize: 18,
    fontWeight: 700,
  },
  subtitle: {
    color: theme.palette.grey[900],
    fontSize: 15,
    fontWeight: 700,
    paddingTop: 15,
    paddingBottom: 15,
  },
  fullWidth: {
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
  textFieldLabel: {
    [theme.breakpoints.down('sm')]: {
      '& > label': {
        fontSize: 14,
      },
    },
  },
  addButton: {
    color: theme.palette.white,
    background: 'linear-gradient(to right, #ffe633 0%, #ffc400 51%, #F09819)',
  },
  containerMyPackaging: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  myPackagingText: {
    color: theme.palette.grey[900],
    fontSize: 17,
    textTransform: 'capitalize',
    marginLeft: 10,
  },
  myPackagingEditButton: {
    color: theme.palette.info.main,
    fontSize: 18,
    '&:hover': {
      background: 'transparent',
    },
  },
  myPackagingDeleteButton: {
    color: theme.palette.error.main,
    fontSize: 18,
    padding: 0,
    marginLeft: 16,
    '&:hover': {
      background: 'transparent',
    },
  },
}));

export default useStyles;
