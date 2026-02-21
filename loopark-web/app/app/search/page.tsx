'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Bike, Scooter, Search as SearchIcon } from 'lucide-react';

interface Host {
    name: string;
}

interface Spot {
    id: string;
    title: string;
    description: string | null;
    address: string;
    type: 'BIKE' | 'SCOOTER' | 'BOTH';
    price: number;
    capacity: number;
    host: Host;
}

export default function SearchPage() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter(); // Initialized useRouter

    useEffect(() => {
        // Check session
        const user = localStorage.getItem('loopark_user');
        if (!user) {
            router.push('/login');
            return;
        }

        async function fetchSpots() {
            try {
                const response = await fetch('/api/spots');
                const data = await response.json();
                setSpots(data);
            } catch (error) {
                console.error('Error fetching spots:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSpots();
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'BIKE': return <Bike className="h-4 w-4" />;
            case 'SCOOTER': return <Scooter className="h-4 w-4" />;
            default: return <div className="flex gap-1"><Bike className="h-4 w-4" /><Scooter className="h-4 w-4" /></div>;
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trouver une place</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Découvrez les parkings sécurisés autour de vous.</p>
                </div>

                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Rechercher une adresse..."
                        className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : spots.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun parking trouvé pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spots.map((spot) => (
                        <Card key={spot.id} className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-none bg-white dark:bg-gray-900 shadow-lg">
                            <div className="h-40 bg-gradient-to-br from-green-400 to-green-600 relative p-6 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-medium text-white flex items-center gap-2">
                                        {getTypeIcon(spot.type)}
                                        {spot.type === 'BOTH' ? 'Mixte' : spot.type}
                                    </div>
                                    <div className="bg-white rounded-xl px-3 py-1 shadow-sm">
                                        <span className="text-green-700 font-bold">{spot.price}€</span>
                                        <span className="text-gray-500 text-xs ml-1">/h</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-white/90 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span className="truncate">{spot.address.split(',')[1] || spot.address}</span>
                                </div>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl group-hover:text-green-600 transition-colors truncate">
                                    {spot.title}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pb-4">
                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 min-h-[40px]">
                                    {spot.description || "Pas de description fournie."}
                                </p>
                                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                                    <span>Hôte : <span className="font-medium text-gray-700 dark:text-gray-300">{spot.host.name}</span></span>
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{spot.capacity} places de libre</span>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0 border-t border-gray-50 dark:border-gray-800 mt-2">
                                <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white rounded-xl h-12">
                                    Réserver maintenant
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
