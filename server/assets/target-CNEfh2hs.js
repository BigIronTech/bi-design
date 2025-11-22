import { jsxs, jsx } from "react/jsx-runtime";
import { Quote, CheckCircle, XCircle, Smartphone, Tablet, Monitor, Users } from "lucide-react";
import { S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, h as BreadcrumbPage, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-B8Skkm8y.js";
import { B as Badge } from "./badge-dKrRDUnq.js";
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
const targets = [{
  name: "Chad R. Young",
  role: "Land Buyer",
  age: 28,
  experience: "Beginner",
  mobile: true,
  computer: true,
  tablet: true,
  quote: "Land is the key to success. I’m not just buying acres— I’m building a future, one field at a time.",
  goals: ["Both purchasing and renting more land", "Diversifying their agricultural products (e.g., crops, livestock, etc.)", "Growing the farming business and invest profits back into the farm "],
  frustrations: ["High operating costs", "Uncertain markets", "Labor shortages"],
  bio: "Farmers run their own businesses, and many of them, like any other industry, have their eyes on the horizon. The Expansionist is looking to the operation’s future and wants to expand the farming operation, primarily by obtaining more land.",
  trait: "Expansionist",
  avatar: "/Farmer-1.jpg"
}, {
  name: "Fred A. Wilkens",
  role: "The Right Equipment",
  age: 38,
  experience: "Intermediate",
  mobile: true,
  computer: true,
  tablet: true,
  quote: "It’s not just land, it’s an investment. Every acre should pay for itself and then some.",
  goals: ["Routinely evaluate the market for the prices of agricultural commodities", "Assess opportunity costs of various inputs", "Monitor inputs and outputs for measuring the technical efficiency of the farming operation"],
  frustrations: ["Lack of data transparency", "Unpredictable external factors and high/rising costs", "Weather and volatile markets."],
  bio: "The bottom line is the bottom line. This farmer makes vital decisions based on what will make the most profit and return on investment. Find the products and services that are going to improve their ROI and you’ll have a customer for life.",
  trait: "ROI Focused",
  avatar: "/Farmer-2.jpg"
}, {
  name: "Roy B. Biggins",
  role: "Equipment & Cattle",
  age: 52,
  experience: "Advanced",
  mobile: true,
  computer: true,
  tablet: false,
  quote: "I stick with what works. My dad ran green, I run green. I need equipment I trust, not just something new.",
  goals: ["The personal relationship is as important as the product itself", "Brand loyalty benefits the farm", "Continued business with the same company can provide cost savings and other benefits"],
  frustrations: ["Perceived indifference of large corporations to their traditional loyalty", "New technology in their equipment", "Marketing through social media channels"],
  bio: "Once you win over a Brand Loyalist, you’ve got their business for the long haul. But, unfortunately, that also means that if they’re doing business with a competitor, getting them to switch to your product can be tricky.",
  trait: "Brand Loyalist",
  avatar: "/Farmer-3.jpg"
}, {
  name: "Bob W. Robertson",
  role: "Frugal Farmer",
  age: 60,
  experience: "Expert",
  mobile: true,
  computer: true,
  tablet: false,
  quote: "I don’t spend a dollar unless I know it’ll save me two. Fancy doesn’t grow crops— smart choices do.",
  goals: ["They look for good deals on equipment, seed, crop protection, etc.", "Will keep an eye out to cut unnecessary costs", "If possible, they’ll take a do-it-yourself approach to the bulk of their farm tasks"],
  frustrations: ["Technology", "Cost of structures designed for large-scale operations", "Rising prices for seeds, feed, fertilizers, and fuel"],
  bio: "Frugal farmers are more likely to use generic inputs than look to see prices online. They are likely not early adopters of technology or anything that requires a long-term payback. They are also more likely to be hands-on in farm decisions or activities.",
  trait: "Frugal",
  avatar: "/Farmer-4.jpg"
}];
const getTraitVariant = (trait) => {
  switch (trait) {
    case "Frugal":
      return "destructive";
    case "Brand Loyalist":
      return "default";
    case "ROI Focused":
      return "outline";
    case "Expansionist":
      return "secondary";
    default:
      return "outline";
  }
};
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Target" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "container-wrapper flex flex-1 flex-col px-2", children: /* @__PURE__ */ jsx("div", { className: "x-full overflow-y-auto min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-8xl mx-auto", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsx("div", { className: "space-y-8 p-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Target Audience Personas" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "Key user archetypes that guide our design decisions" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsx(ComponentSection, { title: " ", description: "", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 py-0", children: targets.map((persona, index) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden h-full pt-0", children: [
            /* @__PURE__ */ jsx(CardHeader, { className: "pb-0 px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center space-y-3", children: [
              /* @__PURE__ */ jsx("div", { className: `w-auto h-auto p-0 overflow-hidden flex items-center justify-center text-white font-bold text-lg`, children: /* @__PURE__ */ jsx("img", { src: persona.avatar, alt: persona.name, style: {
                objectFit: "cover"
              } }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-base leading-tight", children: persona.name }),
                /* @__PURE__ */ jsx(CardDescription, { className: "text-xs", children: persona.role }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-center mt-2", children: /* @__PURE__ */ jsx(Badge, { variant: getTraitVariant(persona.trait), className: "text-xs", children: persona.trait }) })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-4", children: /* @__PURE__ */ jsxs("div", { className: "relative bg-sky-500 p-2 rounded-2xl space-y-0 text-white shadow-lg", children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-2 left-2 text-3xl opacity-30 rotate-180", children: /* @__PURE__ */ jsx(Quote, { className: "h-6 w-6" }) }),
                  /* @__PURE__ */ jsx("div", { className: "pl-7 pr-0", children: /* @__PURE__ */ jsx("p", { className: "text-md font-medium quote leading-tight mb-4", children: persona.quote }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute bottom-2 right-2 text-3xl opacity-30", children: /* @__PURE__ */ jsx(Quote, { className: "h-6 w-6" }) }),
                  /* @__PURE__ */ jsx("div", { className: "absolute -top-2 left-8 w-4 h-4 bg-sky-500 transform rotate-45" })
                ] }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg leading-relaxed", children: [
                  /* @__PURE__ */ jsx("strong", { children: "Age:" }),
                  " ",
                  persona.age
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg leading-relaxed", children: [
                  /* @__PURE__ */ jsx("strong", { children: "Sex:" }),
                  " Male"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-lg leading-relaxed", children: [
                  /* @__PURE__ */ jsx("strong", { children: "Experience:" }),
                  " ",
                  persona.experience
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed text-lg", children: persona.bio }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "font-bold text-base dark:text-foreground text-gray-700 mb-4 flex items-center gap-1", children: "Key Points / Goals" }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-1 text-xl", children: persona.goals.slice(0, 3).map((goal, goalIndex) => /* @__PURE__ */ jsxs("li", { className: "flex text-lg items-start gap-2 mb-2", children: [
                    /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3 text-green-600 mt-1 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm leading-tight italic", children: goal })
                  ] }, goalIndex)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h5", { className: "font-medium text-lg text-red-700 mb-2 flex items-center gap-1", children: "Frustrations" }),
                  /* @__PURE__ */ jsx("ul", { className: "space-y-1", children: persona.frustrations.slice(0, 3).map((frustration, frustrationIndex) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsx(XCircle, { className: "h-3 w-3 text-red-600 mt-1 flex-shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "text-sm leading-tight italic", children: frustration })
                  ] }, frustrationIndex)) })
                ] }),
                /* @__PURE__ */ jsx("hr", { className: "my-4" }),
                /* @__PURE__ */ jsxs("h5", { className: "font-medium text-xs text-gray-700 dark:text-gray-400 mb-1 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Smartphone, { className: "h-3 w-3" }),
                  "Preferred Devices"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-1", children: [
                  persona.mobile ? /* @__PURE__ */ jsx(Smartphone, { className: "h-6 w-6 text-black  dark:text-foreground mt-1 flex-shrink-0  stroke-1" }) : /* @__PURE__ */ jsx(Smartphone, { className: "h-6 w-6 text-gray-300 mt-1 flex-shrink-0  stroke-1" }),
                  persona.tablet ? /* @__PURE__ */ jsx(Tablet, { className: "h-8 w-8 text-black dark:text-foreground kmt-1 flex-shrink-0  stroke-1" }) : /* @__PURE__ */ jsx(Tablet, { className: "h-8 w-8 text-gray-300 dark:text-gray-700 mt-1 flex-shrink-0  stroke-1" }),
                  persona.computer ? /* @__PURE__ */ jsx(Monitor, { className: "h-9 w-9 text-black dark:text-foreground mt-1 flex-shrink-0 stroke-1" }) : /* @__PURE__ */ jsx(Monitor, { className: "h-9 w-9 text-gray-500 mt-1 flex-shrink-0 stroke-1" })
                ] })
              ] })
            ] })
          ] }, index)) }) }),
          /* @__PURE__ */ jsx(ComponentSection, { title: "Persona Usage Guidelines", description: "When and how personas should be used in the design process", children: /* @__PURE__ */ jsxs(Alert, { children: [
            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx(AlertTitle, { children: "Design with Personas in Mind" }),
            /* @__PURE__ */ jsx(AlertDescription, { children: "These personas represent our core user base. Reference them when making design decisions to ensure we're building solutions that meet real user needs and pain points." })
          ] }) })
        ] })
      ] }) }) }) }) }) })
    ] })
  ] });
}
export {
  App as component
};
