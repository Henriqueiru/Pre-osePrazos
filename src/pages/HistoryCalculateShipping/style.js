import { lighten, makeStyles } from '@material-ui/core/styles';

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
  toolbarContainer: {
    color: theme.palette.error.main,
    backgroundColor: lighten(theme.palette.error.light, 0.85),
    paddingLeft: 16,
    paddingRight: 8,
  },
  toolbarContainerHidden: {
    display: 'none',
  },
  toolbarContainerTitle: {
    flex: '1 1 100%',
  },
  toolbarContainerIcon: {
    '& > span > svg': {
      fontSize: 17,
    },
  },
  table: {
    minWidth: '100%',
    '& .Mui-selected': {
      backgroundColor: lighten(theme.palette.error.light, 0.85),
      '&:hover': {
        backgroundColor: lighten(theme.palette.error.light, 0.85),
      },
    },
  },
  tableCell: {
    '& > button': {
      fontSize: 17,
      color: theme.palette.info.main,
    },
    [theme.breakpoints.down('sm')]: {
      paddingRight: 8,
      paddingLeft: 0,
      '& .MuiTableCell-paddingCheckbox': {
        padding: 0,
      },
    },
  },
  tablePagination: {
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
      '& .MuiTablePagination-toolbar': {
        padding: 0,
      },
      '& .MuiTablePagination-selectRoot': {
        marginLeft: 0,
        marginRight: 3,
      },
      '& .MuiTablePagination-actions': {
        '& > button': {
          padding: 0,
        },
      },
    },
  },
}));

export default useStyles;
