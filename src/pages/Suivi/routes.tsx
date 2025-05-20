import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { QuickServeRouteItemRoot } from "../../shared/interfaces/routes";

const Index = lazy(() => import("."));

export const SuiviRoutes = {
  $path: "suivi",
  $element: <Outlet />,
  index: {
    $path: "",
    $element: <Index />,
    $index: true,
  }
} as QuickServeRouteItemRoot;
