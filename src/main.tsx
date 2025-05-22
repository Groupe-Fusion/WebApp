import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./App/Router";
import { UserProvider } from "./context/UserContext";
import { LocationProvider } from "./context/LocationContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <LocationProvider>
        <Router />
      </LocationProvider>
    </UserProvider>
  </StrictMode>
);
