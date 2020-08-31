import { combineReducers } from 'redux';

import { calculateShipping } from './calculateShipping';
import { historyCalculateShipping } from './historyCalculateShipping';
import { packaging } from './packaging';
import { setup } from './setup';

export const Reducers = combineReducers({
  calculateShipping,
  historyCalculateShipping,
  packaging,
  setup,
});
