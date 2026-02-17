import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, options, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="text-sm font-medium leading-none mb-2 block text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <select
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-200 focus-visible:ring-green-500'}
            ${className}`}
                    ref={ref}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
