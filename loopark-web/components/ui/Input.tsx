import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={`flex h-9 w-full rounded-md border px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50
                        ${error
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-[var(--border)] hover:border-[var(--muted-foreground)]'
                        }
                        ${className ?? ''}`}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
