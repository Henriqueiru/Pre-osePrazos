import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'none',
    marginBottom: 16,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    [theme.breakpoints.down('sm')]: {
      minHeight: 35,
    },
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    [theme.breakpoints.down('sm')]: {
      fontSize: 16,
    },
  },
}));

export default useStyles;
