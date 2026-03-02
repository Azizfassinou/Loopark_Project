import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full relative group">
                {label && (
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2 block px-1">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={`flex h-14 w-full rounded-3xl border bg-slate-50/50 dark:bg-slate-900/50 px-6 py-4 text-sm font-semibold ring-offset-background transition-all duration-300 placeholder:text-slate-300 focus:bg-white dark:focus:bg-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-green/10 disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500/50 shadow-sm shadow-red-500/5' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 shadow-sm shadow-slate-200/20 dark:shadow-none'}
            ${className}`}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-[10px] font-black text-red-500 mt-1 uppercase tracking-wider px-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
