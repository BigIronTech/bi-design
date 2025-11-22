import { jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { j as cn } from "./button-toggle-C0d9vO61.js";
const alertVariants = cva(
  "relative w-full rounded-xl border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-50 to-blue-100/50 border-2 border-blue-200 text-lg text-slate-900 font-normal p-6 shadow-lg [&>svg]:text-blue-700 *:data-[slot=alert-description]:text-slate-700",
        success: "bg-gradient-to-r from-green-50 to-green-100/50 border-2 border-green-200 text-lg text-slate-900 p-6 shadow-lg [&>svg]:text-green-700 *:data-[slot=alert-description]:text-slate-700:leading-relaxed:font-normal",
        warning: "bg-gradient-to-r from-amber-50 to-amber-100/50 border-2 border-amber-200 text-lg text-slate-900 p-6 shadow-lg [&>svg]:text-destructive *:data-[slot=alert-description]:text-slate-700:leading-relaxed:font-normal",
        destructive: "bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 text-lg text-slate-900 p-6 shadow-lg [&>svg]:text-destructive *:data-[slot=alert-description]:text-slate-700"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-title",
      className: cn(
        "col-start-2 line-clamp-1 text-lg min-h-4 font-semibold",
        className
      ),
      ...props
    }
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      ),
      ...props
    }
  );
}
export {
  Alert as A,
  AlertTitle as a,
  AlertDescription as b
};
