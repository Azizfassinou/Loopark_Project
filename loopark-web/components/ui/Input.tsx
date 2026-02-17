import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-green-500'}
            ${className}`}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
