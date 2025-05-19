import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { QuickServeRouteItemRoot } from "../../shared/interfaces/routes";

const Index = lazy(() => import("."));
const Resultats = lazy(() => import("./resultats"));
const Paiement = lazy(() => import("./paiement"));

export const LivraisonExpressRoutes = {
  $path: "livraison-express",
  $element: <Outlet />,
  index: {
    $path: "",
    $element: <Index />,
    $index: true,
  },
  resultats: {
    $path: "resultats",
    $element: <Resultats />,
  },
  paiement: {
    $path: "paiement",
    $element: <Paiement />
  }
} as QuickServeRouteItemRoot;
