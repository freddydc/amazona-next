import { createContext, useReducer } from 'react';
import Cookies from 'js-cookie';

export const StoreContext = createContext();

const initialState = {
  darkMode: Cookies.get('darkMode') === 'ON' ? true : false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    default:
      return state;
  }
}

const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
