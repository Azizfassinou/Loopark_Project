'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
    latitude: number | null;
    longitude: number | null;
}

export default function SearchPage() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedSpots, setExpandedSpots] = useState<Record<string, boolean>>({});
    const router = useRouter();

    const toggleDescription = (id: string) => {
        setExpandedSpots(prev => ({ ...prev, [id]: !prev[id] }));
    };

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

    const openInMaps = (lat: number | null, lng: number | null, address: string) => {
        if (lat && lng) {
            window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
        } else {
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfdfd] dark:bg-[#020617]">
            <main className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-4">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-green/5 text-brand-green text-[10px] font-black uppercase tracking-[0.2em] border border-brand-green/10">
                            <Sparkles className="h-4 w-4" />
                            Paris • Open Mobility
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                            Besoin d'un <span className="gradient-text">spot</span> ?
                        </h1>
                        <p className="text-xl font-medium text-slate-400 max-w-xl leading-relaxed">
                            Accédez instantanément au réseau de stationnement sécurisé de la capitale.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 sm:w-96 group">
                            <div className="absolute inset-0 bg-brand-green/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
                            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                            <input
                                type="text"
                                placeholder="Chercher un quartier, une rue..."
                                className="pl-16 pr-6 py-5 bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] w-full focus:outline-none focus:ring-4 focus:ring-brand-green/10 transition-all relative z-10 font-bold text-slate-900 dark:text-white placeholder:text-slate-300"
                            />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[450px] rounded-[3rem] bg-slate-50 dark:bg-slate-900/40 animate-pulse border border-slate-100 dark:border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                        {spots.map((spot) => (
                            <Card key={spot.id} className="overflow-hidden group flex flex-col bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-100 dark:border-white/5 hover:border-brand-green/30 transition-all duration-500 shadow-xl hover:shadow-[0_32px_64px_-16px_rgba(74,222,128,0.15)]">
                                {/* Visual Header */}
                                <div className="h-56 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-green via-emerald-500 to-brand-cyan opacity-80 group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[size:16px_16px]" />

                                    <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                        <div className="flex justify-between items-start">
                                            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                                                {spot.type}
                                            </div>
                                            <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] px-5 py-2.5 shadow-2xl transition-transform group-hover:scale-110">
                                                <span className="text-brand-green font-black text-xl">{spot.price === 0 ? 'GO' : `${spot.price}€`}</span>
                                                <span className="text-slate-400 text-[10px] font-black ml-1 uppercase tracking-widest leading-none">
                                                    {spot.price === 0 ? 'OFFERT' : '/H'}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => openInMaps(spot.latitude || null, spot.longitude || null, spot.address)}
                                            className="bg-black/20 hover:bg-black/40 backdrop-blur-xl -mx-8 px-8 py-4 flex items-center justify-between cursor-pointer transition-colors group/address"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-white animate-pulse" />
                                                <span className="text-white font-black text-sm tracking-tight truncate max-w-[200px]">
                                                    {spot.address.split(',')[0]}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-black text-white/60 uppercase tracking-widest group-hover/address:text-white transition-colors">
                                                Ouvrir Maps →
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="p-8 pb-4">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:gradient-text transition-all duration-300">
                                        {spot.title}
                                    </h3>
                                </CardHeader>

                                <CardContent className="px-8 flex-1">
                                    <div className="relative">
                                        <p className={`text-slate-400 font-medium text-base leading-relaxed ${expandedSpots[spot.id] ? '' : 'line-clamp-2'}`}>
                                            {spot.description}
                                        </p>
                                        <button
                                            onClick={() => toggleDescription(spot.id)}
                                            className="mt-2 text-[10px] font-black uppercase tracking-widest text-brand-green hover:text-brand-green/80 transition-colors flex items-center gap-1"
                                        >
                                            {expandedSpots[spot.id] ? 'Voir moins' : 'Plus +'}
                                        </button>
                                    </div>

                                    <div className="mt-8 grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 space-y-1">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Capacité</span>
                                            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                                                {spot.capacity} <span className="text-xs text-slate-400">places</span>
                                            </span>
                                        </div>
                                        <div className="p-5 rounded-[2rem] bg-brand-green/5 border border-brand-green/10 space-y-1">
                                            <span className="text-[9px] font-black text-brand-green uppercase tracking-widest block">Statut</span>
                                            <span className="text-xl font-black text-brand-green leading-none">Libre</span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-8 pt-4">
                                    <Button className="w-full h-16 rounded-3xl text-[10px] font-black tracking-[0.2em] shadow-2xl shadow-brand-green/20 group-hover:scale-[1.02] transition-transform">
                                        RÉSERVER CE SPOT
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
