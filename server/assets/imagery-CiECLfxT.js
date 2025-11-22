import { jsxs, jsx } from "react/jsx-runtime";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import "@tanstack/react-router";
import "lucide-react";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-separator";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "./router-CWjXTlHk.js";
import "node:fs";
import "../server.js";
import "@tanstack/history";
import "@tanstack/router-core/ssr/client";
import "@tanstack/router-core";
import "node:async_hooks";
import "@tanstack/router-core/ssr/server";
import "h3";
import "tiny-invariant";
import "seroval";
import "@tanstack/react-router/ssr/server";
function App() {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }),
          /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Visual Design" }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Imagery" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsx("div", { className: "space-y-8 p-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Imagery" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2 mb-4", children: "Use images that are clear, well-lit, and free of excessive filters or distracting backgrounds. Maintain consistency in style—favor modern, minimal, and authentic visuals that support content and enhance user understanding. Avoid generic stock photos, overly staged scenes, or images that clash with brand colors. Always ensure images are accessible (provide alt text), optimized for performance, and used in accordance with copyright and licensing guidelines." }),
        /* @__PURE__ */ jsx(Separator, { className: "my-4" }),
        /* @__PURE__ */ jsx("p", { className: "text-bold my-2", children: "Images to come ..." })
      ] }) }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
