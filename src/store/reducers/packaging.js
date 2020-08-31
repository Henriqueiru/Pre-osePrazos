const initialState = {
  datasets: [
    {
      id: 1,
      name: 'Correios Tipo 1',
      format: 1,
      price: '500',
      dimensions: { height: '9,0', width: '13,5', length: '18,0' },
    },
    {
      id: 2,
      name: 'Correios Tipo 2',
      format: 1,
      price: '630',
      dimensions: { height: '9,0', width: '18,0', length: '27,0' },
    },
    {
      id: 3,
      name: 'Correios Tipo 3',
      format: 1,
      price: '815',
      dimensions: { height: '13,5', width: '22,5', length: '27,0' },
    },
    {
      id: 4,
      name: 'Correios Tipo 4',
      format: 1,
      price: '1605',
      dimensions: { height: '18,0', width: '27,0', length: '36,0' },
    },
    {
      id: 5,
      name: 'Correios Tipo 5',
      format: 1,
      price: '1735',
      dimensions: { height: '27,0', width: '36,0', length: '54,0' },
    },
    {
      id: 6,
      name: 'Correios Tipo 6',
      format: 1,
      price: '1745',
      dimensions: { height: '27,0', width: '27,0', length: '36,0' },
    },
    {
      id: 7,
      name: 'Correios Tipo 7',
      format: 1,
      price: '600',
      dimensions: { height: '4,0', width: '28,0', length: '36,0' },
    },
  ],
  id: 7,
};

export const packaging = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PACKAGING':
      return action.packaging;
    case 'CLEAN_PACKAGING':
      return initialState;
    default:
      return state;
  }
};
