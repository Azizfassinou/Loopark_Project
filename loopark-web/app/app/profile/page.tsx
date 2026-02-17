export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Mon Profil</h1>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
                    <div className="space-y-2">
                        <p><span className="font-medium text-gray-500 w-24 inline-block">Nom :</span> Utilisateur Test</p>
                        <p><span className="font-medium text-gray-500 w-24 inline-block">Email :</span> user@example.com</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4">Historique</h2>
                    <p className="text-gray-500 italic">Aucune réservation passée.</p>
                </div>
            </div>
        </div>
    )
}
