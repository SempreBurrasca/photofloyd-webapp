import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


// TODO: Spostare i dati di configurazione come variabili env
const firebaseConfig = {
  apiKey: "AIzaSyD-HAWTDwbIIgfJaaxF6tUXPORXO4QWAvw",
  authDomain: "photofloyd-72ed0.firebaseapp.com",
  projectId: "photofloyd-72ed0",
  storageBucket: "photofloyd-72ed0.appspot.com",
  messagingSenderId: "270577410766",
  appId: "1:270577410766:web:52f1107cc8edc91779e69f",
  measurementId: "G-PQ248R8CZD"
};

// Inizializzo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
