import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { QuickServeRouteItem } from "../shared/interfaces/routes";
import App from ".";
import { LivraisonExpressRoutes } from "../pages/LivraisonExpress/routes";
import { DemandesRoutes } from "../pages/Demandes/routes";
import { SuiviRoutes } from "../pages/Suivi/routes";

const Home = lazy(() => import("../pages/Home"));
const SignIn = lazy(() => import("../pages/auth/signIn"));
const SignUp = lazy(() => import("../pages/auth/signUp"));

export const AuthRoutes = {
  $path: "/auth",
  $element: <Outlet />,

  signIn: {
    $path: "/signin",
    $element: <SignIn />,
  },
  signUp: {
    $path: "/signup",
    $element: <SignUp />,
  },
} as QuickServeRouteItem & {
  signIn: QuickServeRouteItem;
  signUp: QuickServeRouteItem;
};

export const AppRoutes = {
  $path: "",
  $element: <App />,

  home: {
    $path: "",
    $element: <Home />,
  },

  livraisonExpress: LivraisonExpressRoutes,
  demandes: DemandesRoutes,
  suivi: SuiviRoutes,
} as QuickServeRouteItem & {
  home: QuickServeRouteItem;
  livraisonExpress: typeof LivraisonExpressRoutes;
  demandes: typeof DemandesRoutes;
  suivi: typeof SuiviRoutes;
};
