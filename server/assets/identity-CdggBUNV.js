import { jsxs, jsx } from "react/jsx-runtime";
import { Eye, Shield, HandHeart, HandPlatter, Star, Scale, HeartHandshake, View, CheckCircle, Info } from "lucide-react";
import { b as bigironLogo, s as sullivanLogo } from "./sullivan-logo-CmJZTwOq.js";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-B8Skkm8y.js";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-Ct22FQ2X.js";
import { B as Badge } from "./badge-dKrRDUnq.js";
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Identity" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Brand Identity" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Core brand principles, values, and identity guidelines that define our brand families" })
        ] }),
        /* @__PURE__ */ jsx(ComponentSection, { title: "Brand Philosophy", description: "The foundation of our brand identity", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Eye, { className: "h-5 w-5 text-blue-500" }),
              "Vision"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "To be the most recognized Customer-Focused Equipment and Real Estate platform." }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5 text-emerald-500" }),
              "Mission"
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "To provide a quality unmatched experience for sellers, buyers, our team and all those we serve." }) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(ComponentSection, { title: "Core Values", description: "The principles that guide our brand", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(HandHeart, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Honesty" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Moral principles of truthfulness and transparency in all our interactions." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(HandPlatter, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground " }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Customer Service" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Helping customers is our top priority. We listen, understand their needs, and deliver exceptional service at every touchpoint." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(Star, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Quality" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "High standards and attention to detail ensure our products and services exceed expectations." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(Scale, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Integrity" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Standards of honesty and strong moral principles guide our actions and decisions." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(HeartHandshake, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Respect" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Respect for diverse perspectives and experiences drives our inclusive design process and outcomes." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-brand-bi-primary/30 rounded-full flex items-center justify-center mx-auto dark:bg-brand-bi-primary-foreground", children: /* @__PURE__ */ jsx(View, { className: "h-8 w-8 text-brand-bi-primary dark:text-primary-foreground" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-semibold text-lg", children: "Transparency" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Conduct business ethically and transparently, building trust with our users and stakeholders." })
            ] })
          ] }),
          " "
        ] }) }),
        /* @__PURE__ */ jsx(ComponentSection, { title: "Brand Architecture", description: "How our brand families are organized", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6 bg-background", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold", children: "Master Brand" }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Single & Multi-Day" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-2 mb-4", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-black p-4 rounded-lg dark:bg-foreground", children: /* @__PURE__ */ jsx("img", { src: bigironLogo, alt: "BigIron Logo", className: "w-48 h-20" }) }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "The foundational brand that represents our core design system platform and methodology." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-6 bg-background", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold", children: "Secondary Brand" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Live Auctions" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4 mb-4", children: /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold text-black p-4 rounded-lg dark:bg-foreground", children: /* @__PURE__ */ jsx("img", { src: sullivanLogo, alt: "Sullivan Auctioneers Logo", className: "w-48 h-20" }) }) }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Among the nation's leading Real Estate and Farm Machinery Auctioneers, with over 40 years of experience." })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(ComponentSection, { title: "Usage Guidelines", description: "When and how to use each brand", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertTitle, { children: "Brand Consistency" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "Always maintain consistent application of brand elements across all touchpoints. Each brand should be used in its appropriate context and never mixed with elements from other brands." })
          ] }),
          /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsx(Info, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertTitle, { children: "Brand Hierarchy" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "The master brand (Design System) takes precedence in general communications. Sub-brands should be used for specific product communications and always include a reference to the master brand." })
          ] })
        ] }) })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
