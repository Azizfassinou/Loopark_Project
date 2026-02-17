export default async function BookingPage({ params }: { params: { id: string } }) {
    // Wait for params to destructure if using the latest Next.js 15+ patterns, 
    // but for basic setup this works. 
    // Note: in Next.js 15 param props are promises.
    // Assuming Next.js 14/15 context:
    const { id } = await params;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Réservation du Spot #{id}</h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <p className="mb-4">Détails de la réservation...</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Confirmer la réservation
                </button>
            </div>
        </div>
    )
}
