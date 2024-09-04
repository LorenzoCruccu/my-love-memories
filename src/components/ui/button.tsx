import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepPurple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-lavender",
  {
    variants: {
      variant: {
        default: "rounded-full bg-purple px-4 py-2 text-white",
				actionAnimated: "text-white rounded-full transition-transform transition-colors transition duration-300 ease-in-out hover:outline-none hover:ring-2 hover:ring-white hover:scale-110 hover:text-xl",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 dark:bg-red-700 dark:text-white dark:hover:bg-red-700/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        secondary:
          "bg-lightPurple text-white hover:bg-lightPurple/80 dark:bg-purple dark:text-white dark:hover:bg-purple/80",
        ghost:
          "hover:bg-lightPurple hover:text-white dark:hover:bg-purple dark:hover:text-white",
        link: "text-deepPurple underline-offset-4 hover:underline dark:text-lavender",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
