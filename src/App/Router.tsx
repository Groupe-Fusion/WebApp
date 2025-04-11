import {
    createBrowserRouter, RouteObject,
    RouterProvider,
  } from "react-router-dom";
  import { Suspense } from "react";
  import { JSX } from "react/jsx-runtime";
import LoadingPage from "../pages/LoadingPage";
import { QuickServeRoute, QuickServeRoutes, QuickServeRouteItem } from "../shared/interfaces/routes";
  import { AppRoutes } from "./AppRoutes";
  
  const AppRouterRoutes = [
    transformRoutes(AppRoutes),
  ];
  
  const router = createBrowserRouter(AppRouterRoutes);
  
  function Router() {
    return <RouterProvider router={router}/>;
  }
  
  export default Router;
  
  function LazyRoute({ children }: Readonly<{ children: JSX.Element }>) {
    return <Suspense fallback={<LoadingPage />}>{children}</Suspense>;
  }
  
  function transformRoutes(root: QuickServeRoute): RouteObject {
    const isRouteItem = (route: QuickServeRoute) =>
      Object.getOwnPropertyNames(route).some((n) => n.startsWith("$"));
  
    return transformRouteInternal(root, "");
  
    function transformRouteInternal(route: QuickServeRoute, parentPath: string) {
      if (!route) {
        return {};
      }
  
      if (!isRouteItem(route)) {
        console.warn("not supported");
        return {};
      }
  
      const routeItem = route as QuickServeRouteItem;
  
      // Note : les permissions du parent sont automatiquement prises en compte via le Router et les AuthenticatedRoutes
      const slash =
        parentPath.endsWith("/") || routeItem.$path.startsWith("/") ? "" : "/";
      routeItem.$path = parentPath + slash + routeItem.$path;
  
      const childRoutes = getChildRoutes(route as QuickServeRoutes, routeItem.$path);
  
      const element = <LazyRoute>{routeItem.$element}</LazyRoute>;
  
      return {
        path: route.$path,
        element: element,
        children: childRoutes.length === 0 ? undefined : childRoutes,
      } as RouteObject;
    }
  
    function getChildRoutes(route: QuickServeRoutes, parentPath: string) {
      if (!route) {
        return [];
      }
  
      const childRoutes = new Array<RouteObject>();
  
      for (const child in route) {
        // on peut être sur un élément qui est à la fois RouteItem et Routes
        // donc on ne tient pas compte des propriétés '$' (celles de RouteItem)
        // et on exclue aussi les valeurs null|undefined
        if (child.startsWith("$") || !route[child]) {
          continue;
        }
  
        // si l'enfant est un RouteItem, on le transforme en "route"
        // sinon, c'est un Routes, donc on va récupérer ses "child routes" et les
        // considérer comme les "child routes" de l'élément en cours (= on descend d'un niveau)
        if (isRouteItem(route[child])) {
          childRoutes.push(transformRouteInternal(route[child], parentPath));
        } else {
          childRoutes.push(
            ...getChildRoutes(route[child] as QuickServeRoutes, parentPath)
          );
        }
      }
  
      return childRoutes;
    }
  }
  