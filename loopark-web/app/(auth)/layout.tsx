import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen grid items-center justify-items-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="mb-6 text-center">
                    <Link href="/" className="text-2xl font-bold text-primary">Loopark</Link>
                </div>
                {children}
            </div>
        </div>
    );
}
