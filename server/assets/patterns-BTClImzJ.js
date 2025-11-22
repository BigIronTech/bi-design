import { jsxs, jsx } from "react/jsx-runtime";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle, k as Button } from "./button-toggle-C0d9vO61.js";
import { B as Badge } from "./badge-dKrRDUnq.js";
import { C as Card, a as CardHeader, c as CardDescription, b as CardTitle, d as CardContent } from "./card-B8Skkm8y.js";
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
function ComponentSection({
  title,
  description,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold tracking-tight", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: description })
    ] }),
    children
  ] });
}
const ComponentDemo = ({
  title,
  description,
  children,
  code
}) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
  /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: description })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-6 bg-background", children }),
  code && /* @__PURE__ */ jsxs("details", { className: "text-xs", children: [
    /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-muted-foreground hover:text-foreground", children: "View code" }),
    /* @__PURE__ */ jsx("pre", { className: "mt-2 p-3 bg-muted rounded text-xs overflow-auto", children: /* @__PURE__ */ jsx("code", { children: code }) })
  ] })
] });
function App() {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }),
          /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Development" }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Patterns" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-auto w-full min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Layout Patterns" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Common UI patterns and compositions. Use these patterns to organize content, guide user flow, and provide consistent interaction across your application. Each pattern should be responsive, accessible, and easy to customize for different use cases." })
        ] }),
        /* @__PURE__ */ jsx(Separator, {}),
        /* @__PURE__ */ jsx("div", { className: "space-y-8", children: /* @__PURE__ */ jsxs(ComponentSection, { title: " ", description: " ", children: [
          /* @__PURE__ */ jsx(ComponentDemo, { title: "Header Pattern", children: /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 space-y-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Page Title" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Page description" })
            ] }),
            /* @__PURE__ */ jsx(Button, { children: "Primary Action" })
          ] }) }) }),
          /* @__PURE__ */ jsxs(ComponentDemo, { title: "Stats Grid", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [{
              label: "Total Users",
              value: "2,345",
              change: "+12%"
            }, {
              label: "Revenue",
              value: "$45,678",
              change: "+8%"
            }, {
              label: "Growth",
              value: "23%",
              change: "+3%"
            }].map((stat, index) => /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { className: "pb-2", children: [
                /* @__PURE__ */ jsx(CardDescription, { children: stat.label }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl", children: stat.value })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: stat.change }) })
            ] }, index)) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "Quick Stats" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-gray-900 mb-1", children: "2,340" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Total items" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "Recent Activity" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-gray-900 mb-1", children: "12" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "This week" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-medium text-gray-900 mb-3", children: "Performance" }),
                /* @__PURE__ */ jsx("p", { className: "text-3xl font-semibold text-gray-900 mb-1", children: "98%" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Success rate" })
              ] })
            ] })
          ] })
        ] }) })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
