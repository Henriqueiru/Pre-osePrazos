const setPackaging = (value) => ({
  type: 'SET_PACKAGING',
  packaging: value,
});

const cleanPackaging = () => ({
  type: 'CLEAN_PACKAGING',
});

export { setPackaging, cleanPackaging };
