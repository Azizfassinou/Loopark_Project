export default function SearchPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Trouver une place</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder for spots */}
                <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-xl font-semibold">Spot Exemple</h2>
                    <p className="text-gray-600 dark:text-gray-400">Une place de parking disponible</p>
                </div>
            </div>
        </div>
    )
}
