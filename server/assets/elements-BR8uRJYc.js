import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { FileText, Info, X, AlertCircle, HomeIcon, ChevronRight, CircleCheckBig, TriangleAlert } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faEye } from "@fortawesome/free-solid-svg-icons";
import { l as Sidebar, m as SidebarHeader, n as SidebarContent, o as SidebarSeparator, p as SidebarFooter, q as SidebarMenu, r as SidebarMenuItem, s as SidebarMenuButton, k as Button, j as cn, B as Breadcrumb, d as BreadcrumbList, e as BreadcrumbItem, f as BreadcrumbLink, g as BreadcrumbSeparator, t as BreadcrumbEllipsis, h as BreadcrumbPage, S as SidebarProvider, A as AppSidebar, a as SidebarInset, b as SidebarTrigger, c as Separator, i as ButtonToggle } from "./button-toggle-C0d9vO61.js";
import * as React from "react";
import { useState, useEffect } from "react";
import { A as Alert, a as AlertTitle, b as AlertDescription } from "./alert-Ct22FQ2X.js";
import { B as Badge } from "./badge-dKrRDUnq.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, e as CardFooter } from "./card-B8Skkm8y.js";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { L as Label, I as Input } from "./label-CL7bd6zH.js";
import { Link } from "@tanstack/react-router";
import { Drawer as Drawer$1 } from "vaul";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
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
import "@radix-ui/react-label";
function SidebarRight({ sections, ...props }) {
  const [activeSection, setActiveSection] = useState("introduction");
  useEffect(() => {
    const handleScroll = () => {
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return /* @__PURE__ */ jsxs(
    Sidebar,
    {
      collapsible: "none",
      className: "sticky top-0 hidden h-svh border-l lg:flex",
      ...props,
      children: [
        /* @__PURE__ */ jsx(SidebarHeader, { className: "border-sidebar-border h-16 p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4 pb-4", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-slate-600 dark:text-slate-400" }),
          /* @__PURE__ */ jsx("h4", { className: "font-semibold text-sm text-slate-900 dark:text-slate-400", children: "On this page" })
        ] }) }),
        /* @__PURE__ */ jsxs(SidebarContent, { children: [
          /* @__PURE__ */ jsx(SidebarSeparator, { className: "mx-0" }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsx("div", { className: "sticky top-8", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsx("nav", { className: "space-y-1", children: sections.map((section) => {
              const isActive = activeSection === section.id;
              const isLevel2 = section.level === 2;
              return /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => scrollToSection(section.id),
                  className: `
                        w-full text-left cursor-pointer text-sm py-1 px-3 rounded-md transition-all duration-200
                        ${isLevel2 ? "pl-6" : "pl-3"}
                        ${isActive ? "bg-sidebar-accent text-slate-700 dark:text-slate-400 font-medium" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 border-l-2 border-transparent"}
                      `,
                  children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("span", { className: "truncate", children: section.title }) })
                },
                section.id
              );
            }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 pt-4 border-t border-slate-200", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Click any section to jump to it" }) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx(SidebarFooter, { children: /* @__PURE__ */ jsx(SidebarMenu, { children: /* @__PURE__ */ jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsx(SidebarMenuButton, {}) }) }) })
      ]
    }
  );
}
function DismissibleAlert() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-50 bg-gray-50 p-4", children: /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => setIsVisible(true),
        variant: "outline",
        className: "text-foreground dark:text-background dark:border-accent-background cursor-pointer",
        children: "Show Alert"
      }
    ) });
  }
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-50 bg-gray-50/50", children: /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(Alert, { className: "relative flex", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(Info, { className: "h-5 w-5 text-blue-600" }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsx(AlertTitle, { className: "mb-1", children: "Dismissible Info Alert" }),
      /* @__PURE__ */ jsx(AlertDescription, { children: "This is a dismissible alert component built with Tailwind CSS. Click the X button to dismiss it." })
    ] }),
    /* @__PURE__ */ jsx(Button, { variant: "info", children: "Learn More" }),
    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-px h-8 bg-slate-300" }),
    /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => setIsVisible(false),
        variant: "ghost",
        className: "w-9 rounded-full p-1 flex-shrink-0 ml-3 inline-flex text-blue-500 hover:text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-50 transition-colors",
        "aria-label": "Dismiss alert",
        children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" })
      }
    )
  ] }) }) }) });
}
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleTrigger,
    {
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleContent,
    {
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
function FormWithErrors() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(
    {}
  );
  const [showAlert, setShowAlert] = useState(false);
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowAlert(true);
    } else {
      setErrors({});
      setShowAlert(false);
      alert("Form submitted successfully!");
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-slate-50 flex items-center justify-center p-8", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-slate-900", children: "Inline error alerts" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-600 mt-2", children: [
        "This is for example purposes only. ",
        /* @__PURE__ */ jsx("br", {}),
        " Leave fields blank or enter invalid data to see error states."
      ] })
    ] }),
    showAlert && /* @__PURE__ */ jsx(Alert, { variant: "destructive", className: "relative flex", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6 text-red-600" }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx(AlertTitle, { children: "Error" }),
        /* @__PURE__ */ jsxs(AlertDescription, { children: [
          "There ",
          Object.keys(errors).length === 1 ? "is" : "are",
          " ",
          Object.keys(errors).length,
          " error",
          Object.keys(errors).length !== 1 ? "s" : "",
          " with your submission. Please check the form below."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "you@example.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        ),
        errors.email && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5" }),
          errors.email
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Password" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            className: errors.password ? "border-red-500 focus-visible:ring-red-500" : ""
          }
        ),
        errors.password && /* @__PURE__ */ jsxs("p", { className: "text-sm text-red-600 flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(AlertCircle, { className: "h-3.5 w-3.5" }),
          errors.password
        ] })
      ] }),
      /* @__PURE__ */ jsx(Button, { type: "submit", onClick: handleSubmit, className: "w-full", children: "Sign In" })
    ] })
  ] }) });
}
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
const IS_SERVER = typeof window === "undefined";
function useMediaQuery(query, {
  defaultValue = false,
  initializeWithValue = true
} = {}) {
  const getMatches = (query2) => {
    if (IS_SERVER) {
      return defaultValue;
    }
    return window.matchMedia(query2).matches;
  };
  const [matches, setMatches] = useState(() => {
    if (initializeWithValue) {
      return getMatches(query);
    }
    return defaultValue;
  });
  function handleChange() {
    setMatches(getMatches(query));
  }
  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange);
    } else {
      matchMedia.addEventListener("change", handleChange);
    }
    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange);
      } else {
        matchMedia.removeEventListener("change", handleChange);
      }
    };
  }, [query]);
  return matches;
}
function Drawer({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Root, { "data-slot": "drawer", ...props });
}
function DrawerTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Trigger, { "data-slot": "drawer-trigger", ...props });
}
function DrawerPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Portal, { "data-slot": "drawer-portal", ...props });
}
function DrawerClose({
  ...props
}) {
  return /* @__PURE__ */ jsx(Drawer$1.Close, { "data-slot": "drawer-close", ...props });
}
function DrawerOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Overlay,
    {
      "data-slot": "drawer-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DrawerContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DrawerPortal, { "data-slot": "drawer-portal", children: [
    /* @__PURE__ */ jsx(DrawerOverlay, {}),
    /* @__PURE__ */ jsxs(
      Drawer$1.Content,
      {
        "data-slot": "drawer-content",
        className: cn(
          "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx("div", { className: "bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" }),
          children
        ]
      }
    )
  ] });
}
function DrawerHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "drawer-header",
      className: cn(
        "flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className
      ),
      ...props
    }
  );
}
function DrawerFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "drawer-footer",
      className: cn("mt-auto flex flex-col gap-2 p-4", className),
      ...props
    }
  );
}
function DrawerTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Title,
    {
      "data-slot": "drawer-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}
function DrawerDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Drawer$1.Description,
    {
      "data-slot": "drawer-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
const items = [
  { href: "#", label: "Home" },
  { href: "#", label: "Documentation" },
  { href: "#", label: "Building Your Application" },
  { href: "#", label: "Components" },
  { label: "Breadcrumbs" }
];
const ITEMS_TO_DISPLAY = 3;
function BreadcrumbResponsive() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return /* @__PURE__ */ jsx(Breadcrumb, { children: /* @__PURE__ */ jsxs(BreadcrumbList, { children: [
    /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbLink, { asChild: true, children: /* @__PURE__ */ jsxs(Link, { to: items[0].href ?? "/", children: [
      " ",
      /* @__PURE__ */ jsx(HomeIcon, { className: "h-4 w-4" })
    ] }) }) }),
    /* @__PURE__ */ jsx(BreadcrumbSeparator, {}),
    items.length > ITEMS_TO_DISPLAY ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(BreadcrumbItem, { children: isDesktop ? /* @__PURE__ */ jsxs(DropdownMenu, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(
          DropdownMenuTrigger,
          {
            className: "flex items-center gap-1",
            "aria-label": "Toggle menu",
            children: /* @__PURE__ */ jsx(BreadcrumbEllipsis, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsx(DropdownMenuContent, { align: "start", children: items.slice(1, -2).map((item, index) => /* @__PURE__ */ jsx(DropdownMenuItem, { children: /* @__PURE__ */ jsx(Link, { to: item.href ? item.href : "#", children: item.label }) }, index)) })
      ] }) : /* @__PURE__ */ jsxs(Drawer, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DrawerTrigger, { "aria-label": "Toggle Menu", children: /* @__PURE__ */ jsx(BreadcrumbEllipsis, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs(DrawerContent, { children: [
          /* @__PURE__ */ jsxs(DrawerHeader, { className: "text-left", children: [
            /* @__PURE__ */ jsx(DrawerTitle, { children: "Navigate to" }),
            /* @__PURE__ */ jsx(DrawerDescription, { children: "Select a page to navigate to." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-1 px-4", children: items.slice(1, -2).map((item, index) => /* @__PURE__ */ jsx(
            Link,
            {
              to: item.href ? item.href : "#",
              className: "py-1 text-sm",
              children: item.label
            },
            index
          )) }),
          /* @__PURE__ */ jsx(DrawerFooter, { className: "pt-4", children: /* @__PURE__ */ jsx(DrawerClose, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "outline", children: "Close" }) }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
    ] }) : null,
    items.slice(-ITEMS_TO_DISPLAY + 1).map((item, index) => /* @__PURE__ */ jsx(BreadcrumbItem, { children: item.href ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        BreadcrumbLink,
        {
          asChild: true,
          className: "max-w-20 truncate md:max-w-none",
          children: /* @__PURE__ */ jsx(Link, { to: item.href, children: item.label })
        }
      ),
      /* @__PURE__ */ jsx(BreadcrumbSeparator, {})
    ] }) : /* @__PURE__ */ jsx(BreadcrumbPage, { className: "max-w-20 truncate md:max-w-none", children: item.label }) }, index))
  ] }) });
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
  const sections = [{
    id: "alerts",
    title: "Alerts",
    level: 1
  }, {
    id: "site-alerts",
    title: "Site Alerts",
    level: 2
  }, {
    id: "page-alerts",
    title: "Page Alerts",
    level: 2
  }, {
    id: "inline-alerts",
    title: "Inline Alerts",
    level: 2
  }, {
    id: "badges",
    title: "Badges",
    level: 1
  }, {
    id: "breadcrumbs",
    title: "Breadcrumbs",
    level: 1
  }, {
    id: "buttons",
    title: "Buttons",
    level: 1
  }, {
    id: "button-variants",
    title: "Button Variants",
    level: 2
  }, {
    id: "button-sizes",
    title: "Button Sizes",
    level: 2
  }, {
    id: "cards",
    title: "Cards",
    level: 1
  }];
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
            /* @__PURE__ */ jsx(BreadcrumbItem, { children: /* @__PURE__ */ jsx(BreadcrumbPage, { children: "Components" }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto h-5 flex items-center gap-2 px-3", children: [
          /* @__PURE__ */ jsx("div", { className: " md:block text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("span", { className: "px-2", children: "v1.0.0" }) }),
          /* @__PURE__ */ jsx(Separator, { orientation: "vertical" }),
          /* @__PURE__ */ jsx(ButtonToggle, {})
        ] })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "container-wrapper flex flex-1 flex-row", children: [
        /* @__PURE__ */ jsx("div", { className: "overflow-y-auto w-full min-h-[100vh] flex-1 md:min-h-min lg:pt-8 md:px-0 max-w-7xl mx-auto px-2", children: /* @__PURE__ */ jsx("div", { className: "bg-background mb-8", children: /* @__PURE__ */ jsx("div", { className: "text-foreground leading-relaxed text-base", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h1", { className: "text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl", children: "Elements" }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "A collection of reusable UI components built with accessibility and customization in mind." })
          ] }),
          /* @__PURE__ */ jsx(Separator, { orientation: "horizontal", className: "my-6" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsx("div", { id: "alerts", children: /* @__PURE__ */ jsxs(ComponentSection, { title: "Alerts and Notifications", description: "Contextual feedback messages. TBA: Mobile Friendly, Inline, Toasts (Sonner), Cookie Consent and Dismissible", children: [
              /* @__PURE__ */ jsx("div", { id: "site-alerts", className: "space-y-6", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Site Level Alert Variants", children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsx(Alert, { className: "relative flex rounded-full py-2 px-3 pr-2 items-center bg-blue-500 border-0 text-white shadow-md backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 w-full", children: [
                /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-100", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(Badge, { className: "bg-blue-100 text-blue-600 uppercase font-bold", children: "New" }),
                  /* @__PURE__ */ jsx(AlertTitle, { className: "flex-1 leading-3.5", children: "New Feature Available" })
                ] }) }),
                /* @__PURE__ */ jsxs(Button, { className: "flex-shrink-0 h-6 text-white font-bold rounded-full flex items-center justify-center p-0 bg-blue-400 hover:bg-blue-50", children: [
                  "Check it out",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "text-white w-4 h-4" })
                ] })
              ] }) }) }) }) }),
              /* @__PURE__ */ jsx("div", { id: "page-alerts", className: "space-y-6", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Page Level Alert Variants", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx(Alert, { className: "relative flex", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(Info, { className: "h-6 w-6 text-blue-600" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(AlertTitle, { className: "mb-1", children: "Information Alert" }),
                    /* @__PURE__ */ jsx(AlertDescription, { children: "Check out our latest updates to improve your workflow and productivity." })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "info", children: "Learn More" })
                ] }) }),
                /* @__PURE__ */ jsx(Alert, { className: "flex items-start gap-4", variant: "success", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-green-50 to-green-100/50 border-2 border-green-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-6 w-6 text-green-600" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(AlertTitle, { className: "mb-1", children: "Successful Alert" }),
                    /* @__PURE__ */ jsx(AlertDescription, { children: "Your subscription will expire in 3 days. Renew now to avoid service interruption." })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "successful", children: "Take Me There" })
                ] }) }),
                /* @__PURE__ */ jsx(Alert, { className: "flex items-start gap-4", variant: "warning", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(TriangleAlert, { className: "h-6 w-6 text-amber-600" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(AlertTitle, { className: "mb-1", children: "Warning Alert" }),
                    /* @__PURE__ */ jsx(AlertDescription, { children: "Your subscription will expire in 3 days. Renew now to avoid service interruption." })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "warning", children: "Show Me Where" })
                ] }) }),
                /* @__PURE__ */ jsx(Alert, { className: "relative flex", variant: "destructive", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6 text-red-600" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx(AlertTitle, { className: "mb-1", children: "Upload Failed" }),
                    /* @__PURE__ */ jsx(AlertDescription, { children: "There was an error processing your file. Please check the format and try again." })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { variant: "destructive", children: "Retry" })
                ] }) }),
                /* @__PURE__ */ jsx(DismissibleAlert, {})
              ] }) }) }),
              /* @__PURE__ */ jsx("div", { id: "inline-alerts", className: "space-y-6", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Inline Alert Variants", children: /* @__PURE__ */ jsx(FormWithErrors, {}) }) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { id: "badges", children: /* @__PURE__ */ jsx(ComponentSection, { title: "Badges", description: "Small status indicators", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Badge Variants", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { children: "Default" }),
              /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Secondary" }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: "Outline" }),
              /* @__PURE__ */ jsx(Badge, { variant: "destructive", children: "Destructive" }),
              /* @__PURE__ */ jsxs(Badge, { variant: "location", children: [
                /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faLocationDot, className: "h-4 w-4" }),
                "Location"
              ] }),
              /* @__PURE__ */ jsx(Badge, { variant: "draft", children: "Draft" }),
              /* @__PURE__ */ jsx(Badge, { variant: "archived", children: "Archived" })
            ] }) }) }) }),
            /* @__PURE__ */ jsx("div", { id: "breadcrumbs", children: /* @__PURE__ */ jsxs(ComponentSection, { title: "Breadcrumbs", description: "Navigation indicators showing the user's location within a hierarchy.", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-base text-muted-foreground", children: [
                "It is a ",
                /* @__PURE__ */ jsx("strong", { children: "responsive" }),
                " breadcrumb that utilizes a ",
                /* @__PURE__ */ jsx("strong", { children: "Dropdown Menu" }),
                " to save space and a ",
                /* @__PURE__ */ jsx("strong", { children: "Drawer" }),
                " on mobile."
              ] }),
              /* @__PURE__ */ jsx(ComponentDemo, { title: "Dropdown & Drawer Breadcrumbs", children: /* @__PURE__ */ jsx(BreadcrumbResponsive, {}) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { id: "buttons", children: /* @__PURE__ */ jsxs(ComponentSection, { title: "Buttons", description: "Various button styles and states. Includes icon buttons, loading states, and more.", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-base text-muted-foreground", children: [
                "Buttons should have a clear message and call to action. ",
                /* @__PURE__ */ jsx("strong", { children: "1-3 words" }),
                " allowed to get message across clearly."
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-base text-muted-foreground", children: "Buttons are used to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation. They are typically placed within forms, modals, cards, and other interactive elements." }),
              /* @__PURE__ */ jsxs("p", { className: "text-base text-muted-foreground", children: [
                "Use ",
                /* @__PURE__ */ jsx("strong", { children: "title case" }),
                ", a convention for titles of works where major words like nouns, verbs, adjectives, and adverbs are capitalized, while minor words like articles (a, an, the), short prepositions, and most conjunctions are lowercased, unless they are the first or last word of the title."
              ] }),
              /* @__PURE__ */ jsxs(Collapsible, { children: [
                /* @__PURE__ */ jsx(CollapsibleTrigger, { className: "text-sm text-blue-600 underline cursor-pointer hover:text-blue-800", children: "What is Title Case?" }),
                /* @__PURE__ */ jsxs(CollapsibleContent, { className: "mt-2 text-sm text-muted-foreground [&_p]:leading-relaxed", children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-bold text-base mb-2", children: "General Title Case Rules" }),
                  /* @__PURE__ */ jsx("h4", { className: "text-base", children: "Capitalize the first word of the title" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-base", children: [
                    " ",
                    "(and any subtitle), regardless of whether it's a minor word.",
                    " "
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "text-base", children: "Capitalize the last word" }),
                  /* @__PURE__ */ jsx("p", { className: "text-base", children: "(and any subtitle), regardless of its part of speech." }),
                  /* @__PURE__ */ jsx("h4", { className: "text-base", children: "Capitalize all major words." }),
                  /* @__PURE__ */ jsxs("p", { className: "text-base", children: [
                    " ",
                    /* @__PURE__ */ jsxs("ul", { className: " text-sm list-disc list-inside  mt-1 mb-2", children: [
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Nouns" }),
                        " (e.g., book, city)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Pronouns" }),
                        " (e.g., he, she)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Verbs" }),
                        " (e.g., run, write)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Adjectives" }),
                        " (e.g., loud, happy)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Adverbs" }),
                        " (e.g., quickly, quietly)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Proper nouns" }),
                        " (e.g., America, John)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Certain conjunctions" }),
                        " (e.g., subordinating conjunctions like although, because)"
                      ] }),
                      /* @__PURE__ */ jsxs("li", { className: "mb-1", children: [
                        /* @__PURE__ */ jsx("strong", { children: "Long prepositions" }),
                        " (typically four letters or more) (e.g., between, among, during)"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "font-semibold text-base", children: "Lowercase Minor Words" }),
                  /* @__PURE__ */ jsxs("ul", { className: " text-sm list-disc list-inside  mt-1 mb-2", children: [
                    /* @__PURE__ */ jsx("li", { className: "mb-1", children: "Articles (a, an, the)" }),
                    /* @__PURE__ */ jsx("li", { className: "mb-1", children: "Short prepositions (up to three or four letters, depending on the style guide)" }),
                    /* @__PURE__ */ jsx("li", { className: "mb-1", children: "Coordinating conjunctions (and, but, or, for, nor, yet, so)" })
                  ] }),
                  /* @__PURE__ */ jsx("h4", { className: "mb-1 text-base", children: "Handle hyphenated words" }),
                  /* @__PURE__ */ jsx("p", { className: "mb-1 text-base", children: "by capitalizing the first part of the hyphenated word, and the second part only if it is a major word (e.g., Self-Report, Long-Term Solution)." })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { id: "button-variants", className: "space-y-6", children: /* @__PURE__ */ jsxs(ComponentDemo, { title: "Button Variants", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-8", children: [
                  /* @__PURE__ */ jsx(Button, { size: "lg", children: "This is Primary" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "secondary", children: "Secondary Button" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "outline", children: "Tertiary is Outlined" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "link", children: "Link" })
                ] }),
                /* @__PURE__ */ jsx("h4", { className: "text-sm text-muted-foreground font-medium mb-4", children: "Additional Variants" }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-4", children: [
                  /* @__PURE__ */ jsx(Button, { size: "lg", disabled: true, children: "Disabled" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "ghost", children: "Ghost" }),
                  /* @__PURE__ */ jsxs(Button, { size: "lg", variant: "outline", children: [
                    /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faEye, className: "w-4 h-4" }),
                    "With Icon"
                  ] }),
                  /* @__PURE__ */ jsx(Button, { size: "icon", variant: "outline", children: /* @__PURE__ */ jsx(FontAwesomeIcon, { icon: faEye, className: "w-4 h-4" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "info", children: "Info for You" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "successful", children: "Successful CTA" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "warning", children: "Warning CTA" }),
                  /* @__PURE__ */ jsx(Button, { size: "lg", variant: "destructive", children: "Urgent CTA" })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { id: "button-sizes", className: "space-y-6", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Button Sizes", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                /* @__PURE__ */ jsx(Button, { size: "sm", className: "text-xs", children: "Small" }),
                /* @__PURE__ */ jsx(Button, { size: "default", children: "Default" }),
                /* @__PURE__ */ jsx(Button, { size: "lg", children: "Large" })
              ] }) }) })
            ] }) }),
            /* @__PURE__ */ jsx("div", { id: "cards", children: /* @__PURE__ */ jsx(ComponentSection, { title: "Cards", description: "Flexible content containers", children: /* @__PURE__ */ jsx(ComponentDemo, { title: "Basic Card", children: /* @__PURE__ */ jsx("div", { className: "max-w-sm", children: /* @__PURE__ */ jsxs(Card, { children: [
              /* @__PURE__ */ jsxs(CardHeader, { children: [
                /* @__PURE__ */ jsx(CardTitle, { children: "Card Title" }),
                /* @__PURE__ */ jsx(CardDescription, { children: "Card description goes here." })
              ] }),
              /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { children: "This is the main content of the card." }) }),
              /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx(Button, { children: "Action" }) })
            ] }) }) }) }) })
          ] })
        ] }) }) }) }),
        /* @__PURE__ */ jsx(SidebarRight, { sections })
      ] })
    ] })
  ] });
}
export {
  App as component
};
