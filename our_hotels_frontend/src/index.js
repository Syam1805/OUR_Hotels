import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css'; // Ensure animations are available

console.log('Index rendering');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BookingProvider>
        <App />
        <ToastContainer position="top-right" autoClose={3000} />
      </BookingProvider>
    </AuthProvider>
  </React.StrictMode>
);