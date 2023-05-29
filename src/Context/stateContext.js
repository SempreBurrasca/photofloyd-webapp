// AuthContext.js
import React, { createContext, useReducer } from 'react';
import { initialState, reducer } from '../Reducers/reducer';


export const StateContext = createContext();

export function PhotofloydProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}
