import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  carouselRoot: {
    width: '100%',
    height: '100%',
    '& .slide': {
      background: 'transparent',
    },
    '& .control-arrow': {
      background: 'transparent !important',
    },
    '& .control-prev': {
      '&::before': {
        borderRight: '8px solid #323232 !important',
      },
    },
    '& .control-next': {
      '&::before': {
        borderLeft: '8px solid #323232 !important',
      },
    },
  },
  sliderContentImage: {
    width: '100%',
    height: 140,
  },
  sliderContentText: {
    marginTop: 30,
  },
  sliderContentButton: {
    marginTop: 15,
    textTransform: 'capitalize',
    background: 'rgb(0, 65, 105)',
    color: '#fff',
  },
}));

export default useStyles;
