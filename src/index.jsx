import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from './contexts/AuthContext';
import { keepAliveService } from './utils/keepAlive';
import "./styles/tailwind.css";
import "./styles/index.css";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

// Start keep-alive service in production
if (process.env.NODE_ENV === 'production') {
  keepAliveService.start();
  console.log('🚀 LifeLink Bangladesh - Keep-alive service initialized');
}
