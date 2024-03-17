import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';
import Layout from './router/Layout';
import './styles/App.scss'

function App() {
  return (
    <div>
     <BrowserRouter>
      <PrimeReactProvider >
      <Layout/>
      </PrimeReactProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
