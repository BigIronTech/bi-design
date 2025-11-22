import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { CirclePlay, Fingerprint, Medal, User, Target, MicVocal, Image, Type, SquareMousePointer, Blocks, ListTodo, Layers } from "lucide-react";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription } from "./card-B8Skkm8y.js";
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/", children: "Getting Started" }) }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Overview" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "w-full overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:py-8 md:px-0 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4 py-12", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight", children: "Welcome to our Digital Design System" }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "A comprehensive collection of reusable components, patterns, and guidelines built with shadcn/ui and Tailwind CSS." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6", children: [
          /* @__PURE__ */ jsx(Card, { className: "transition-shadow", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CirclePlay, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Introduction" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "What to expect from our Design System: reusable components, clear guidelines, and scalable patterns for building consistent, accessible user interfaces." })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/identity", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Fingerprint, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Brand Identity" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Understanding our brand's core principles, values, and identity guidelines that define our brand families." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/standards", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Medal, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Brand Standards" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Logo guidelines, brand colors, and usage standards for our brand families." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/personas", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(User, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Personas" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "A description of our key user personas, their goals, frustrations, and backgrounds. These archetypes help guide design decisions and ensure our solutions address real user needs." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/target", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Target, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Target Audience" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Consumers most likely to benefit from our products and services include demographics, behaviors, and needs." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/voice-and-tone", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(MicVocal, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Voice & Tone" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Our brand's personality and communication style, including how we speak to users, the language we use, and the emotional tone we convey in all communications." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/voice-and-tone", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Image, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Imagery" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Acceptable imagery includes high-quality, relevant photos, illustrations, and icons that align with our brand's visual language." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/typography", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Type, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Typography" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Font families, sizes, weights, and styles that ensure readable and accessible text across all platforms and devices." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/figma", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(SquareMousePointer, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Figma" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Collection of Figma resources, templates, and components for designing with our brand and design system." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/components", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Blocks, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Components" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Set of reusable UI components built with shadcn/ui and Tailwind CSS, designed for consistency and accessibility." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/forms", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(ListTodo, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Forms" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Stylized form elements including inputs, selects, checkboxes, radios, switches, and textareas for collecting user data." })
          ] }) }) }),
          /* @__PURE__ */ jsx(Card, { className: "cursor-pointer hover:shadow-md dark:hover:bg-foreground/10 transition-shadow", children: /* @__PURE__ */ jsx(Link, { to: "/patterns", children: /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(Layers, { className: "h-8 w-8 text-primary mb-2" }),
            /* @__PURE__ */ jsx(CardTitle, { children: "Patterns" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Examples include navigation bars, sidebars, modal dialogs, drawers, tabs, accordions, and grid layouts." })
          ] }) }) })
        ] })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
