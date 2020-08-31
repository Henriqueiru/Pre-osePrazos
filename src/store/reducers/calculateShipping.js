const initialState = {
  order: {
    objectFormat: 1,
    weight: 0.299,
    packagingKey: '',
    additionalService: {
      ownHands: false,
      acknowledgmentOfReceipt: false,
      valueStatement: false,
    },
  },
  printed: {
    objectFormat: 1,
    weight: 0.19,
    packagingKey: '',
    additionalService: {
      lowcostRegistry: false,
      nationalRegistry: false,
      ownHands: false,
      acknowledgmentOfReceipt: false,
      valueStatement: false,
    },
  },
  zipsCodes: {
    origin: '',
    destination: '',
  },
};

export const calculateShipping = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CALCULATE_SHIPPING':
      return action.calculateShipping;
    case 'CLEAN_CALCULATE_SHIPPING':
      return {
        ...state,
        zipsCodes: { ...initialState.zipsCodes },
        [action.objectFormat]: initialState[action.objectFormat],
      };
    default:
      return state;
  }
};
