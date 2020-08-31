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
    marginBottom: 10,
  },
  subtitle: {
    color: theme.palette.grey[900],
    fontSize: 14,
    fontWeight: 700,
  },
  fullWidth: {
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
  formGroupContainer: {
    flexWrap: 'noWrap',
    flexDirection: 'row',
    '& > label': {
      width: '50%',
    },
    '& > label:last-child': {
      marginRight: 0,
    },
  },
  saveButton: {
    color: theme.palette.white,
    background: 'linear-gradient(to right, #ffe633 0%, #ffc400 51%, #F09819)',
  },
}));

export default useStyles;
