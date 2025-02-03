import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and Provider
import "./index.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration.js';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import StoreContextProvider from "./context/context.js";


// Call the register function


// Create a QueryClient instance
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Measure performance (optional)
reportWebVitals();

serviceWorkerRegistration.register();