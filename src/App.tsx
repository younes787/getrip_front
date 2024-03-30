import React from "react";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import Layout from "./router/Layout";
import "./styles/App.scss";
import { AuthProvider } from "./AuthContext/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <PrimeReactProvider>
            <Layout />
          </PrimeReactProvider>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
