import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%',
  },
  textFieldLabel: {
    [theme.breakpoints.down('sm')]: {
      '& > label': {
        fontSize: 14,
      },
    },
  },
  dimensionsErrorMessage: {
    fontSize: 12,
  },
  accordionSummary: {
    padding: 0,
    paddingTop: 18,
  },
  accordionDetails: {
    padding: 0,
    flexDirection: 'column',
  },
  valueStatementText: {
    marginRight: 14,
  },
  calculateShippingButton: {
    color: theme.palette.white,
    background: 'linear-gradient(to right, #ffe633 0%, #ffc400 51%, #F09819)',
    fontSize: 16,
  },
}));

export default useStyles;
