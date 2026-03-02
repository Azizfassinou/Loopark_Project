import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 select-none",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-br from-brand-green via-brand-cyan to-brand-purple text-white shadow-xl shadow-brand-green/10 hover:shadow-brand-green/20 border-none transition-shadow",
                primary: "bg-brand-green text-white hover:bg-brand-green/90 shadow-lg shadow-brand-green/10",
                purple: "bg-brand-purple text-white hover:bg-brand-purple/90 shadow-lg shadow-brand-purple/10",
                outline: "border-2 border-brand-green bg-transparent text-brand-green hover:bg-brand-green/5 font-black",
                secondary: "bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
                ghost: "hover:bg-slate-50 hover:text-brand-green text-slate-500 dark:text-slate-400 dark:hover:bg-slate-900 font-bold",
                destructive: "bg-red-500/5 text-red-600 hover:bg-red-500 hover:text-white",
                link: "text-brand-purple underline-offset-4 hover:underline",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-10 text-base",
                icon: "h-12 w-12 rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
