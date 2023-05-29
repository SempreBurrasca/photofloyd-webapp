import { useReducer } from "react";

export const initialState = {
  // define your initial state here
  isAuth: false,
  userId: null,
  taxes: null,
  isUpload: false,
  statusUpload: {
    label: "Caricamento in corso",
    max: 100,
    current: 0,
  },
  currentPostazione: null,
  fotoPostazione: [],
  clientView: {
    isClientView: false,
    fotos: [],
  },
};

// reducer.js
export function reducer(state, action) {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        isAuth: action.isAuth,
        userId: action.userId,
      };
    case "SET_TAXES":
      return {
        ...state,
        taxes: action.taxes,
      };
    case "SET_UPLOAD_STATUS":
      return {
        ...state,
        statusUpload: action.statusUpload,
      };
    case "SET_IS_UPLOAD":
      return {
        ...state,
        isUpload: action.isUpload,
      };
    case "SET_CURRENT_POSTAZIONE":
      return {
        ...state,
        currentPostazione: action.currentPostazione,
      };
    case "SET_FOTO_POSTAZIONE":
      return {
        ...state,
        fotoPostazione: action.fotoPostazione,
      };
    case "SET_CLIENT_VIEW":
      return {
        ...state,
        clientView: action.clientView,
      };
    default:
      return state;
  }
}
