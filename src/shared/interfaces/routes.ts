import { JSX } from "react/jsx-runtime";

export interface QuickServeRouteItem {
  // les propriétés sont préfixées par `$` pour différencier celles de l'objet, des routes enfant.
  /**
   * Relative (from its parent) path of that route
   */
  $path: string;


  /**
   * Label to display in the nav
   */
  $label?: string;

  /**
   * Élément de rendu de la route
   */
  $element: JSX.Element;
}

export type QuickServeRouteItemRoot = QuickServeRouteItem & {
  index: QuickServeRouteItemIndex;
};
export type QuickServeRouteItemIndex = QuickServeRouteItem & { $index: boolean };

export interface QuickServeRoutes extends Record<string, QuickServeRoute> { }
export type QuickServeRoute = QuickServeRouteItem | QuickServeRoutes;
