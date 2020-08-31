import palette from '../palette';

export default {
  root: {
    '& label.Mui-focused': {
      color: palette.secondary.main,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: palette.secondary.main,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: palette.secondary.main,
      },
    },
  },
};
