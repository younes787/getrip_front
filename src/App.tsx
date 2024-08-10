import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter } from "react-router-dom";
import Layout from "./router/Layout";
import "./styles/App.scss";
import { AuthProvider } from "./AuthContext/AuthContext";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { LoadingProvider } from "./Services";

function App() {

  return (
    <div style={{height: '100%'}}>
      <LoadingProvider>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <BrowserRouter>
              <PrimeReactProvider>
                <Layout />
              </PrimeReactProvider>
            </BrowserRouter>
          </AuthProvider>
        </I18nextProvider>
      </LoadingProvider>
    </div>
  );
}

export default App;
