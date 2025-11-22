import { createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import fs from "node:fs";
import { c as createServerFn, a as createServerRpc } from "../server.js";
const appCss = "/bi-design/assets/styles-DrD4fNmf.css";
const initialState = {
  theme: "system",
  setTheme: () => null
};
const ThemeProviderContext = createContext(initialState);
function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => defaultTheme);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: (theme2) => {
      localStorage.setItem(storageKey, theme2);
      setTheme(theme2);
    }
  };
  return /* @__PURE__ */ jsx(ThemeProviderContext.Provider, { ...props, value, children });
}
const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  return context;
};
const Route$f = createRootRoute({
  head: () => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: "BigIron Design System"
    }],
    links: [{
      rel: "stylesheet",
      href: appCss
    }]
  }),
  shellComponent: RootDocument
});
function RootDocument({
  children
}) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(ThemeProvider, { defaultTheme: "light", storageKey: "vite-ui-theme", children }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$d = () => import("./voice-and-tone-Cb7KBlYD.js");
const Route$e = createFileRoute("/voice-and-tone")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./typography-DH1f4XSu.js");
const Route$d = createFileRoute("/typography")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./target-CNEfh2hs.js");
const Route$c = createFileRoute("/target")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./standards-Dt_4YkET.js");
const Route$b = createFileRoute("/standards")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./personas-DxKsLkRr.js");
const Route$a = createFileRoute("/personas")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./patterns-BTClImzJ.js");
const Route$9 = createFileRoute("/patterns")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./imagery-CiECLfxT.js");
const Route$8 = createFileRoute("/imagery")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./identity-CdggBUNV.js");
const Route$7 = createFileRoute("/identity")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./forms-CAH_Lfaz.js");
const Route$6 = createFileRoute("/forms")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./figma-D08mj-pG.js");
const Route$5 = createFileRoute("/figma")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./elements-BR8uRJYc.js");
const Route$4 = createFileRoute("/elements")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-DAD7uulh.js");
const Route$3 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const Route$2 = createFileRoute("/api/demo-names")({
  server: {
    handlers: {
      GET: () => {
        return new Response(JSON.stringify(["Alice", "Bob", "Charlie"]), {
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    }
  }
});
const $$splitComponentImporter$1 = () => import("./demo.start.server-funcs-IgYjyqmr.js");
const filePath = "todos.json";
async function readTodos() {
  return JSON.parse(await fs.promises.readFile(filePath, "utf-8").catch(() => JSON.stringify([{
    id: 1,
    name: "Get groceries"
  }, {
    id: 2,
    name: "Buy a new phone"
  }], null, 2)));
}
const getTodos_createServerFn_handler = createServerRpc("src_routes_demo_start_server-funcs_tsx--getTodos_createServerFn_handler", (opts, signal) => {
  return getTodos.__executeServer(opts, signal);
});
const getTodos = createServerFn({
  method: "GET"
}).handler(getTodos_createServerFn_handler, async () => await readTodos());
const Route$1 = createFileRoute("/demo/start/server-funcs")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  loader: async () => await getTodos()
});
const $$splitComponentImporter = () => import("./demo.start.api-request-Ve_rBhMG.js");
const Route = createFileRoute("/demo/start/api-request")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const VoiceAndToneRoute = Route$e.update({
  id: "/voice-and-tone",
  path: "/voice-and-tone",
  getParentRoute: () => Route$f
});
const TypographyRoute = Route$d.update({
  id: "/typography",
  path: "/typography",
  getParentRoute: () => Route$f
});
const TargetRoute = Route$c.update({
  id: "/target",
  path: "/target",
  getParentRoute: () => Route$f
});
const StandardsRoute = Route$b.update({
  id: "/standards",
  path: "/standards",
  getParentRoute: () => Route$f
});
const PersonasRoute = Route$a.update({
  id: "/personas",
  path: "/personas",
  getParentRoute: () => Route$f
});
const PatternsRoute = Route$9.update({
  id: "/patterns",
  path: "/patterns",
  getParentRoute: () => Route$f
});
const ImageryRoute = Route$8.update({
  id: "/imagery",
  path: "/imagery",
  getParentRoute: () => Route$f
});
const IdentityRoute = Route$7.update({
  id: "/identity",
  path: "/identity",
  getParentRoute: () => Route$f
});
const FormsRoute = Route$6.update({
  id: "/forms",
  path: "/forms",
  getParentRoute: () => Route$f
});
const FigmaRoute = Route$5.update({
  id: "/figma",
  path: "/figma",
  getParentRoute: () => Route$f
});
const ElementsRoute = Route$4.update({
  id: "/elements",
  path: "/elements",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$3.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const ApiDemoNamesRoute = Route$2.update({
  id: "/api/demo-names",
  path: "/api/demo-names",
  getParentRoute: () => Route$f
});
const DemoStartServerFuncsRoute = Route$1.update({
  id: "/demo/start/server-funcs",
  path: "/demo/start/server-funcs",
  getParentRoute: () => Route$f
});
const DemoStartApiRequestRoute = Route.update({
  id: "/demo/start/api-request",
  path: "/demo/start/api-request",
  getParentRoute: () => Route$f
});
const rootRouteChildren = {
  IndexRoute,
  ElementsRoute,
  FigmaRoute,
  FormsRoute,
  IdentityRoute,
  ImageryRoute,
  PatternsRoute,
  PersonasRoute,
  StandardsRoute,
  TargetRoute,
  TypographyRoute,
  VoiceAndToneRoute,
  ApiDemoNamesRoute,
  DemoStartApiRequestRoute,
  DemoStartServerFuncsRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$1 as R,
  router as r,
  useTheme as u
};
