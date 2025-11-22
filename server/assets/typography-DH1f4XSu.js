import { jsxs, jsx } from "react/jsx-runtime";
import { Users } from "lucide-react";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle, j as cn } from "./button-toggle-C0d9vO61.js";
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Visual Design" }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Typography" }) })
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
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Typography" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Consistent text sizing and hierarchy are crucial for creating a clear and organized user interface. By establishing a well-defined typography scale, we can ensure that headings, subheadings, body text, and other textual elements are visually distinct and easy to read. This not only enhances the overall aesthetic of the application but also improves usability by guiding users' attention and helping them quickly identify important information. A consistent typography scale contributes to a cohesive design language, reinforcing brand identity and creating a more professional and polished appearance." })
        ] }),
        /* @__PURE__ */ jsx(Separator, { orientation: "horizontal", className: "my-6" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsx(ComponentSection, { title: "", description: "", children: /* @__PURE__ */ jsxs("div", { className: "mb-6 grid grid-cols-1 md:grid-cols-2 gap-16", children: [
            /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold tracking-tight mb-3", children: "Font Family" }),
              /* @__PURE__ */ jsxs("p", { className: "text-base my-3 ", children: [
                /* @__PURE__ */ jsx("strong", { children: "Plus Jakarta Sans" }),
                " is a modern, clean, and highly legible sans-serif typeface. It offers excellent readability across various screen sizes and resolutions, making it ideal for digital interfaces. The font's versatility allows it to be used for both headings and body text, ensuring a consistent typographic hierarchy throughout the application."
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Loading multiple weights and fonts from Google can slow down the initial page load time." }),
                " ",
                "To mitigate this, we only load one font family and add others as fallbacks to improve perceived performance.",
                " "
              ] }),
              /* @__PURE__ */ jsx("p", { className: cn("text-md text-foreground pt-4 pb-0 mb-0"), children: "Fonts are shown in the following order (depending on which fonts they have loaded on their machine):" }),
              /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground mb-4", children: "font-sans (Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Montserrat', 'Segoe UI', 'Roboto', 'Oxygen', 'Helvetica Neue', sans-serif)" })
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold tracking-tight", children: "Heading 1" }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-4xl font-bold tracking-tight — 36/40px" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-3xl font-semibold tracking-tight", children: "Heading 2" }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-3xl font-semibold tracking-tight — 30/36px" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-semibold tracking-tight", children: "Heading 3" }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-2xl font-semibold tracking-tight — 24/32px" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-xl font-semibold tracking-tight", children: "Heading 4" }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-xl font-semibold tracking-tight — 20/28px" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-base", children: "Body text - The quick brown fox jumps over the lazy dog." }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-base — 16/24px" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Small text - Additional information and captions." }),
                /* @__PURE__ */ jsx("code", { className: "text-sm text-muted-foreground", children: "text-sm text-muted-foreground — 14/21px" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }),
            /* @__PURE__ */ jsx(AlertTitle, { className: "text-lg/5 font-medium mb-3", children: "Design with cleanliness and simplicity in mind" }),
            /* @__PURE__ */ jsxs(AlertDescription, { children: [
              /* @__PURE__ */ jsxs("p", { className: "text-base mb-3", children: [
                "Additionally, Plus Jakarta Sans has a contemporary aesthetic that aligns well with modern design principles, helping to convey a sense of professionalism and trustworthiness in the user interface. It has humanist proportions (less strictly geometric), open counters, softer terminals, more modulation and subtle calligraphic influence for",
                " ",
                /* @__PURE__ */ jsx("strong", { children: "improved legibility" }),
                "."
              ] }),
              /* @__PURE__ */ jsxs("p", { children: [
                "Slightly lower or more moderate x-height with wider letter spacing and proportions",
                " ",
                /* @__PURE__ */ jsx("strong", { children: "optimized for longer reading and UI clarity." })
              ] })
            ] })
          ] })
        ] })
      ] }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
