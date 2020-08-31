const setCalculateShipping = (value) => ({
  type: 'SET_CALCULATE_SHIPPING',
  calculateShipping: value,
});

const cleanCalculateShipping = (type) => ({
  type: 'CLEAN_CALCULATE_SHIPPING',
  objectFormat: type,
});

export { setCalculateShipping, cleanCalculateShipping };
