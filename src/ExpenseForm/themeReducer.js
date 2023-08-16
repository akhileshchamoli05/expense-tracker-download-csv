// themeReducer.js

import { TOGGLE_THEME } from './themeActionTypes';

export const themeReducer = (state, action) => {
    
  switch (action.type) {
   
    case TOGGLE_THEME:
      return state === 'light' ? 'dark' : 'light';
    default:
      return state;
  }
};
