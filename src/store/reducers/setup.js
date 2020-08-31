const initialState = {
  generalSetup: {
    serviceType: {
      sedex1012: false,
      sedexToday: false,
      miniUploads: false,
      largeFormats: false,
    },
    priceTableType: 'atSight',
    contractType: 'B',
    contractPrice: '20',
    handlingFee: '0',
  },
  packagingSetup: {
    serviceCode: ['04510', '04014'],
    tables: ['av'],
  },
};

export const setup = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SETUP':
      return action.setup;
    case 'CLEAN_SETUP':
      return initialState;
    default:
      return state;
  }
};
