import { lazy } from "react";
import { QuickServeRouteItem } from "../shared/interfaces/routes";
import App from ".";

const Home = lazy(() => import("../pages/Home"));

export const AppRoutes = {
  $path: "",
  $element: <App />,

  home: {
    $path: "",
    $element: <Home />,
  },

} as QuickServeRouteItem & {
  home: QuickServeRouteItem;
};
