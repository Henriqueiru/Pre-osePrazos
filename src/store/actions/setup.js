const setSetup = (value) => ({
  type: 'SET_SETUP',
  setup: value,
});

const cleanSetup = () => ({
  type: 'CLEAN_SETUP',
});

export { setSetup, cleanSetup };
