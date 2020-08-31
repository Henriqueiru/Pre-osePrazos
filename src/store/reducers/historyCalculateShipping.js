const initialState = {
  datasets: [],
  id: 0,
};

export const historyCalculateShipping = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_HISTORY_CALCULATE_SHIPPING':
      return action.historyCalculateShipping;
    default:
      return state;
  }
};
