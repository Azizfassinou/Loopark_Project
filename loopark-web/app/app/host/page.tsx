export default function HostPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Espace Hôte</h1>
            <div className="grid gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-2">Mes annonces</h2>
                    <p className="text-gray-500">Aucune annonce pour le moment.</p>
                    <button className="mt-4 bg-primary text-blue-600 hover:text-blue-700 font-medium">
                        + Ajouter un spot
                    </button>
                </div>
            </div>
        </div>
    )
}
