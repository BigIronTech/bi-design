import { jsxs, jsx } from "react/jsx-runtime";
import { Users } from "lucide-react";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent } from "./card-B8Skkm8y.js";
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { className: "hidden md:block", children: /* @__PURE__ */ jsx(BreadcrumbLink, { href: "#", children: "Audience" }) }),
            /* @__PURE__ */ jsx(BreadcrumbSeparator, { className: "hidden md:block" }),
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Personas" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-8xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsx("div", { className: "space-y-8 p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "User Personas" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Key user archetypes that guide our design decisions" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4", children: [
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `relative w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/expansionist.jpg", alt: "The Expansionist", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4", children: [
                  "3",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "The Expansionist" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Farmers run their own businesses, and many of them, like any other industry, have their eyes on the horizon. The Expansionist is looking to the operation’s future and wants to expand the farming operation, primarily by obtaining more land. They invest in long-term planning, equipment upgrades, and workforce development to scale production efficiently. This approach often involves securing financing, negotiating land purchases or leases, and adopting conservation practices that increase soil health and productivity over time. Expansionists also monitor market trends and diversify crops or enterprises to spread risk and capitalize on new opportunities." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some of the key things an Expansionist believes:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "Both purchasing and renting more land" }),
                /* @__PURE__ */ jsx("li", { children: "Diversifying their agricultural products (e.g., crops, livestock, etc.)" }),
                /* @__PURE__ */ jsx("li", { children: "Growing the farming business and invest profits back into the farm" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/brand-loyalist.jpg", alt: "The Brand Loyalist", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-lg -mt-4", children: [
                  "10",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "The Brand Loyalist" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Never underestimate the power of a reputable brand. That statement is especially true when working with a Brand Loyalist. Once you win over a Brand Loyalist, you’ve got their business for the long haul. But, unfortunately, that also means that if they’re doing business with a competitor, getting them to switch to your product can be tricky." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some of the key things a Brand Loyalist believes:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "The personal relationship is as important as the product itself" }),
                /* @__PURE__ */ jsx("li", { children: "Brand loyalty benefits the farm " }),
                /* @__PURE__ */ jsx("li", { children: "Continued business with the same company can provide cost savings and other benefits" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed mt-2 text-lg", children: "If your sales team is up for a challenge, go after the Brand Loyalist and see if you can convince them to switch over to your products. And know that if you do win them over, they won’t be going anywhere for a long time." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/roi.jpg", alt: "Numbers-Focused/ROI", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4", children: [
                  "14",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "Numbers-Focused/ROI" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "The bottom line is the bottom line. This farmer makes vital decisions based on what will make the most profit and return on investment." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some examples of the Numbers-Focused Farmer’s common day-to-day activities:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "Routinely evaluate the market for the prices of agricultural commodities" }),
                /* @__PURE__ */ jsx("li", { children: "Assess opportunity costs" }),
                /* @__PURE__ */ jsx("li", { children: "Monitor inputs and outputs for measuring the technical efficiency of the farm" }),
                /* @__PURE__ */ jsx("li", { children: "Analyzing and reviewing their financial data" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Marketing and selling to a Numbers-Focused Farmer is simple and straightforward. Find the products and services that are going to improve their ROI, and hit that message home with the numbers to back you up." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/sustainable.jpg", alt: "The Sustainable Farmer", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4", children: [
                  "23",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "The Sustainable Farmer" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "The Sustainable Farmer looks to the land. A Sustainable Farmer is driven by the desire to reduce environmental damage and keep the land in optimal condition. They prioritize soil health, water conservation, and biodiversity through practices like cover cropping, reduced tillage, integrated pest management, and rotational grazing. Sustainable Farmers often balance productivity with ecosystem services, investing in renewable energy, habitat restoration, and carbon sequestration practices. Their decisions consider long-term resilience to climate variability, community well-being, and often involve certifications or participation in conservation programs to verify and support sustainable outcomes." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some of the things are Sustainable Farmer might do:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "Maintaining crop diversity and rotations" }),
                /* @__PURE__ */ jsx("li", { children: "Preventing soil erosion" }),
                /* @__PURE__ */ jsx("li", { children: "Minimizing climate pollution" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "When it comes down to it, the Sustainable Farmer believes in both their impact on the environment and their own soil health and fertility. As a result, they are more likely to use cover crops or no-farming and use natural nutrients and biological crop protection." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/agtech.jpg", alt: "The AgTech Leader", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4", children: [
                  "16",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "The AgTech Leader" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "They think often about the evolution of AgTech and how it’s going to change the industry." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "This farmer isn’t just reacting to the changes in technology — they’re on the front lines, focusing on using every tool at their disposal to make their operations more efficient and productive. And with the right tech tools, they can save themselves time and headaches in the process." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some of the things an AgTech Leader might do:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "They believe that adapting and innovating with new technology is required for a farming business to be successful" }),
                /* @__PURE__ */ jsx("li", { children: "Technology has been a net positive for their farming business and for the industry" }),
                /* @__PURE__ */ jsx("li", { children: "Monitoring climate variables (precipitation levels, soil temperature, etc.) improves productivity and reduces costs" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "If you have a high-tech product or need a market of farmers that you know are innovative by nature, this is the market to go after." })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0 gap-2", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-3 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-6", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: "/frugal.jpg", alt: "The Frugal Farmer", style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxs("div", { className: "absolute -top-14 -right-14 w-16 h-16 bg-stone-500 rounded-full p-2 text-white flex items-center justify-center font-bold text-2xl border-4 border-stone-200 shadow-xl -mt-4", children: [
                  "34",
                  /* @__PURE__ */ jsx("sub", { className: "text-sm", children: "%" })
                ] }),
                /* @__PURE__ */ jsx(CardTitle, { className: "text-sky-700 leading-tight", children: "The Frugal Farmer" })
              ] })
            ] }) }),
            /* @__PURE__ */ jsx(CardContent, { className: "space-y-3 text-xs", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "It’s no secret that being a farmer in today’s economy is challenging. The Frugal Farmer is a product of this environment." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "The Frugal Farmer is always looking for ways to cut costs, whether that means finding cheaper inputs, reducing labor costs, or optimizing their operations to be more efficient. Every dollar saved is a dollar that can be reinvested back into the farm." }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Here are some of the things a Frugal Farmer might do:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-2 text-foreground text-base font-bold italic", children: [
                /* @__PURE__ */ jsx("li", { children: "They look for good deals on equipment, seed, crop protection, etc." }),
                /* @__PURE__ */ jsx("li", { children: "They will keep an eye out to cut unnecessary costs" }),
                /* @__PURE__ */ jsx("li", { children: "If possible, they’ll take a do-it-yourself approach to the bulk of their farm tasks" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-foreground leading-relaxed text-lg", children: "Frugal farmers are more likely to use generic inputs than look to see prices online. They are likely not early adopters of technology or anything that requires a long-term payback. They are also more likely to be hands-on in farm decisions or activities." })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(ComponentSection, { title: "Persona Usage Guidelines", description: "When and how personas should be used in the design process", children: /* @__PURE__ */ jsxs(Alert, { children: [
          /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(AlertTitle, { children: "Design with Personas in Mind" }),
          /* @__PURE__ */ jsx(AlertDescription, { children: "These personas represent our core user base. Reference them when making design decisions to ensure we're building solutions that meet real user needs and pain points." })
        ] }) })
      ] }) }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
