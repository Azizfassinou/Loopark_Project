'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MapPin, Search as SearchIcon, Loader2, Filter, Bike, Zap, Clock, Map, List } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/ui/MapView'), { ssr: false });

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

const TYPE_LABELS: Record<string, string> = {
    BIKE: 'Vélo',
    SCOOTER: 'Trottinette',
    BOTH: 'Vélo & Trotts',
};

export default function SearchPage() {
    const [spots, setSpots] = useState<Spot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [bookingSpotId, setBookingSpotId] = useState<string | null>(null);
    const [selectedDurations, setSelectedDurations] = useState<Record<string, number>>({});
    const [hoveredSpotId, setHoveredSpotId] = useState<string | null>(null);
    const [showMobileMap, setShowMobileMap] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [filterPriceType, setFilterPriceType] = useState<'' | 'free' | 'paid'>('');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<string>('desc');

    const router = useRouter();
    const { data: session } = useSession();

    const observer = useRef<IntersectionObserver | null>(null);
    const lastSpotElementRef = useCallback((node: HTMLDivElement | null) => {
        if (isLoading || isFetchingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingMore, hasMore]);

    const fetchedPages = useRef<Set<number>>(new Set());

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchSpots = useCallback(async (pageNum: number, isInitial: boolean = false, signal?: AbortSignal) => {
        if (fetchedPages.current.has(pageNum) && !isInitial) return;
        try {
            if (isInitial) {
                setIsLoading(true);
                fetchedPages.current.clear();
            } else {
                setIsFetchingMore(true);
            }
            const params = new URLSearchParams({ page: pageNum.toString(), limit: '24' });
            if (filterType !== 'ALL') params.append('type', filterType);
            if (filterPriceType) params.append('priceType', filterPriceType);
            if (debouncedSearch) params.append('search', debouncedSearch);
            params.append('sortBy', sortBy);
            params.append('sortOrder', sortOrder);

            const response = await fetch(`/api/spots?${params.toString()}`, { signal });
            const data = await response.json();
            fetchedPages.current.add(pageNum);

            if (isInitial) {
                setSpots(data.spots);
            } else {
                setSpots(prev => {
                    const existingIds = new Set(prev.map(s => s.id));
                    return [...prev, ...data.spots.filter((s: Spot) => !existingIds.has(s.id))];
                });
            }
            setTotal(data.total);
            setHasMore(data.spots.length > 0 && pageNum < data.totalPages);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [debouncedSearch, filterType, filterPriceType, sortBy, sortOrder]);

    useEffect(() => {
        const controller = new AbortController();
        setPage(1);
        fetchSpots(1, true, controller.signal);
        return () => controller.abort();
    }, [debouncedSearch, filterType, filterPriceType, sortBy, sortOrder, fetchSpots]);

    useEffect(() => {
        if (page > 1) fetchSpots(page, false);
    }, [page, fetchSpots]);

    const openInMaps = (lat: number | null, lng: number | null, address: string) => {
        let url: string;
        if (lat && lng) {
            // Vue Street View au sol en utilisant les coordonnées GPS
            url = `https://maps.google.com/?cbll=${lat},${lng}&cbp=12,90,,0,5&layer=c`;
        } else {
            // Fallback : recherche par adresse
            url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        }
        window.open(url, '_blank');
    };

    const handleBooking = async (spotId: string) => {
        if (!session?.user?.id) {
            router.push(`/login?callbackUrl=/app/search`);
            return;
        }
        setBookingSpotId(spotId);
        try {
            const now = new Date();
            // Ajouter 5s de buffer pour éviter le rejet "date dans le passé" dû à la latence réseau
            const startDate = new Date(now.getTime() + 5000);
            const duration = selectedDurations[spotId] || 1;
            const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    spotId,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }),
            });

            if (response.ok) {
                const booking = await response.json();
                router.push(`/app/booking/${booking.id}`);
            } else {
                const error = await response.json();
                alert(error.error || 'Impossible de réserver ce spot');
            }
        } catch {
            alert('Une erreur est survenue.');
        } finally {
            setBookingSpotId(null);
        }
    };

    const hasActiveFilters = debouncedSearch || filterType !== 'ALL' || filterPriceType || sortBy !== 'createdAt';

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-semibold text-[var(--foreground)]">Spots disponibles</h1>
                <p className="text-sm text-[var(--muted)] mt-1">{total.toLocaleString('fr-FR')} emplacements à Paris</p>
            </div>

            {/* Search & Filters */}
            <div className="space-y-2">
                {/* Search — full width */}
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                    <input
                        type="text"
                        placeholder="Quartier, rue, adresse..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 h-10 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-0 transition-colors hover:border-[var(--muted-foreground)]"
                    />
                </div>

                {/* Filters row — wraps on mobile */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* Type filter */}
                    <div className="flex items-center gap-1 border border-[var(--border)] rounded-md p-1 bg-[var(--background)] flex-shrink-0">
                        {[
                            { id: 'ALL', label: 'Tout' },
                            { id: 'BIKE', label: 'Vélos', icon: Bike },
                            { id: 'SCOOTER', label: 'Trotts', icon: Zap },
                        ].map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setFilterType(type.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-sm transition-colors ${filterType === type.id
                                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                                    : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                    }`}
                            >
                                {type.icon && <type.icon className="w-3.5 h-3.5" />}
                                <span className="sm:inline">{type.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Filtre Prix : boutons toggle Gratuit / Payant */}
                    <div className="flex gap-1 h-9">
                        <button
                            onClick={() => setFilterPriceType(filterPriceType === 'free' ? '' : 'free')}
                            className={`flex items-center gap-1 px-3 rounded text-sm transition-colors border ${
                                filterPriceType === 'free'
                                    ? 'bg-brand-green text-white border-brand-green'
                                    : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--background)]'
                            }`}
                        >
                            🆓 Gratuit
                        </button>
                        <button
                            onClick={() => setFilterPriceType(filterPriceType === 'paid' ? '' : 'paid')}
                            className={`flex items-center gap-1 px-3 rounded text-sm transition-colors border ${
                                filterPriceType === 'paid'
                                    ? 'bg-brand-green text-white border-brand-green'
                                    : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] bg-[var(--background)]'
                            }`}
                        >
                            💳 Payant
                        </button>
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => {
                            const val = e.target.value;
                            setSortBy(val);
                            setSortOrder(val === 'createdAt' ? 'desc' : 'asc');
                        }}
                        className="h-9 flex-1 min-w-[140px] sm:flex-none px-3 text-sm rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer"
                    >
                        <option value="createdAt">Plus récents</option>
                        <option value="price">Moins cher</option>
                        <option value="capacity">Plus de places</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setFilterType('ALL');
                                setFilterPriceType('');
                                setSortBy('createdAt');
                                setSortOrder('desc');
                            }}
                            className="h-9 px-3 text-sm text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                        >
                            Réinitialiser
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* Liste des spots */}
                <div className={`lg:col-span-3 space-y-6 ${showMobileMap ? 'hidden lg:block' : 'block'}`}>
                    {isLoading && page === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 rounded-lg bg-[var(--surface)] animate-pulse border border-[var(--border)]" />
                            ))}
                        </div>
                    ) : spots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <SearchIcon className="h-8 w-8 text-[var(--muted-foreground)] mb-4" />
                            <h3 className="text-base font-semibold mb-1">Aucun résultat</h3>
                            <p className="text-sm text-[var(--muted)] max-w-xs">
                                Essayez des critères moins restrictifs.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {spots.map((spot, index) => (
                                    <Card
                                        key={spot.id}
                                        ref={index === spots.length - 1 ? lastSpotElementRef : null}
                                        onMouseEnter={() => setHoveredSpotId(spot.id)}
                                        onMouseLeave={() => setHoveredSpotId(null)}
                                        className="flex flex-col overflow-hidden hover:border-[var(--muted-foreground)] transition-colors"
                                    >
                                        <CardContent className="flex-1 pt-6 space-y-4">
                                            {/* Header row */}
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-[var(--foreground)] truncate">{spot.title}</h3>
                                                    <button
                                                        onClick={() => openInMaps(spot.latitude, spot.longitude, spot.address)}
                                                        className="flex items-center gap-1 mt-1 text-xs text-[var(--muted)] hover:text-brand-green transition-colors text-left"
                                                    >
                                                        <MapPin className="h-3 w-3 flex-shrink-0" />
                                                        <span className="truncate">{spot.address.split(',')[0]}</span>
                                                    </button>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <span className="text-lg font-semibold text-[var(--foreground)]">
                                                        {spot.price === 0 ? 'Gratuit' : `${spot.price} €`}
                                                    </span>
                                                    {spot.price > 0 && <span className="text-xs text-[var(--muted)] ml-1">/h</span>}
                                                </div>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                                                <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--surface)]">
                                                    {TYPE_LABELS[spot.type]}
                                                </span>
                                                <span>{spot.capacity} place{spot.capacity > 1 ? 's' : ''}</span>
                                                <span>Par {spot.host.name}</span>
                                            </div>

                                            {/* Description */}
                                            {spot.description && (
                                                <p className="text-sm text-[var(--muted)] line-clamp-2 leading-relaxed">
                                                    {spot.description}
                                                </p>
                                            )}

                                            {/* Duration */}
                                            <div className="flex items-center gap-2 pt-1">
                                                <Clock className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                                                <select
                                                    value={selectedDurations[spot.id] || 1}
                                                    onChange={(e) => setSelectedDurations(prev => ({ ...prev, [spot.id]: parseInt(e.target.value) }))}
                                                    className="text-sm text-[var(--foreground)] bg-transparent border-none focus:outline-none cursor-pointer"
                                                >
                                                    <option value={1}>1 heure</option>
                                                    <option value={2}>2 heures</option>
                                                    <option value={4}>4 heures</option>
                                                    <option value={12}>12 heures</option>
                                                    <option value={24}>24 heures</option>
                                                </select>
                                                {spot.price > 0 && (
                                                    <span className="ml-auto text-sm font-medium text-[var(--foreground)]">
                                                        {(spot.price * (selectedDurations[spot.id] || 1)).toFixed(2)} €
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>

                                        <CardFooter className="border-t border-[var(--border)] pt-4">
                                            <Button
                                                onClick={() => handleBooking(spot.id)}
                                                isLoading={bookingSpotId === spot.id}
                                                disabled={!!bookingSpotId}
                                                className="w-full"
                                                size="sm"
                                            >
                                                {bookingSpotId === spot.id ? 'Réservation...' : 'Réserver'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>

                            {isFetchingMore && (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="h-5 w-5 text-[var(--muted)] animate-spin" />
                                </div>
                            )}

                            {!hasMore && spots.length > 0 && (
                                <p className="text-center text-xs text-[var(--muted)] py-8">
                                    Tous les spots ont été chargés
                                </p>
                            )}
                        </>
                    )}
                </div>

                {/* Carte interactive */}
                <div className={`lg:col-span-2 lg:sticky lg:top-24 h-[450px] lg:h-[600px] w-full z-0 ${showMobileMap ? 'block' : 'hidden lg:block'}`}>
                    <MapView
                        spots={spots}
                        hoveredSpotId={hoveredSpotId}
                        onSelectSpot={(spotId) => {
                            setHoveredSpotId(spotId);
                        }}
                    />
                </div>
            </div>

            {/* Bouton de bascule mobile */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 lg:hidden">
                <button
                    type="button"
                    onClick={() => setShowMobileMap(!showMobileMap)}
                    className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-5 py-3 rounded-full shadow-lg font-semibold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                    {showMobileMap ? (
                        <>
                            <List className="h-4 w-4" />
                            Afficher la liste
                        </>
                    ) : (
                        <>
                            <Map className="h-4 w-4" />
                            Afficher la carte
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
