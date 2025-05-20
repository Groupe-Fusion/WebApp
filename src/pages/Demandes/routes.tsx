import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { QuickServeRouteItemRoot } from "../../shared/interfaces/routes";

const Index = lazy(() => import("."));

export const DemandesRoutes = {
  $path: "demandes",
  $element: <Outlet />,
  index: {
    $path: "",
    $element: <Index />,
    $index: true,
  }
} as QuickServeRouteItemRoot;
