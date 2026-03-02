'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/ui/Navbar';
import { MapPin, Bike, Scooter, Search as SearchIcon, Compass, Sparkles, Filter } from 'lucide-react';

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
    const router = useRouter();

    useEffect(() => {
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                {/* Hero / Hero-ish Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-black uppercase tracking-widest border border-brand-green/20">
                            <Sparkles className="h-3.5 w-3.5" />
                            Trouver un parking
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Explorez vos <span className="gradient-text">destinations</span>
                        </h1>
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl">
                            Découvrez les parkings sécurisés les mieux notés autour de vous, réservés par la communauté Loopark.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 sm:w-80 group">
                            <div className="absolute inset-0 bg-brand-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                            <input
                                type="text"
                                placeholder="Rechercher une adresse..."
                                className="pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl w-full focus:outline-none focus:ring-4 focus:ring-brand-green/20 transition-all relative z-10 font-medium placeholder:text-slate-400"
                            />
                        </div>
                        <Button variant="secondary" className="h-full px-6 flex items-center gap-2 font-bold shadow-lg">
                            <Filter className="h-5 w-5" />
                            <span className="hidden sm:inline">Filtres</span>
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border-2 border-slate-50 dark:border-slate-800" />
                        ))}
                    </div>
                ) : spots.length === 0 ? (
                    <div className="text-center py-32 glass rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-4">
                        <Compass className="h-16 w-16 text-slate-300 dark:text-slate-700 animate-bounce" />
                        <p className="text-slate-500 dark:text-slate-400 text-xl font-bold">Aucun parking trouvé pour le moment.</p>
                        <Button variant="outline" onClick={() => router.refresh()}>Actualiser la zone</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        {spots.map((spot) => (
                            <Card key={spot.id} className="overflow-hidden group flex flex-col shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-brand-green/20">
                                {/* Spot Card Header with Gradient and Overlay */}
                                <div className="h-48 relative overflow-hidden">
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 group-hover:scale-110 ${spot.type === 'BIKE' ? 'from-brand-green to-emerald-500' :
                                            spot.type === 'SCOOTER' ? 'from-brand-purple to-indigo-600' :
                                                'from-cyan-400 to-brand-green'
                                        }`} />

                                    {/* Decorative dots/pattern as seen in the premium UI */}
                                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:10px_10px]" />

                                    <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="glass px-4 py-2 rounded-xl text-xs font-black text-white flex items-center gap-2 border-white/30 backdrop-blur-md">
                                                {getTypeIcon(spot.type)}
                                                {spot.type === 'BOTH' ? 'MIXTE' : spot.type}
                                            </div>
                                            <div className="bg-white rounded-2xl px-4 py-2 shadow-xl border border-slate-50 transition-transform group-hover:scale-110">
                                                <span className="text-brand-green font-black text-lg">{spot.price}€</span>
                                                <span className="text-slate-400 text-xs font-bold ml-1 uppercase">/h</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-white font-bold text-sm bg-black/10 backdrop-blur-sm -mx-6 px-6 py-2">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            <span className="truncate">{spot.address.split(',')[1] || spot.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-4 min-h-[90px]">
                                    <CardTitle className="text-2xl group-hover:gradient-text transition-all duration-300">
                                        {spot.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                                        {spot.description || "Un espace sécurisé et surveillé pour votre moyen de locomotion doux au coeur de la ville."}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-brand-purple/10 flex items-center justify-center font-black text-brand-purple text-xs border border-brand-purple/10">
                                                {spot.host.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hôte</span>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{spot.host.name}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Dispo</span>
                                            <span className="text-sm font-black text-brand-green">{spot.capacity} places</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button className="w-full text-base font-black tracking-wide h-14" variant="default">
                                        RESERVER MAINTENANT
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
