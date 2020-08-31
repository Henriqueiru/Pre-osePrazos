import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: 16,
    flex: 1,
  },
  iframeContainer: {
    width: '100%',
    height: '100%',
  },
  iframeRoot: {
    width: '100%',
    height: '100%',
    border: 0,
  },
}));

export default useStyles;
