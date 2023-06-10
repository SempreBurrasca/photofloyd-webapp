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
  filters: {
    tags: false,
    client: false,
    label: false,
    data: false,
    fotografo: false,
  },
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
    case "SET_FILTER_TAGS":
      return {
        ...state,
        filters: {
          ...state.filters,
          tags: action.tags,
        },
      };
    case "SET_FILTER_CLIENT":
      return {
        ...state,
        filters: {
          ...state.filters,
          client: action.client,
        },
      };
    case "SET_FILTER_LABEL":
      return {
        ...state,
        filters: {
          ...state.filters,
          label: action.label,
        },
      };
    case "SET_FILTER_DATA":
      return {
        ...state,
        filters: {
          ...state.filters,
          data: action.data,
        },
      };
      case "SET_FILTER_FOTOGRAFO":
      return {
        ...state,
        filters: {
          ...state.filters,
          fotografo: action.fotografo,
        },
      };
    default:
      return state;
  }
}
