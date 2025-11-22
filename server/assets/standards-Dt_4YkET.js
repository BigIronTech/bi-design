import { jsx, jsxs } from "react/jsx-runtime";
import { Bolt, CheckCircle, XCircle } from "lucide-react";
import { b as bigironLogo, s as sullivanLogo } from "./sullivan-logo-CmJZTwOq.js";
import { j as cn, S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-Ct22FQ2X.js";
import "@tanstack/react-router";
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
const bigironLogoDark = "/bi-design/bigiron-dark.svg";
const bigironLogoBW = "/bi-design/bigiron-bw.svg";
const sullivanLogoBW = "/bi-design/sullivan-logo-bw.svg";
const sullivanLogoDark = "/bi-design/sullivan-logo-reverse.svg";
const sullivanLogoMark = "/bi-design/sullivan-logo-mark.svg";
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Root,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TabsPrimitive.Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
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
function App() {
  return /* @__PURE__ */ jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsx(AppSidebar, {}),
    /* @__PURE__ */ jsxs(SidebarInset, { children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx(SidebarTrigger, {}),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical", className: "mr-2 h-4" }),
          /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Brand" }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Standards" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:py-8 md:px-0 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Brand Standards" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Logo guidelines, brand colors, and usage standards for our brand families" })
        ] }),
        /* @__PURE__ */ jsxs(Tabs, { defaultValue: "bigiron", className: "space-y-8", children: [
          /* @__PURE__ */ jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
            /* @__PURE__ */ jsx(TabsTrigger, { value: "bigiron", className: "cursor-pointer", children: "BigIron" }),
            /* @__PURE__ */ jsx(TabsTrigger, { value: "sullivan", className: "cursor-pointer", children: "Sullivan" })
          ] }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "bigiron", className: "space-y-8", children: [
            /* @__PURE__ */ jsx(ComponentSection, { title: "Logo & Mark", description: "Design System brand identity and logo usage guidelines", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Primary Logo" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-background flex items-center justify-center dark:bg-white", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2", children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-foreground", children: /* @__PURE__ */ jsx("img", { src: bigironLogo, alt: "BigIron Logo", className: "w-32 h-12" }) }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Use this version on light backgrounds with sufficient contrast." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Logo Mark" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-background flex items-center justify-center", children: /* @__PURE__ */ jsx(Bolt, { className: "h-12 w-12 text-primary" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Standalone mark for small spaces and favicons." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Dark Background" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-foreground dark:bg-background flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-white", children: /* @__PURE__ */ jsx("img", { src: bigironLogoDark, alt: "BigIron Logo", className: "w-32 h-12" }) }) }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Use this version on dark backgrounds." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Monochrome" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-background flex items-center justify-center dark:bg-white", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-gray-800", children: /* @__PURE__ */ jsx("img", { src: bigironLogoBW, alt: "BigIron Logo", className: "w-32 h-12" }) }) }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Single color version for special applications." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(ComponentSection, { title: "Brand Colors", description: "Primary brand color palette", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: [{
              name: "Brand Gold",
              class: "bg-primary text-primary-foreground",
              hex: "#ffcf01",
              usage: "Primary brand color"
            }, {
              name: "Brand White",
              class: "bg-white text-foreground dark:text-background border border-black/20",
              hex: "#ffffff",
              usage: "Secondary brand color"
            }, {
              name: "Brand Dark",
              class: "bg-brand-bi-secondary text-white dark:text-foreground dark:bg-black border border-white/40",
              hex: "#0C1218",
              usage: "Text and dark elements"
            }].map((color) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("div", { className: `h-24 rounded-lg ${color.class} flex items-center justify-center shadow-lg`, children: /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: color.name }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: color.name }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-mono text-xs", children: color.hex }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: color.usage })
              ] })
            ] }, color.name)) }) })
          ] }),
          /* @__PURE__ */ jsxs(TabsContent, { value: "sullivan", className: "space-y-8", children: [
            /* @__PURE__ */ jsx(ComponentSection, { title: "Logo & Mark", description: "Sullivan brand identity and logo usage guidelines", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Primary Logo" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 bg-background dark:bg-foreground flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3 ", children: /* @__PURE__ */ jsx("img", { src: sullivanLogo, alt: "Sullivan Auctioneers Logo", className: "w-48 h-20" }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Use this version on light backgrounds with sufficient contrast." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Logo Mark" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-4 bg-background dark:bg-foreground flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: sullivanLogoMark, alt: "Sullivan Auctioneers Logo Mark", className: "w-20 h-20" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Standalone mark for small spaces and favicons." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Dark Background" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-gray-900 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-3", children: /* @__PURE__ */ jsx("img", { src: sullivanLogoDark, alt: "Sullivan Logo Black and White", className: "w-48 h-20" }) }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Use this version on dark backgrounds." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-lg font-medium", children: "Monochrome" }),
                /* @__PURE__ */ jsx("div", { className: "border rounded-lg p-8 bg-background dark:bg-foreground flex items-center justify-center", children: /* @__PURE__ */ jsx("img", { src: sullivanLogoBW, alt: "Sullivan Logo Black and White", className: "w-48 h-20" }) }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Single color version for special applications." })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(ComponentSection, { title: "Brand Colors", description: "Sullivan brand color palette", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: [{
              name: "Brand Blue",
              class: "bg-brand-sul-primary text-white",
              hex: "#12284b",
              usage: "Primary brand color"
            }, {
              name: "Brand Gold",
              class: "bg-brand-sul-secondary text-primary-foreground",
              hex: "#ffcf06",
              usage: "Secondary brand color"
            }, {
              name: "Brand Dark",
              class: "bg-brand-bi-secondary dark:bg-background text-white border border-white/40",
              hex: "#000000",
              usage: "Text and dark elements"
            }, {
              name: "Complimentary Gray",
              class: "bg-brand-sul-complimentary-gray text-white",
              hex: "#636466",
              usage: "Complimentary brand color"
            }, {
              name: "Complimentary Light Gray",
              class: "bg-brand-sul-complimentary-lt-gray text-foreground dark:text-background",
              hex: "#d9d8d6",
              usage: "Complimentary brand color"
            }, {
              name: "Complimentary Blue",
              class: "bg-brand-sul-complimentary-blue text-white",
              hex: "#6482a7",
              usage: "Complimentary brand color"
            }].map((color) => /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("div", { className: `h-24 rounded-lg ${color.class} flex items-center justify-center shadow-lg`, children: /* @__PURE__ */ jsx("span", { className: "font-medium text-sm", children: color.name }) }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm space-y-1", children: [
                /* @__PURE__ */ jsx("p", { className: "font-medium", children: color.name }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground font-mono text-xs", children: color.hex }),
                /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: color.usage })
              ] })
            ] }, color.name)) }) })
          ] }),
          /* @__PURE__ */ jsx(ComponentSection, { title: "Logo Usage Guidelines", description: "When and how to use each brand", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs(Alert, { children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx(AlertTitle, { children: "Do's" }),
              /* @__PURE__ */ jsx(AlertDescription, { className: "space-y-2", children: /* @__PURE__ */ jsxs("ul", { className: "text-sm space-y-1 text-normal", children: [
                /* @__PURE__ */ jsx("li", { children: "• Maintain clear space around the logo" }),
                /* @__PURE__ */ jsx("li", { children: "• Use approved color variations" }),
                /* @__PURE__ */ jsx("li", { children: "• Scale proportionally" }),
                /* @__PURE__ */ jsx("li", { children: "• Ensure sufficient contrast" }),
                /* @__PURE__ */ jsx("li", { children: "• Use high-resolution files" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs(Alert, { variant: "destructive", children: [
              /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx(AlertTitle, { children: "Don'ts" }),
              /* @__PURE__ */ jsx(AlertDescription, { className: "space-y-2", children: /* @__PURE__ */ jsxs("ul", { className: "text-sm space-y-1", children: [
                /* @__PURE__ */ jsx("li", { children: "• Don't stretch or distort the logo" }),
                /* @__PURE__ */ jsx("li", { children: "• Don't use unauthorized colors" }),
                /* @__PURE__ */ jsx("li", { children: "• Don't place on busy backgrounds" }),
                /* @__PURE__ */ jsx("li", { children: "• Don't rotate or modify elements" }),
                /* @__PURE__ */ jsx("li", { children: "• Don't use low-resolution files" })
              ] }) })
            ] })
          ] }) })
        ] })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
