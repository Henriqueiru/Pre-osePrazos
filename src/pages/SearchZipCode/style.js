import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 8,
    marginLeft: 'auto',
    marginBottom: 80,
    marginRight: 'auto',
  },
  title: {
    color: theme.palette.grey[900],
    fontSize: 18,
    fontWeight: 700,
  },
  searchButton: {
    color: theme.palette.white,
    background: 'linear-gradient(to right, #ffe633 0%, #ffc400 51%, #F09819)',
  },
}));

export default useStyles;
